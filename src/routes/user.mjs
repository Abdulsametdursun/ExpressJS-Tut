import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

// Get all users
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Filter must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3 and 10 characters"),
  (req, res) => {
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { filter, value } = req.query;
    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    }
    return res.send(mockUsers);
  }
);

// Get user by id
router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

// Create new user
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);

    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: "Failed to create user" });
    }
  }
);

// Update entire user
router.put(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const { findUserIndex, parsedId } = req;
    mockUsers[findUserIndex] = { id: parsedId, ...data };
    return res.sendStatus(200);
  }
);

// Update one value of the user
router.patch(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const { findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...data };
    return res.sendStatus(200);
  }
);

// Delete user by id
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

export default router;
