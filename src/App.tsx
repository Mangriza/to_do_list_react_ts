import React, { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  deadline: string;
  category: string;
}

const App: React.FC = () => {
  const [todoText, setTodoText] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [deadline, setDeadline] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (todoText.trim() && deadline.trim() && category.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        priority,
        deadline,
        category,
      };
      setTodos([...todos, newTodo]);
      setTodoText("");
      setPriority("medium");
      setDeadline("");
      setCategory("");
    }
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const filterTodos = (status: string) => {
    if (status === "completed") {
      return todos.filter((todo) => todo.completed);
    } else if (status === "incomplete") {
      return todos.filter((todo) => !todo.completed);
    }
    return todos;
  };

  return (
    <div className="app-container">
      <h1>Advanced To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>
      <div className="filter-container">
        <button onClick={() => setTodos(filterTodos("completed"))}>Completed</button>
        <button onClick={() => setTodos(filterTodos("incomplete"))}>Incomplete</button>
        <button onClick={() => setTodos(filterTodos("all"))}>All</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={todo.completed ? "completed" : ""}
            onClick={() => toggleTodoCompletion(todo.id)}
          >
            <span className="todo-text">{todo.text}</span>
            <span className="todo-details">
              <span>Priority: {todo.priority}</span>
              <span>Deadline: {todo.deadline}</span>
              <span>Category: {todo.category}</span>
            </span>
            <button onClick={() => editTodo(todo.id, prompt("Edit task", todo.text) || todo.text)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
