import { Router } from "express";
import productsRouter from "../routes/products.mjs";
import userRouter from "../routes/user.mjs";
// import { mockUsers } from "../data/users.mjs";

const router = Router();

router.use(userRouter);
router.use(productsRouter);

// app.get("/", (req, res) => {
//     req.session.visited = true;
//     res.cookie("hello", "world", { maxAge: 10000, signed: true });
//     res.status(201).send({ msg: "Hello World!" });
//   });

//   app.post("/api/auth", (req, res) => {
//     const {
//       body: { username, password },
//     } = req;
//     const findUser = mockUsers.find((user) => user.username === username);
//     if (!findUser || findUser.password !== password)
//       return res.status(401).send({ msg: "Invalid credentials" });

//     req.session.user = findUser;
//     return res.status(200).send({ msg: "Login successful" });
//   });

//   app.get("/api/auth/status", (req, res) => {
//     req.sessionStore.get(req.sessionID, (err, session) => {
//       console.log(session);
//     });
//     return req.session.user
//       ? res.status(200).send(req.session.user)
//       : res.status(401).send({ msg: "Login successful" });
//   });

//   app.post("/api/cart", (req, res) => {
//     if (!req.session.user) return res.sendStatus(401);
//     const { body: item } = req;
//     const { cart } = req.session;
//     if (cart) {
//       cart.push(item);
//     } else {
//       req.session.cart = [item];
//     }
//     return res.status(201).send(item);
//   });

//   app.get("/api/cart", (req, res) => {
//     if (!req.session.user) return res.sendStatus(401);
//     return res.send(req.session.cart ?? []);
//   });

export default router;
