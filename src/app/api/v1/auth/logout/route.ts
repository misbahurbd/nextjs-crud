import { SendResponse } from "@/lib/send-response";
import { cookies } from "next/headers";

export const POST = async () => {
  const cookie = await cookies();
  cookie.delete("accessToken");
  return SendResponse({
    message: "Logout success!",
  });
};
