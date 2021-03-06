import "reflect-metadata";
import config from "config";
import cors from "cors";
import express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import { WishlistController } from "./controllers";
import { WishlistItemController } from "./controllers/wishlist-item.controller";

useContainer(Container);

const connectionName = config.get("ormconfig.connection") as string;
createConnection(connectionName)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    useExpressServer(app, {
      routePrefix: "/api",
      classTransformer: true,
      validation: true,
      controllers: [WishlistController, WishlistItemController]
    });

    const port = config.get("express.port") as number;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
