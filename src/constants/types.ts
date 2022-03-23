import mongoose from "mongoose";

export type Id = number | string;
export type DbColumns = Id[];
export interface ColumnValue {
  id: Id;
  type: string;
  title: string;
  value: string;
  additional_info: string;
}
export interface Item {
  id: Id;
  name: string;
  columnValues: ColumnValue[];
}
export interface BoardRestrictions {
  accountId: number;
  boardId: number;
  groupId: Id;
  columnIds: number[];
  _id?: mongoose.Types.ObjectId;
}
