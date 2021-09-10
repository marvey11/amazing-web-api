import { IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { WishlistItem } from ".";

@Entity({ name: "wishlists" })
class Wishlist {
    @PrimaryColumn()
    @IsString()
    id!: string;

    @Column()
    @IsString()
    name!: string;

    @OneToMany(() => WishlistItem, (item) => item.wishlist)
    items!: WishlistItem[];
}

export { Wishlist };
