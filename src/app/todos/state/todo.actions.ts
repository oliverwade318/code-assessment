import { createAction, props } from '@ngrx/store';
import { FILTER_MODE } from '../constants/filter-mode';

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<{ text: string }>(),
);

export const removeTodo = createAction(
  '[Todos] Remove Todo',
  props<{ index: number }>(),
);

export const editTodo = createAction(
  '[Todos] Edit Todo',
  props<{ index: number }>(),
);

export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ index: number, text: string }>(),
);

export const toggleCompleted = createAction(
  '[Todos] Toggle Completed',
  props<{ index: number }>(),
);

export const toggleAllCompleted = createAction(
  '[Todos] Toggle All Completed',
);

export const changeFilterMode = createAction(
  '[Todos] Change Filter Mode',
  props<{ mode: FILTER_MODE }>(),
);

export const clearCompleted = createAction(
  '[Todos] Clear Completed',
);
