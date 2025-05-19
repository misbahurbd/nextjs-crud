import status from "http-status";
import { NextResponse } from "next/server";

export const SendResponse = (payload: {
  message: string;
  statusCode?: number;
  data?: unknown;
  limit?: number;
  total?: number;
  page?: number;
}) => {
  const { statusCode, ...resObj } = payload;

  return NextResponse.json(resObj, {
    status: statusCode || status.OK,
  });
};
