import { GetWishlistItemOptions } from "./wishlist-item.dto";

/**
 * Options used in conjunction with wishlist GET calls that can modify what data to return when retrieving wish lists
 * from the database.
 */
type GetWishlistOptions = {
  "with-items": boolean;
} & GetWishlistItemOptions;

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

export type { CreateWishlistRequest, GetWishlistOptions, ModifyWishlistRequest };
