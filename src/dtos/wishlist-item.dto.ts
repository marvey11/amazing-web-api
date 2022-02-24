import { IsString } from "class-validator";

class CreateWishlistItemRequest {
    @IsString()
    id: string;

    @IsString()
    wishlist: string;

    @IsString()
    name: string;

    constructor(id: string, wishlist: string, name: string) {
        this.id = id;
        this.wishlist = wishlist;
        this.name = name;
    }
}

export { CreateWishlistItemRequest };
