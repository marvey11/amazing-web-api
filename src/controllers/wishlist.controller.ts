import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { CreateWishlistRequest } from "../dtos";
import { Wishlist } from "../entities";
import { WishlistService } from "../services";

@Service()
@JsonController()
class WishlistController {
    constructor(private service: WishlistService) {}

    @Get("/wishlists")
    async getAll(@Res() response: Response): Promise<Response> {
        return this.service.getAll().then((lists: Wishlist[]) => response.status(StatusCodes.OK).send(lists));
    }

    @Get("/wishlist/:id")
    async getOneByID(@Param("id") wishlist_id: string, @Res() response: Response): Promise<Response> {
        return this.service
            .getOneByID(wishlist_id)
            .then((wishlist: Wishlist) => response.status(StatusCodes.OK).send(wishlist))
            .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
    }

    @Post("/wishlist")
    async createOrUpdateOne(
        @Body({ required: true }) data: CreateWishlistRequest,
        @Res() response: Response
    ): Promise<Response> {
        return this.service.createOrUpdateOne(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
    }
}

export { WishlistController };
