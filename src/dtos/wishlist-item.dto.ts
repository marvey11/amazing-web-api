import { Transform } from "class-transformer";

class GetWishlistItemOptions {
  // transformations ensure that boolean strings are converted to actual booleans

  @Transform((value) => [true, "true"].indexOf(value) > -1)
  "with-prices"?: boolean;

  @Transform((value) => [true, "true"].indexOf(value) > -1)
  "latest-only"?: boolean;
}

type CreateOrUpdateWishlistItemRequest = {
  id: string;
  name: string;
  date: string;
  price: number;
  wishlist_id: string;
};

type DeleteWishlistItemRequest = {
  id: string;
};

export { GetWishlistItemOptions };
export type { CreateOrUpdateWishlistItemRequest, DeleteWishlistItemRequest };
