import config from "config";

import { Service } from "typedi";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { CreateWishlistItemRequest } from "../dtos";
import { Wishlist, WishlistItem } from "../entities";
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

    async getOneByID(id: string): Promise<WishlistItem> {
        const query = this.connection
            .createQueryBuilder()
            .select("[item.id, item.name]")
            .from(WishlistItem, "item")
            .where("item.id = :itid", { itid: id });

        return query.getOneOrFail();
    }

    async createOrUpdateOne(data: CreateWishlistItemRequest): Promise<WishlistItem> {
        return this.wishlistService.getOneByID(data.wishlist).then(async (wl: Wishlist) => {
            let wli: WishlistItem;
            try {
                wli = await this.getOneByID(data.id);
                // a wishlist item with the same ID already exists --> update only
                wli.title = data.name;
                wli.wishlist = wl;
            } catch (e) {
                // a matching wishlist could not be found --> create a new one
                wli = new WishlistItem();
                wli.id = data.id;
                wli.title = data.name;
                wli.wishlist = wl;
                wli.priceItems = [];
            }
            return await this.repository.save(wli);
        });
    }
}

export { WishlistItemService };
