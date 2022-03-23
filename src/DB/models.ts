import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = mongoose.createConnection(process.env.MONGODB_URI!);

const BoardRestrictionSchema = new mongoose.Schema({
  accountId: { type: Number, required: true },
  boardId: { type: Number, required: true },
  groupId: { type: String, required: true },
  columnIds: { type: [String], required: true },
});
export const BoardRestriction = connection.model(
  "group-restrict",
  BoardRestrictionSchema
);
