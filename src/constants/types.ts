import mongoose from "mongoose";

export type Id = number | string;
export type DbColumns = Id[];
export interface ColumnValue {
  id: Id;
  type: string;
  title: string;
  value: JSON;
}
export interface Item {
  id: Id;
  name: string;
  columnValues: ColumnValue[];
}
export interface BoardRestrictions {
  accountId: number;
  boardId: number;
  columnIds: number[];
  _id?: mongoose.Types.ObjectId;
}
