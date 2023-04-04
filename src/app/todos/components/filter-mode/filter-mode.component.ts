import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FILTER_MODE } from '@app/todos/constants/filter-mode';
import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-filter-mode',
  templateUrl: './filter-mode.component.html',
})
export class FilterModeComponent implements OnInit, OnDestroy {

  filterModes: FILTER_MODE[] = ['All', 'Active', 'Completed'];
  selectedFilterMode: FILTER_MODE;
  subscription: Subscription;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private todosService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todosService.filterMode$.subscribe(filterMode => {
      this.selectedFilterMode = filterMode;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeFilterMode(event: Event, mode: FILTER_MODE): void {
    event.preventDefault();
    this.todosService.changeFilterMode(mode);
  }

}
