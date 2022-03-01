import config from "config";
import { Service } from "typedi";
import { Connection, DeleteResult, getConnection, getRepository, Repository, SelectQueryBuilder } from "typeorm";
import {
  CreateOrUpdateWishlistItemRequest,
  CreateWishlistRequest,
  DeleteWishlistItemRequest,
  GetWishlistItemOptions,
  GetWishlistOptions,
  ModifyWishlistRequest
} from "../dtos";
import { PriceItem, Wishlist, WishlistItem } from "../entities";

@Service()
export class RepositoryService {
  private connectionName: string;
  private connection: Connection;

  private wishlists: Repository<Wishlist>;
  private wishlistItems: Repository<WishlistItem>;

  constructor() {
    this.connectionName = config.get("ormconfig.connection") as string;
    this.connection = getConnection(this.connectionName);

    this.wishlists = getRepository<Wishlist>(Wishlist, this.connectionName);
    this.wishlistItems = getRepository<WishlistItem>(WishlistItem, this.connectionName);
  }

  getAllWishlists = async (
    options: GetWishlistOptions = { "with-items": true, "with-prices": true }
  ): Promise<Wishlist[]> => {
    const query = this.createBasicGetWishlistQuery();
    this.addWishlistQueryOptions(query, options);
    return query.getMany();
  };

  getOneWishlistByID = async (id: string, options: GetWishlistOptions = { "with-items": false }): Promise<Wishlist> => {
    // basic query augmented with WHERE clause so that the result is equivalent to
    // SELECT list.id, list.name FROM wishlists AS list WHERE list.id = ?
    const query = this.createBasicGetWishlistQuery().where("list.id = :wid", { wid: id });
    this.addWishlistQueryOptions(query, options);
    return query.getOneOrFail();
  };

  private createBasicGetWishlistQuery = (): SelectQueryBuilder<Wishlist> => {
    // basic select statement that only returns all the wishlists; equivalent to
    // SELECT list.id, list.name FROM wishlists AS list;
    return this.connection.createQueryBuilder().select(["list.id", "list.name"]).from(Wishlist, "list");
  };

  private addWishlistQueryOptions = (query: SelectQueryBuilder<Wishlist>, options: GetWishlistOptions): void => {
    const { "with-items": withItems, "with-prices": withPrices, "latest-only": latestOnly } = options;

    if (withItems) {
      // we want the items associated to the wishlist returned as well
      // --> add a left join on the items table and additional select select statements
      query.leftJoin("list.items", "item").addSelect("item");

      this.addWishlistItemQueryOptions<Wishlist>(query, {
        "with-prices": withPrices,
        "latest-only": latestOnly
      });
    }
  };

  createOneWishlist = async (data: CreateWishlistRequest): Promise<Wishlist> => {
    return this.getOneWishlistByID(data.id)
      .then(() => true) // map entity exists to true for the next chain
      .catch(() => false) // map entity exists to false for the next chain
      .then((exists: boolean) => {
        // takes the exists argument from the previous then/catch
        if (exists) {
          // a wishlist with the same ID already exists --> throw an error
          throw new Error(`A wishlist with ID ${data.id} already exists`);
        }

        // a matching wishlist could not be found --> create a new one
        const wl: Wishlist = new Wishlist();
        wl.id = data.id;
        wl.name = data.name;
        wl.items = [];
        return this.wishlists.save(wl);
      });
  };

  updateOneWishlist = async (id: string, data: ModifyWishlistRequest): Promise<Wishlist> => {
    return this.getOneWishlistByID(id).then((wishlist: Wishlist) => {
      // a wishlist with the same ID was found --> update the name
      wishlist.name = data.name;
      return this.wishlists.save(wishlist);
    });
  };

  deleteOneWishlist = async (id: string): Promise<DeleteResult> => {
    return this.wishlists.delete({ id: id });
  };

