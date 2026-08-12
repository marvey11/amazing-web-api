import { DataSource, DataSourceOptions } from "typeorm";
import fs from "fs";
import path from "path";

const ormConfigPath = path.resolve(process.cwd(), "ormconfig.json");
const raw = fs.readFileSync(ormConfigPath, "utf8");
const ormOptions = JSON.parse(raw) as DataSourceOptions;

export const AppDataSource = new DataSource({
  ...ormOptions,
  entities: ormOptions.entities ?? ["src/entities/*.entity.ts"]
} as DataSourceOptions);

export default AppDataSource;
