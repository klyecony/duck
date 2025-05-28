"use client";
import { db } from "@/db";
import type { Todo } from "@/db/schema";
import { Form, Input } from "@heroui/react";
import { id } from "@instantdb/react";
import { useForm } from "react-hook-form";

type Entry = {
  text: string;
};

// Write Data
// ---------
function addTodo({ text }: Entry) {
  db.transact(
    db.tx.todos[id()].update({
      text,
      done: false,
      createdAt: Date.now(),
    }),
  );
}

function deleteTodo(todo: Todo) {
  db.transact(db.tx.todos[todo.id].delete());
}

function toggleDone(todo: Todo) {
  db.transact(db.tx.todos[todo.id].update({ done: !todo.done }));
}

const Add = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      text: "",
    },
  });
  

  return (
    <Form onSubmit={handleSubmit(addTodo)}>
      <Input
        label="Hinzufügen"
        placeholder="Type here..."
        autoFocus
        {...register("text", { required: true })}
      />
    </Form>
  );
};

export default Add;
