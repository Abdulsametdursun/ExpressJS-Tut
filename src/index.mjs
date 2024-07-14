import express from "express";
import routes from "../src/routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost:/express_tutorial")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "sam the dev",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

// Initialize must be after session middleware and before register routes
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.status(200).send(req.user);
});

app.get("/api/auth/status", (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logOut((err) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
