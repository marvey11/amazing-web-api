import { IsString } from "class-validator";

class CreateWishlistRequest {
    @IsString()
    id: string;

    @IsString()
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export { CreateWishlistRequest };
