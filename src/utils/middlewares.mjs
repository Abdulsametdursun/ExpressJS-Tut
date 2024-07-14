import { mockUsers } from "../utils/constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send({ msg: "Invalid ID" });
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1)
    return res.status(404).send({ msg: "User not found" });
  req.findUserIndex = findUserIndex;
  req.parsedId = parseId;
  next();
};
