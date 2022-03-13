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
  return false;
}
async function returnToPreviousGroup(
  itemId: Types.Id,
  previousGroupId: Types.Id
) {
  const mutation = `mutation{
    move_item_to_group(itemId:${itemId}, groupId:${previousGroupId}){
      id
    }
  }`;
  await monday.api(mutation);
}
async function notify(
  userId: Types.Id,
  item: Types.Item,
  dbColumns: Types.Id[]
) {
  const names = {
    missingColumns: getColumnNames(dbColumns, item),
    item: item.name,
  };
  const message = `The item ${
    names.item
  } was returned to the group its previous group because it wasn't filled correctly. missing columns: ${names.missingColumns!.join(
    ", "
  )} `;
  const mutation = `mutation{
    create_notification (user_id:${userId}, target_id:${item.id}, text:${message})
  }`;
  await monday.api(mutation);
}
function getColumnNames(
  dbColumns: Types.DbColumns,
  item: Types.Item
): string[] | undefined {
  if (dbColumns) {
    const columns = dbColumns?.map((column) => {
      item.columnValues.find((value) => value.id === column);
    });
    return columns?.map((col: any) => col.title);
  }
}
export default {
  getItemColumns,
  getColumnNames,
  checkItemColumnValues,
  notify,
  returnToPreviousGroup,
};
