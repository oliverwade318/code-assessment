import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { FILTER_MODE } from '../constants/filter-mode';
import { ITodo, ITodosState } from '../interfaces';
import * as TodoActions from '../state/todo.actions';
import * as todoSelectors from '../state/todo.selectors';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  allTodos$: Observable<ITodo[]>;
  allTodosCompleted$: Observable<boolean>;
  completedTodosExist$: Observable<boolean>;
  count$: Observable<number>;
  filterMode$: Observable<FILTER_MODE>;
  multipleTodosExist$: Observable<boolean>;
  noMatches$: Observable<boolean>;
  todos$: Observable<ITodo[]>;
  todosExist$: Observable<boolean>;

  constructor(
    private store: Store<ITodosState>,
  ) {
    this.allTodos$ = this.store.select(todoSelectors.allTodos);
    this.allTodosCompleted$ = this.store.select(todoSelectors.allTodosCompleted);
    this.completedTodosExist$ = this.store.select(todoSelectors.completedTodosExist);
    this.count$ = this.store.select(todoSelectors.count);
    this.filterMode$ = this.store.select(todoSelectors.filterMode);
    this.multipleTodosExist$ = this.store.select(todoSelectors.multipleTodosExist);
    this.noMatches$ = this.store.select(todoSelectors.noMatches);
    this.todos$ = this.store.select(todoSelectors.todos);
    this.todosExist$ = this.store.select(todoSelectors.todosExist);
  }

  addTodo(text: string): void {
    this.store.dispatch(TodoActions.addTodo({ text }));
  }

  removeTodo(index: number): void {
    this.store.dispatch(TodoActions.removeTodo({ index }));
  }

  toggleComplete(index: number): void {
    this.store.dispatch(TodoActions.toggleCompleted({ index }));
  }

  toggleAllCompleted(): void {
    this.store.dispatch(TodoActions.toggleAllCompleted());
  }

  updateTodo(index: number, text: string): void {
    this.store.dispatch(TodoActions.updateTodo({ index, text }));
  }

  changeFilterMode(mode: FILTER_MODE): void {
    this.store.dispatch(TodoActions.changeFilterMode({ mode }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
