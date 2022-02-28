import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Delete, JsonController, Post, Put, Res } from "routing-controllers";
import { Service } from "typedi";
import { CreateOrUpdateWishlistItemRequest, DeleteWishlistItemRequest } from "../dtos";
import { WishlistItemService } from "../services";

@JsonController()
@Service()
class WishlistItemController {
  constructor(private service: WishlistItemService) {}

  @Post("/wishlist-items")
  async createMany(
    @Body({ required: true }) data: CreateOrUpdateWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.createMany(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
  }

  @Put("/wishlist-items")
  async updateMany(
    @Body({ required: true }) data: CreateOrUpdateWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.updateMany(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
  }

  @Delete("/wishlist-items")
  async deleteMany(
    @Body({ required: true }) data: DeleteWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.deleteMany(data).then(() => response.send());
  }
}

export { WishlistItemController };
