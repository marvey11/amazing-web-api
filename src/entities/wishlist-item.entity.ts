import { IsString } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Wishlist } from ".";
import { PriceItem } from "./price-item.entity";

@Entity({ name: "items" })
class WishlistItem {
    @PrimaryColumn()
    @IsString()
    id!: string;

    @Column()
    @IsString()
    title!: string;

    @OneToMany(() => PriceItem, (priceItem) => priceItem.item)
    priceItems!: PriceItem[];

    @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
    wishlist!: Wishlist;
}

export { WishlistItem };
