import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todos-footer',
  templateUrl: './todos-footer.component.html',
})
export class TodosFooterComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  visible = false;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.todosExist$.subscribe(todosExist => {
      this.visible = todosExist;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
