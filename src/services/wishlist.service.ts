import config from "config";

import { Service } from "typedi";
import { Connection, DeleteResult, getConnection, getRepository, Repository } from "typeorm";

import { CreateWishlistRequest, GetWishlistOptions, ModifyWishlistRequest } from "../dtos";
import { Wishlist } from "../entities";

@Service()
class WishlistService {
  private connectionName: string;
  private connection: Connection;
  private repository: Repository<Wishlist>;

  constructor() {
    this.connectionName = config.get("ormconfig.connection") as string;
    this.connection = getConnection(this.connectionName);
    this.repository = getRepository<Wishlist>(Wishlist, this.connectionName);
  }

  async getAll(options: GetWishlistOptions = { "with-items": true, "with-prices": true }): Promise<Wishlist[]> {
    // basic select statement that only returns all the wishlists; equivalent to
    // SELECT wl.id, wl.name FROM wishlists AS wl;
    const query = this.connection.createQueryBuilder().select(["wl.id", "wl.name"]).from(Wishlist, "wl");

    if (options["with-items"]) {
      // we want the items associated to the wishlist returned as well
      // --> add a left join on the items table and additional select select statements
      query.leftJoin("wl.items", "it").addSelect("it");

      if (options["with-prices"]) {
        // returning prices only makes sense if we are already adding the items; otherwise ignoring the option
        // --> add a left join with the prices table and additional select statements
        query.leftJoin("it.priceItems", "pr").addSelect("pr");
      }
    }

    return query.getMany();
  }

  async getOneByID(id: string, options: GetWishlistOptions = { "with-items": false }): Promise<Wishlist> {
    // basic select statement that only returns the wishlist with the provided ID; equivalent to
    // SELECT wl.id, wl.name FROM wishlists AS wl WHERE wl.id = ?
    const query = this.connection
      .createQueryBuilder()
      .select(["wl.id", "wl.name"])
      .from(Wishlist, "wl")
      .where("wl.id = :wid", { wid: id });

    if (options["with-items"]) {
      // we want the items associated to the wishlist returned as well
      // --> add a left join on the items table and additional select select statements
      query.leftJoin("wl.items", "it").addSelect("it");

      if (options["with-prices"]) {
        // returning prices only makes sense if we are already adding the items; otherwise ignoring the option
        // --> add a left join with the prices table and additional select statements
        query.leftJoin("it.priceItems", "pr").addSelect("pr");
      }
    }

    return query.getOneOrFail();
  }

  async createOne(data: CreateWishlistRequest): Promise<Wishlist> {
    return this.getOneByID(data.id)
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
        return this.repository.save(wl);
      });
  }

  async updateOne(id: string, data: ModifyWishlistRequest): Promise<Wishlist> {
    return this.getOneByID(id).then((wishlist: Wishlist) => {
      // a wishlist with the same ID was found --> update the name
      wishlist.name = data.name;
      return this.repository.save(wishlist);
    });
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id: id });
  }
}

export { WishlistService };
