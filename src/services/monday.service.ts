import initMondayClient from "monday-sdk-js";
import * as Types from "../constants/types";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
const domain =
  process.env.NODE_ENV === "development"
    ? "https://3352-2a0e-9cc0-23f4-d00-d824-6183-c845-2759.eu.ngrok.io"
    : "https://3352-2a0e-9cc0-23f4-d00-d824-6183-c845-2759.eu.ngrok.io";
async function getItemColumns(token: string, itemId: Types.Id) {
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
          }
        }
      }`;
    const response = await monday.api(query);
    const item: Types.Item = response.data.items[0];
    item.columnValues = response.data.items[0].column_values;
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
  const isValid = checkedColumns?.every((col) => {
    const { value, id } = col;
    return dbColumns.includes(id) && !!value;
  });
  console.log(`isValid`, isValid);
  return isValid;
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
  console.log(`names`, names);

  const message = `The item <b>${
    names.item
  }</b> was returned to it's previous group because it wasn't filled correctly. Missing columns:<b> ${names.missingColumns?.join(
    ", "
  )}</b>`;
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
    console.log(`dbColumns`, dbColumns);
    const filteredColumns = item.columnValues.filter((column) =>
      dbColumns.includes(column.id)
    );
    const columns = dbColumns?.map((column) => {
      const col = filteredColumns?.find((value) => column === value.id);
      return col;
    });
    return columns?.map((col: any) => col?.title);
  }
}
export default {
  getItemColumns,
  getMissingColumnNames,
  checkItemColumnValues,
  notify,
  returnToPreviousGroup,
};