  getAllWishlistItems = async (options: GetWishlistItemOptions = { "with-prices": false }): Promise<WishlistItem[]> => {
    const query = this.createBasicGetWishlistItemQuery();
    this.addWishlistItemQueryOptions<WishlistItem>(query, options);
    return query.getMany();
  };

  getOneWishlistItemByID = async (
    id: string,
    options: GetWishlistItemOptions = { "with-prices": false }
  ): Promise<WishlistItem> => {
    const query = this.createBasicGetWishlistItemQuery().where("item.id = :item_id", { item_id: id });
    this.addWishlistItemQueryOptions<WishlistItem>(query, options);
    return query.getOneOrFail();
  };

  private createBasicGetWishlistItemQuery() {
    return this.connection.createQueryBuilder().select("item").from(WishlistItem, "item");
  }

  private addWishlistItemQueryOptions = <T>(query: SelectQueryBuilder<T>, options: GetWishlistItemOptions): void => {
    const { "with-prices": withPrices, "latest-only": latestOnly } = options;

    if (withPrices) {
      // returning prices only makes sense if we are already adding the items; otherwise ignoring the option
      // --> add a left join with the prices table and additional select statements
      query.leftJoin("item.priceItems", "price").addSelect("price");

      if (latestOnly) {
        // add sub-query
        query
          .leftJoin((qb) => this.getLatestPriceItemDates(qb.subQuery()), "ldates", "price.itemId = ldates.item_id")
          .andWhere("price.itemDate = latest_date");
      }
    }
  };

  createManyWishlistItems = async (data: CreateOrUpdateWishlistItemRequest[]): Promise<WishlistItem[]> => {
    return Promise.all(data.map(this.createOneWishlistItem));
  };

  createOneWishlistItem = async (data: CreateOrUpdateWishlistItemRequest): Promise<WishlistItem> => {
    return this.getOneWishlistByID(data.wishlist_id).then(async (wl: Wishlist) => {
      return this.getOneWishlistItemByID(data.id)
        .then(() => true)
        .catch(() => false)
        .then((exists: boolean) => {
          if (exists) {
            throw new Error(`A wishlist item with ID ${data.id} already exists`);
          } else {
            // price will be stored in its own table due to cascade-on-insert
            const price = new PriceItem();
            price.itemDate = new Date(data.date);
            price.itemPrice = data.price;

            const wli = new WishlistItem();
            wli.id = data.id;
            wli.title = data.name;
            wli.wishlist = wl;
            wli.priceItems = [price];

            return this.wishlistItems.save(wli);
          }
        });
    });
  };

  updateManyWishlistItems = async (data: CreateOrUpdateWishlistItemRequest[]): Promise<WishlistItem[]> => {
    return Promise.all(data.map(this.updateOneWishlistItem));
  };

  updateOneWishlistItem = async (data: CreateOrUpdateWishlistItemRequest): Promise<WishlistItem> => {
    return this.getOneWishlistByID(data.wishlist_id).then(async (wl: Wishlist) => {
      const wli = await this.getOneWishlistItemByID(data.id, { "with-prices": true, "latest-only": false });

      const price = new PriceItem();
      price.itemDate = new Date(data.date);
      price.itemPrice = data.price;

      wli.wishlist = wl;
      wli.title = data.name;
      wli.priceItems.push(price);

      return await this.wishlistItems.save(wli);
    });
  };

  deleteManyWishlistItems = async (data: DeleteWishlistItemRequest[]): Promise<DeleteResult[]> => {
    return Promise.all(
      data.map((req: DeleteWishlistItemRequest) => {
        return this.wishlistItems.delete(req.id);
      })
    );
  };

  getLatestPriceItemDates = (qb: SelectQueryBuilder<PriceItem>): SelectQueryBuilder<PriceItem> => {
    return qb
      .select("price.itemId", "item_id")
      .addSelect("MAX(price.itemDate)", "latest_date")
      .from(PriceItem, "price")
      .groupBy("item_id");
  };
}
