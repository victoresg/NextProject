/* eslint-disable no-console */
import { readFileSync, writeFileSync } from "fs"; // ES6
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

export function createTodo(content: string): Todo {
  // salvar  o content doo sistema
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };
  const todos: Array<Todo> = [...readTodos(), todo];
  writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );
  return todo;
}

export function readTodos(): Array<Todo> {
  const dbString = readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) return []; // fail fast validation
  return db.todos || [];
}

function update(id: UUID, partialTodo: Partial<Todo>) {
  const todos = readTodos();
  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, ...partialTodo };
    }
    return todo;
  });
  writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: updatedTodos,
      },
      null,
      2
    )
  );

  if (!updatedTodos.some((todo) => todo.id === id)) {
    throw new Error("please, provide another ID!");
  }
  return updatedTodos.filter((todo) => todo.id === id)[0];
}

function updateContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  });
}

function deleteTodoById(id: UUID) {
  const todoList = readTodos();
  const newTodoList = todoList.filter((todo) => todo.id !== id);
  writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: newTodoList,
      },
      null,
      2
    )
  );
}

function clearDB() {
  writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
clearDB();
createTodo("primeira todo");
const secondTodo = createTodo("segunda todo");
deleteTodoById(secondTodo.id);
const thirdTodo = createTodo("terceira todo");
// update(terceiraTodo.id, {
// 	content: 'Segunda TODO com novo content',
// 	done: true
// })
updateContentById(thirdTodo.id, "atualizada");
createTodo("segunda todo");
createTodo("terceira todo");
// const todos = readTodos();
// console.log(todos);
// console.log(todos.length);
