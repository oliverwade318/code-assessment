import { createSelector, createFeatureSelector } from '@ngrx/store';

import { FILTER_MODE } from '../constants/filter-mode';
import { ITodo, ITodosState } from '../interfaces';
import { TODOS_STORE_TOKEN } from '../constants/injector-tokens';

export const todosSelector = createFeatureSelector<ITodosState>(TODOS_STORE_TOKEN);

export const filterMode = createSelector(
  todosSelector,
  (state): FILTER_MODE => state.filterMode,
);

export const allTodos = createSelector(
  todosSelector,
  (state): ITodo[] => state.todos,
);

export const completedTodos = createSelector(
  allTodos,
  (todoObjects: ITodo[]): ITodo[] => {
    return todoObjects.filter(todo => todo.completed);
  }
);

export const completedTodosExist = createSelector(
  completedTodos,
  (todoObjects: ITodo[]): boolean => Boolean(todoObjects.length),
);

export const incompleteTodos = createSelector(
  allTodos,
  (todoObjects: ITodo[]): ITodo[] => {
    return todoObjects.filter(todo => !todo.completed);
  }
);

export const multipleTodosExist = createSelector(
  allTodos,
  (todoObjects): boolean => {
    return todoObjects && todoObjects.length > 1;
  }
);

export const todosExist = createSelector(
  allTodos,
  (todoObjects): boolean => {
    return todoObjects && todoObjects.length > 0;
  }
);

export const todos = createSelector(
  filterMode,
  allTodos,
  (mode, todoObjects): ITodo[] => {
    let filteredTodos;

    switch (mode) {
      case 'Active':
        filteredTodos = todoObjects.filter(todo => !todo.completed);
        break;

      case 'Completed':
        filteredTodos = todoObjects.filter(todo => todo.completed);
        break;

      default:
        filteredTodos = todoObjects;

      }

    return filteredTodos;
  }
);

export const allTodosCompleted = createSelector(
  allTodos,
  completedTodos,
  multipleTodosExist,
  (todoObjects: ITodo[], completedTodoObjects: ITodo[], multipleExist: boolean): boolean => {
    return multipleExist && todoObjects && completedTodoObjects && completedTodoObjects.length === todoObjects.length;
  }
);

export const noMatches = createSelector(
  filterMode,
  todosExist,
  todos,
  (mode: FILTER_MODE, todoObjectsExist: boolean, todoObjects: ITodo[]): boolean => {
    return mode !== 'All' && todoObjectsExist && todoObjects.length === 0;
  }
);

export const count = createSelector(
  incompleteTodos,
  (todoObjects: ITodo[]): number => {
    return todoObjects && todoObjects.length || 0;
  }
);
