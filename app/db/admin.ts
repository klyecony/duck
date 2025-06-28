import { init } from "@instantdb/admin";

const APP_ID = "f17f3ebc-3f2b-41c1-aad7-4ba73b64e105";
export const dba = init({ appId: APP_ID, adminToken: process.env.INSTANT_APP_ADMIN_TOKEN || "" });
