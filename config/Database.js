import { Sequelize } from "sequelize";

const db = new Sequelize("db_tgr", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
