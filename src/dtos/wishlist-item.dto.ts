interface GetWishlistItemOptions {
  "with-prices"?: boolean;
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

export type { CreateOrUpdateWishlistItemRequest, DeleteWishlistItemRequest, GetWishlistItemOptions };
