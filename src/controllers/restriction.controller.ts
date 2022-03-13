import { BoardRestriction } from "../DB/models";
import * as Types from "../constants/types";
import mongoose from "mongoose";
/**
 * gets all Restrictions by account
 */
export async function getBoardsRestrictionsByAccount(
  accountId: Types.Id
): Promise<Types.BoardRestrictions> {
  return await BoardRestriction.find({ accountId });
}
/**
 * gets all Restrictions by account
 */
export async function getBoardRestrictions(
  boardId: Types.Id
): Promise<Types.BoardRestrictions> {
  return await BoardRestriction.find({ boardId });
}
export async function AddBoardRestriction(
  restriction: Types.BoardRestrictions
): Promise<Types.BoardRestrictions> {
  const newRestriction = new BoardRestriction(restriction);
  await newRestriction.save();
  return newRestriction;
}
export async function updateBoardRestriction(
  restriction: Types.BoardRestrictions
): Promise<Types.BoardRestrictions> {
  const newRestriction = await BoardRestriction.findByIdAndUpdate(
    restriction.id,
    restriction,
    { new: true }
  );
  return newRestriction;
}
