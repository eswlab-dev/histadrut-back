import { BoardRestriction } from "../DB/models";
import * as Types from "../constants/types";
import { Request, Response } from "express";
/**
 * gets all Restrictions by account
 */
export async function getBoardsRestrictionsByAccount(
  req: Request,
  res: Response
) {
  try {
    const restrictions = await BoardRestriction.find({
      accountId: Number(req.params.accountId),
    });
    res.send(restrictions);
  } catch (err) {
    console.log(`getBoardsRestrictionsByAccount->err`, err);
  }
}
/**
 * gets all Restrictions by account
 */
export async function getBoardRestrictions(req: Request, res: Response) {
  try {
    const restrictions = await BoardRestriction.find({
      boardId: req.params.boardId,
    });
    res.send(restrictions);
  } catch (error) {
    console.log(`getBoardRestrictions -> error`, error);
  }
}
export async function AddBoardRestriction(req: Request, res: Response) {
  try {
    const restriction: Types.BoardRestrictions = req.body;
    const newRestriction = new BoardRestriction(restriction);
    await newRestriction.save();
    console.log(`AddBoardRestriction -> newRestriction`, newRestriction);
    res.send(newRestriction);
  } catch (error) {
    console.log(`AddBoardRestriction -> error`, error);
  }
}
export async function updateBoardRestriction(req: Request, res: Response) {
  try {
    const restriction: Types.BoardRestrictions = req.body;
    const newRestriction = await BoardRestriction.findByIdAndUpdate(
      restriction._id,
      restriction,
      { new: true }
    );
    console.log(`updateBoardRestriction -> newRestriction`, newRestriction);
    res.send(newRestriction);
  } catch (error) {
    console.log(`updateBoardRestriction -> error`, error);
  }
}
export async function deleteBoardRestriction(req: Request, res: Response) {
  try {
    const { _id } = req.params;
    const deletedRestriction = await BoardRestriction.findByIdAndDelete(_id);
    console.log(
      `deleteBoardRestriction -> deletedRestriction`,
      deletedRestriction
    );
    res.send(deletedRestriction);
  } catch (error) {
    console.log(`deleteBoardRestriction -> error`, error);
  }
}
