import * as Types from "../constants/types";
import { BoardRestriction } from "../DB/models";
async function getBoardRestrictions(
  boardId: Types.Id
): Promise<Types.Id[] | null> {
  const BoardRestrictions = await BoardRestriction.findOne({ boardId });
  return BoardRestrictions.columnIds;
}
export default { getBoardRestrictions };
