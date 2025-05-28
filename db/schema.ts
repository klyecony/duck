import { i, type InstaQLEntity } from "@instantdb/react";

const schema = i.schema({
  entities: {
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number(),
    }),
  },
});

type Todo = InstaQLEntity<typeof schema, "todos">;
export { type Todo, schema };
