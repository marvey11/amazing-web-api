import config from "config";
import { Service } from "typedi";
import { Connection, DeleteResult, getConnection, getRepository, Repository } from "typeorm";
import { CreateOrUpdateWishlistItemRequest, DeleteWishlistItemRequest, GetWishlistItemOptions } from "../dtos";
import { PriceItem, Wishlist, WishlistItem } from "../entities";
import { WishlistService } from "./wishlist.service";

@Service()
class WishlistItemService {
  private connectionName: string;
  private connection: Connection;
  private repository: Repository<WishlistItem>;

  constructor(private wishlistService: WishlistService) {
    this.connectionName = config.get("ormconfig.connection") as string;
    this.connection = getConnection(this.connectionName);
    this.repository = getRepository<WishlistItem>(WishlistItem, this.connectionName);
  }

  async getOneByID(id: string, options: GetWishlistItemOptions = { "with-prices": false }): Promise<WishlistItem> {
    const { "with-prices": withPrices } = options;

    const query = this.connection
      .createQueryBuilder()
      .select("item.id")
      .addSelect("item.title")
      .from(WishlistItem, "item")
      .where("item.id = :itid", { itid: id });

    if (withPrices) {
      query.leftJoin("item.priceItems", "pr").addSelect("pr");
    }

    console.log(query.getSql());

    return query.getOneOrFail();
  }

  createMany = async (data: CreateOrUpdateWishlistItemRequest[]): Promise<WishlistItem[]> => {
    return Promise.all(data.map(this.createOne));
  };

  createOne = async (data: CreateOrUpdateWishlistItemRequest): Promise<WishlistItem> => {
    return this.wishlistService.getOneByID(data.wishlist_id).then(async (wl: Wishlist) => {
      return this.getOneByID(data.id)
        .then(() => true)
        .catch(() => false)
        .then((exists: boolean) => {
          if (exists) {
            throw new Error(`A wishlist item with ID ${data.id} already exists`);
          } else {
            // price will be stored in its table due to cascade on insert
            const price = new PriceItem();
            price.itemDate = new Date(data.date);
            price.itemPrice = data.price;

            const wli = new WishlistItem();
            wli.id = data.id;
            wli.title = data.name;
            wli.wishlist = wl;
            wli.priceItems = [price];
            return this.repository.save(wli);
          }
        });
    });
  };

  updateMany = async (data: CreateOrUpdateWishlistItemRequest[]): Promise<WishlistItem[]> => {
    return Promise.all(data.map(this.updateOne));
  };

  updateOne = async (data: CreateOrUpdateWishlistItemRequest): Promise<WishlistItem> => {
    return this.wishlistService.getOneByID(data.wishlist_id).then(async (wl: Wishlist) => {
      const wli = await this.getOneByID(data.id, { "with-prices": true });
      const price = new PriceItem();
      price.itemDate = new Date(data.date);
      price.itemPrice = data.price;
      console.log(wli.priceItems);
      wli.wishlist = wl;
      wli.title = data.name;
      wli.priceItems.push(price);
      return await this.repository.save(wli);
    });
  };

  deleteMany = async (data: DeleteWishlistItemRequest[]): Promise<DeleteResult[]> => {
    return Promise.all(
      data.map((req: DeleteWishlistItemRequest) => {
        return this.repository.delete(req.id);
      })
    );
  };
}

export { WishlistItemService };
