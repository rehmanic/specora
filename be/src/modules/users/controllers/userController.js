import asyncHandler from "../../../utils/asyncHandler.js";
import * as userService from "../services/userService.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ message: "User created successfully", user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ message: "Users retrieved successfully", count: users.length, users });
});

export const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await userService.getUserByUsername(req.params.username);
  res.status(200).json({ message: "User retrieved successfully", user });
});

export const getUsersByIds = asyncHandler(async (req, res) => {
  const users = await userService.getUsersByIds(req.body.userIds);
  res.status(200).json({ message: "Users retrieved successfully", count: users.length, data: users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.body);
  res.status(200).json({ message: "User updated successfully", user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.username);
  res.status(200).json({ message: "User deleted successfully" });
});
