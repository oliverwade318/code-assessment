import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { ITodo } from '@app/todos/interfaces';
import { FILTER_MODE } from '@app/todos/constants/filter-mode';
import { TodoComponent } from '../todo/todo.component';
import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todos-list',
  styleUrls: [
    './todo-list.component.scss',
  ],
  templateUrl: './todo-list.component.html',
})
export class TodosListComponent implements OnInit, OnDestroy {

  // to facilitate testing
  @ViewChildren('todo')
  todoComponents: QueryList<TodoComponent>;

  filterMode: FILTER_MODE;
  noMatches: boolean;
  subscription: Subscription;
  todos: ITodo[];

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.todosService.filterMode$,
      this.todosService.noMatches$,
      this.todosService.todos$,
    ])
    .subscribe(([filterMode, noMatches, todos]) => {
      this.filterMode = filterMode;
      this.noMatches = noMatches;
      this.todos = todos;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTodoCompleted(index: number): void {
    this.todosService.toggleComplete(index);
  }

  onRemoveTodo(index: number): void {
    this.todosService.removeTodo(index);
  }

}
