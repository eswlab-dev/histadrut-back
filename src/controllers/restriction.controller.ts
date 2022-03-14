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
  const restrictions = await BoardRestriction.find({
    accountId: req.params.accountId,
  });
  res.send(restrictions);
}
/**
 * gets all Restrictions by account
 */
export async function getBoardRestrictions(req: Request, res: Response) {
  const restrictions = await BoardRestriction.find({
    boardId: req.params.boardId,
  });
  res.send(restrictions);
}
export async function AddBoardRestriction(req: Request, res: Response) {
  const { restriction }: { restriction: Types.BoardRestrictions } = req.body;
  const newRestriction = new BoardRestriction(restriction);
  await newRestriction.save();
  res.send(newRestriction);
}
export async function updateBoardRestriction(req: Request, res: Response) {
  const { restriction }: { restriction: Types.BoardRestrictions } = req.body;
  const newRestriction = await BoardRestriction.findByIdAndUpdate(
    restriction._id,
    restriction,
    { new: true }
  );
  res.send(newRestriction);
}
export async function deleteBoardRestriction(req: Request, res: Response) {
  const { _id } = req.params;
  const deletedRestriction = await BoardRestriction.findByIdAndDelete(_id);
  res.send(deletedRestriction);
}
