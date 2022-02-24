import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, JsonController, Post, Res } from "routing-controllers";
import { Service } from "typedi";

import { CreateWishlistItemRequest } from "../dtos";
import { WishlistItemService } from "../services";

@JsonController()
@Service()
class WishlistItemController {
    constructor(private service: WishlistItemService) {}

    @Post("/wishlist-items")
    async createOrUpdateOne(
        @Body({ required: true }) data: CreateWishlistItemRequest,
        @Res() response: Response
    ): Promise<Response> {
        return this.service.createOrUpdateOne(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
    }
}

export { WishlistItemController };
