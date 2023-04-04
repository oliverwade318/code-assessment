import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-complete-all',
  styleUrls: [
    './complete-all.component.scss',
  ],
  templateUrl: './complete-all.component.html',
})
export class CompleteAllComponent implements OnInit, OnDestroy {

  allTodosCompleted = false;
  multipleTodosExist = false;
  subscription: Subscription;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.todosService.allTodosCompleted$,
      this.todosService.multipleTodosExist$,
    ])
    .subscribe(([allTodosCompleted, multipleTodosExist]) => {
      this.allTodosCompleted = allTodosCompleted;
      this.multipleTodosExist = multipleTodosExist;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleCompleteAll(): void {
    this.todosService.toggleAllCompleted();
  }

}
