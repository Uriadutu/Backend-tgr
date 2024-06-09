import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SKPD from "./routes/SKPDRoute.js";
import SubmissionRoute from "./routes/SubmissionRoute.js";
import SlipRoute from "./routes/SlipRoute.js"
import fileupload from "express-fileupload";
import SuperAdminRoute from "./routes/SuperAdminRoute.js"

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3006",
  })
);
app.use(express.json());
app.use(fileupload());
app.use(express.static("public"));
app.use(UserRoute);
app.use(AuthRoute);
app.use(SKPD);
app.use(SubmissionRoute);
app.use(SlipRoute);
app.use(SuperAdminRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...", process.env.APP_PORT);
});
