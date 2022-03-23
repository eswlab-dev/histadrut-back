import * as Types from "../constants/types";
import { BoardRestriction } from "../DB/models";
async function getBoardRestrictions(
  boardId: Types.Id
): Promise<Types.Id[] | null> {
  const BoardRestrictions = await BoardRestriction.findOne({ boardId });
  return BoardRestrictions.columnIds;
}
async function getGroupRestrictions(
  boardId: Types.Id,
  groupId: Types.Id
): Promise<Types.Id[] | null> {
  const restrictionsByGroup = await BoardRestriction.findOne({
    boardId,
    groupId,
  });
  return restrictionsByGroup.columnIds;
}
export default { getBoardRestrictions, getGroupRestrictions };
