import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ClearCompletedComponent } from './components/clear-completed/clear-completed.component';
import { CompleteAllComponent } from './components/complete-all/complete-all.component';
import { TodosCountComponent } from './components/todos-count/todos-count.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { FilterModeComponent } from './components/filter-mode/filter-mode.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodosFooterComponent } from './components/todos-footer/todos-footer.component';
import { TODOS_STORE_TOKEN } from './constants/injector-tokens';
import { TodosListComponent } from './components/todo-list/todo-list.component';
import { todosReducer } from './state/todos.reducer';

const DECLARATIONS = [
  ClearCompletedComponent,
  CompleteAllComponent,
  TodoFormComponent,
  FilterModeComponent,
  TodoComponent,
  TodosCountComponent,
  TodosFooterComponent,
  TodosListComponent,
];

@NgModule({
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
  ],
})
export class TodosModule {}
