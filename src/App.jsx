import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ALL_TASKS } from "./graphql/queries";
import { COMPLETE_TASK, CREATE_TASK } from "./graphql/mutations";

function TaskItem({ task }) {
  const [completeTask, { loading, error }] = useMutation(COMPLETE_TASK, {
    refetchQueries: [{ query: ALL_TASKS }],
  });

  return (
    <li>
      {task.title} — {task.description} — {task.category.name} ({task.category.color})
      <button
        type="button"
        disabled={loading}
        onClick={() => completeTask({ variables: { taskId: task.id } })}
      >
        Завершить
      </button>
      {error && <p>Ошибка: {error.message}</p>}
    </li>
  );
}

function TaskList() {
  const { loading, error, data } = useQuery(ALL_TASKS);

  if (loading) return <p>Загрузка задач...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <ul>
      {data.allTasks.map((task) => <TaskItem key={task.id} task={task} />)}
    </ul>
  );
}

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: ALL_TASKS }],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await createTask({ variables: { title, description } });
      setTitle("");
      setDescription("");
    } catch {
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Название"
        required
      />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Описание"
        required
      />
      <button type="submit" disabled={loading}>Добавить задачу</button>
      {error && <p>Ошибка: {error.message}</p>}
    </form>
  );
}

export default function App() {
  return (
    <main>
      <TaskForm />
      <TaskList />
    </main>
  );
}
