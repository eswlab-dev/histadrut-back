import initMondayClient from "monday-sdk-js";
import * as Types from "../constants/types";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

async function getItemColumns(
  token: string,
  itemId: Types.Id,
  dbColumns: Types.DbColumns
) {
  try {
    monday.setToken(token);
    const query = `query {
        items (ids: ${itemId}) {
          id
          name
          column_values{
            id
            type
            title
            value
            additional_info

          }
        }
      }`;
    const response = await monday.api(query);
    const item: Types.Item = response.data.items[0];
    item.columnValues = response.data.items[0].column_values.filter((col) =>
      dbColumns.includes(col.id)
    );
    return item;
  } catch (err) {
    console.log(err);
  }
}
/**
 * check if all of the required columns are ok
 */
async function checkItemColumnValues(
  item: Types.Item,
  dbColumns: Types.DbColumns
): Promise<boolean> {
  const checkedColumns = item.columnValues.filter((column) =>
    dbColumns.includes(column.id)
  );
  const isValid = checkedColumns?.every(
    (col) => !!checkComplexColumns(col, dbColumns)
  );
  return isValid;
}
function checkComplexColumns(
  col: Types.ColumnValue,
  dbColumns: Types.DbColumns
) {
  const { value, id, type } = col;
  const columnsToParse: string[] = [
    "file",
    "color",
    "dropdown",
    "board-relation",
    "dependency",
    "boolean",
  ];
  if (columnsToParse.includes(type)) {
    const parsedValue = JSON.parse(value);
    const parsedInfo = JSON.parse(col.additional_info);
    console.log(`checkComplexColumns -> parsedValue`, parsedValue, col);
    console.log(`checkComplexColumns -> parsedInfo`, parsedInfo, col);
    if (type === "file")
      return dbColumns.includes(id) && parsedValue?.files?.length;
    if (type === "color") return dbColumns.includes(id) && !!parsedInfo.label;
    else if (type === "dropdown")
      return dbColumns.includes(id) && parsedValue?.ids?.length;
    else if (type === "board-relation" || type === "dependency")
      return dbColumns.includes(id) && parsedValue?.linkedPulseIds?.length;
    else if (type === "boolean")
      return dbColumns.includes(id) && parsedValue.checked;
  } else {
    return dbColumns.includes(id) && !!value;
  }
}
async function returnToPreviousGroup(
  itemId: Types.Id,
  previousGroupId: Types.Id
) {
  const mutation = `mutation{
    move_item_to_group(item_id:${itemId}, group_id:${JSON.stringify(
    previousGroupId
  )}){
      id
    }
  }`;
  const res = await monday.api(mutation);
  console.log(`returnToPreviousGroup -> res`, res);
}
async function notify(
  userId: Types.Id,
  item: Types.Item,
  dbColumns: Types.Id[]
) {
  const names = {
    missingColumns: getMissingColumnNames(dbColumns, item),
    item: item.name,
  };
  // console.log(`names`, names)
  const message = `The item <b>${
    names.item
  }</b> was returned to it's previous group because it wasn't filled correctly. Missing columns:<b> ${
    names.missingColumns!.length > 1
      ? names.missingColumns?.join(", ")
      : names.missingColumns!
  }</b>`;
  const mutation = `mutation{
    create_notification (user_id:${userId}, target_id:${
    item.id
  }, text:${JSON.stringify(message)}, target_type: Project){
    text
  }
  }`;
  const res = await monday.api(mutation);
  console.log(`notify->res`, res);
}
function getMissingColumnNames(
  dbColumns: Types.DbColumns,
  item: Types.Item
): string[] | undefined {
  if (dbColumns) {
    const filteredColumns = item.columnValues.filter(
      (column) => !checkComplexColumns(column, dbColumns)
    );
    console.log(`getMissingColumnNames -> filteredColumns`, filteredColumns);
    return filteredColumns?.map((col: any) => col?.title);
  }
}
export default {
  getItemColumns,
  getMissingColumnNames,
  checkItemColumnValues,
  notify,
  returnToPreviousGroup,
};
