const Item = require("../models/Item");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItems = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const items = await Item.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ items, count: items.length });
};
const getItem = async (req, res) => {
  const {
    user: { userId },
    params: { id: itemId },
  } = req;
  const item = await Item.findOne({ createdBy: userId, _id: itemId });
  if (!item) {
    throw new NotFoundError(`There was no item with id ${itemId}.`);
  }
  res.status(StatusCodes.OK).json({ item });
};
const createItem = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const item = await Item.create(req.body);
  res.status(StatusCodes.CREATED).json({ item });
};
const updateItem = async (req, res) => {
  const {
    params: { id: itemId },
    user: { userId },
    body: { name, description, quantity, category },
  } = req;

  if (!name && !description && !quantity && !category) {
    throw new BadRequestError(
      "At least one of the following must be present: name, description, quantity and category.",
    );
  }
  const itemUpdateData = {};
  if (name) {
    itemUpdateData.name = name;
  }
  if (description) {
    itemUpdateData.description = description;
  }
  if (quantity) {
    itemUpdateData.quantity = quantity;
  }
  if (category) {
    itemUpdateData.category = category;
  }
  const item = await Item.findByIdAndUpdate(
    { _id: itemId, createdBy: userId },
    itemUpdateData,
    { new: true, runValidators: true },
  );
  if (!item) {
    throw new NotFoundError(`There's no item with id ${itemId}.`);
  }
  res.status(StatusCodes.OK).json({ item });
};
const deleteItem = async (req, res) => {
  const {
    user: { userId },
    params: { id: itemId },
  } = req;

  const item = await Item.findByIdAndDelete({ createdBy: userId, _id: itemId });
  if (!item) {
    throw new NotFoundError(`There was no item with id ${itemId}.`);
  }
  res.status(StatusCodes.OK).json({
    msg: `Item was removed successfully from the database.`,
  });
};
module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
