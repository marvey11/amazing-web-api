import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParam, Res } from "routing-controllers";
import { Service } from "typedi";
import { DeleteResult } from "typeorm";
import { CreateWishlistRequest, GetWishlistOptions, ModifyWishlistRequest } from "../dtos";
import { Wishlist } from "../entities";
import { WishlistService } from "../services";

@JsonController()
@Service()
class WishlistController {
  constructor(private service: WishlistService) {}

  @Get("/wishlists")
  async getAll(@QueryParam("options") options: GetWishlistOptions, @Res() response: Response): Promise<Response> {
    return this.service.getAll(options).then((lists: Wishlist[]) => response.status(StatusCodes.OK).send(lists));
  }

  @Get("/wishlists/:id")
  async getOneByID(
    @Param("id") wishlist_id: string,
    @QueryParam("options") options: GetWishlistOptions,
    @Res() response: Response
  ): Promise<Response> {
    return this.service
      .getOneByID(wishlist_id, options)
      .then((wishlist: Wishlist) => response.status(StatusCodes.OK).send(wishlist))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/wishlists")
  async addOne(@Body({ required: true }) data: CreateWishlistRequest, @Res() response: Response): Promise<Response> {
    return this.service
      .createOne(data)
      .then(() => response.status(StatusCodes.NO_CONTENT).send())
      .catch((error: Error) => response.status(StatusCodes.BAD_REQUEST).send(error.message));
  }

  @Put("/wishlists/:id")
  async updateOne(
    @Param("id") wishlist_id: string,
    @Body({ required: true }) data: ModifyWishlistRequest,
    @Res() response: Response
  ): Promise<Response> {
    return this.service
      .updateOne(wishlist_id, data)
      .then(() => response.status(StatusCodes.OK).send())
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Delete("/wishlists/:id")
  async deleteOne(@Param("id") wishlist_id: string, @Res() response: Response): Promise<Response> {
    return this.service.deleteOne(wishlist_id).then((data: DeleteResult) => {
      if (data && data.affected === 0) {
        return response
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: `Wishlist with ID ${wishlist_id} could not be found.` });
      }
      return response.status(StatusCodes.OK).send();
    });
  }
}

export { WishlistController };
