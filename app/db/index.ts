import { init } from "@instantdb/react";
import schema from "@/db/instant.schema";

const APP_ID = "f17f3ebc-3f2b-41c1-aad7-4ba73b64e105";
export const db = init({ appId: APP_ID, schema, devtool: false });
