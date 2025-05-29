"use client";

import { init } from "@instantdb/react";
import schema from "@/db/instant.schema";

const APP_ID = "c8cbdfa5-15fb-4057-8a26-0809298d0796";
export const db = init({ appId: APP_ID, schema, devtool: false });
