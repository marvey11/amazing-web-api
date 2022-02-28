import { IsDate, IsNumber } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WishlistItem } from ".";

@Entity({ name: "prices" })
class PriceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WishlistItem, (item) => item.priceItems, { onDelete: "CASCADE" })
  item!: WishlistItem;

  @Column()
  @IsDate()
  itemDate!: Date;

  @Column()
  @IsNumber()
  itemPrice!: number;
}

export { PriceItem };
