import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Delete, JsonController, Post, Put, Res } from "routing-controllers";
import { Service } from "typedi";
import { CreateOrUpdateWishlistItemRequest, DeleteWishlistItemRequest } from "../dtos";
import { RepositoryService } from "../services";

@JsonController()
@Service()
export class WishlistItemController {
  constructor(private service: RepositoryService) {}

  @Post("/wishlist-items")
  async createMany(
    @Body({ required: true }) data: CreateOrUpdateWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.createManyWishlistItems(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
  }

  @Put("/wishlist-items")
  async updateMany(
    @Body({ required: true }) data: CreateOrUpdateWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.updateManyWishlistItems(data).then(() => response.status(StatusCodes.NO_CONTENT).send());
  }

  @Delete("/wishlist-items")
  async deleteMany(
    @Body({ required: true }) data: DeleteWishlistItemRequest[],
    @Res() response: Response
  ): Promise<Response> {
    return this.service.deleteManyWishlistItems(data).then(() => response.send());
  }
}
