import mondayService from "../services/monday.service";
import dbService from "../services/db.service";
import * as Types from "../constants/types";
import { Request, Response } from "express";
declare global {
  namespace Express {
    interface Request {
      session: {
        accountId: string;
        userId: string;
        backToUrl: string | undefined;
        shortLivedToken: string | undefined;
      };
    }
  }
}

export async function executeAction(req: Request, res: Response) {
  // return res.end();
  try {
    const { shortLivedToken } = req.session;
    const { payload } = req.body;
    const { inboundFieldValues } = payload;
    const { boardId, itemId, groupId, previousGroupId, userId } =
      inboundFieldValues;
    const dbColumns = await dbService.getGroupRestrictions(boardId, groupId);
    if (dbColumns) {
      const item: Types.Item | undefined = await mondayService.getItemColumns(
        shortLivedToken!,
        itemId,
        dbColumns!
      );
      console.log(`executeAction -> dbColumns`, dbColumns);
      console.log(`executeAction -> item`, item);
      if (item) {
        // console.log(`executeAction -> dbColumns`, dbColumns);
        const isValid = await mondayService.checkItemColumnValues(
          item,
          dbColumns
        );
        console.log(`executeAction -> isValid`, isValid);
        if (isValid) {
          return res.status(200).send({});
        } else {
          mondayService.notify(userId, item, dbColumns);
          mondayService.returnToPreviousGroup(itemId, previousGroupId);
          return res.status(200).send({});
        }
      }
      return res.status(200).send({});
    }
    return res.status(500).send({ message: "internal server error" });
    // await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);
  } catch (err) {
    console.error("mondayController-> executeAction", err);
    return res.status(500).send({ message: "internal server error" });
  }
}
