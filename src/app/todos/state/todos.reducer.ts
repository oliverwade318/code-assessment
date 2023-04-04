import { Action, createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';

import { ITodo, ITodosState } from '../interfaces';

export const initialState: ITodosState = {
  filterMode: 'All',
  todos: [],
};

function updateTodos(existingTodos: ITodo[], todo: ITodo, index: number): ITodo[] {
  return [...existingTodos.slice(0, index), todo, ...existingTodos.slice(index + 1)];
}

export function todosReducer(state: ITodosState, action: Action) {
  return createReducer(
    initialState,
    on(TodoActions.addTodo, (existingState, { text }): ITodosState => ({
      ...existingState,
      todos: [{ text, completed: false }, ...existingState.todos],
    })),
    on(TodoActions.removeTodo, (existingState, { index }) => {
      const updatedTodos = [...existingState.todos];
      updatedTodos.splice(index, 1);

      return {
        ...existingState,
        todos: updatedTodos
      };
    }),
    on(TodoActions.toggleCompleted, (existingState, { index }): ITodosState => {
      const todo = {...existingState.todos[index]};
      todo.completed = !todo.completed;

      return {
        ...existingState,
        todos: updateTodos(existingState.todos, todo, index),
      };
    }),
    on(TodoActions.updateTodo, (existingState, { index, text }): ITodosState => {
      const todo = {...existingState.todos[index]};
      todo.text = text;

      return {
        ...existingState,
        todos: updateTodos(existingState.todos, todo, index),
      };
    }),
    on(TodoActions.changeFilterMode, (existingState, { mode }): ITodosState => ({
      ...existingState,
      filterMode: mode,
    })),
    on(TodoActions.toggleAllCompleted, (existingState): ITodosState => {
      const allExistingTodosComplete = existingState.todos.every(todo => todo.completed);
      let toggleAllComplete = false;

      if (!allExistingTodosComplete) {
        // if not all todos are complete, check if some are complete
        // if some are complete, mark all as complete
        if (existingState.todos.some(todo => todo.completed) || !allExistingTodosComplete) {
          toggleAllComplete = true;
        }
      }

      return {
        ...existingState,
        todos: [...existingState.todos.map(todo => {
          const updatedTodo = {...todo};
          updatedTodo.completed = toggleAllComplete;

          return updatedTodo;
        })],
      }
    }),
    on(TodoActions.clearCompleted, (existingState): ITodosState => ({
      ...existingState,
      todos: [...existingState.todos.filter(todo => !todo.completed)],
    })),
  )(state, action);
}

export const filterMode = (state: ITodosState) => state.filterMode;
export const todos = (state: ITodosState) => state.todos;
