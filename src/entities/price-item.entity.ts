import { IsDate, IsNumber } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WishlistItem } from ".";

@Entity({ name: "prices" })
class PriceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WishlistItem, (item) => item.priceItems, { onDelete: "CASCADE" })
  item!: WishlistItem;

  @Column({ type: "datetime" })
  @IsDate()
  itemDate!: Date;

  @Column({ type: "decimal", precision: 12, scale: 4 })
  @IsNumber()
  itemPrice!: number;
}

export { PriceItem };
