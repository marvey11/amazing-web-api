import { Transform } from "class-transformer";
import { GetWishlistItemOptions } from "./wishlist-item.dto";

/**
 * Options used in conjunction with wishlist GET calls that can modify what data to return when retrieving wish lists
 * from the database.
 */
class GetWishlistOptions extends GetWishlistItemOptions {
  // transformation ensures that boolean strings are converted to actual booleans
  @Transform((value) => [true, "true"].indexOf(value) > -1)
  "with-items": boolean;
}

/**
 * Request data type used for transmitting body data in POST calls when creating new wishlists.
 */
type CreateWishlistRequest = {
  id: string;
  name: string;
};

/**
 * Request data type used for transmitting body data in POST calls when modifying an existing wishlist.
 */
type ModifyWishlistRequest = {
  name: string;
};

export { GetWishlistOptions };
export type { CreateWishlistRequest, ModifyWishlistRequest };
