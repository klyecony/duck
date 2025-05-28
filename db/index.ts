import { init } from "@instantdb/react";
import { schema } from "./schema";

const db = init({ appId: "c8cbdfa5-15fb-4057-8a26-0809298d0796", schema });

export { db };
