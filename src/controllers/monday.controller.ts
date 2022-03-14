import mondayService from "../services/monday.service";
import dbService from "../services/db.service";
import * as Types from "../constants/types";
import { Request, Response } from "express";

export async function executeAction(req: Request, res: Response) {
  const { shortLivedToken } = req.session;
  console.log(`executeAction -> shortLivedToken`, shortLivedToken);
  const { payload } = req.body;
  console.log(`executeAction -> payload`, payload);
  // return res.status(200).send({});
  try {
    const { inboundFieldValues } = payload;
    const { boardId, itemId, groupId, previousGroupId, userId } =
      inboundFieldValues;
    const item: Types.Item | undefined = await mondayService.getItemColumns(
      shortLivedToken!,
      itemId
    );
    if (item) {
      const dbColumns = await dbService.getBoardRestrictions(boardId);
      if (dbColumns) {
        const isValid = await mondayService.checkItemColumnValues(
          item,
          dbColumns
        );
        if (isValid) return res.status(200).send({});
        await mondayService.notify(userId, item, dbColumns);
        await mondayService.returnToPreviousGroup(itemId, previousGroupId);
        return res.status(200).send({});
      }
      return res.status(200).send({});
    }
    return res.status(500).send({ message: "internal server error" });
    // await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "internal server error" });
  }
}
