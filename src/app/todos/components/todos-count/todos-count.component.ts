import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todos-count',
  template: `
    <span class="todo-count">{{ count }} item{{ pluralize ? 's' : '' }} left</span>
  `,
})
export class TodosCountComponent implements OnInit, OnDestroy {

  count: number;
  pluralize: boolean;
  subscription: Subscription;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.count$.subscribe(count => {
      this.count = count;
      this.pluralize = this.count !== 1;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
