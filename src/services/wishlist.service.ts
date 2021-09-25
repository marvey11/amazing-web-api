import config from "config";
import { Service } from "typedi";
import { getRepository, Repository } from "typeorm";
import { CreateWishlistRequest } from "../dtos";
import { Wishlist } from "../entities";

@Service()
class WishlistService {
    private connectionName: string;
    private repository: Repository<Wishlist>;

    constructor() {
        this.connectionName = config.get("ormconfig.connection") as string;
        this.repository = getRepository<Wishlist>(Wishlist, this.connectionName);
    }

    async getAll(): Promise<Wishlist[]> {
        return this.repository.find();
    }

    async getOneByID(id: string): Promise<Wishlist> {
        return this.repository.findOneOrFail({ id: id });
    }

    async createOrUpdateOne(data: CreateWishlistRequest): Promise<Wishlist> {
        return this.getOneByID(data.id)
            .then((wishlist: Wishlist) => {
                // a wishlist with the same ID already exists --> update the name only
                wishlist.name = data.name;
                return this.repository.save(wishlist);
            })
            .catch(() => {
                // a matching wishlist could not be found --> create a new one
                const wl: Wishlist = new Wishlist();
                wl.id = data.id;
                wl.name = data.name;
                wl.items = [];
                return this.repository.save(wl);
            });
    }
}

export { WishlistService };
