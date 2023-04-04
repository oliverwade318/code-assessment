import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { FilterModeComponent } from './filter-mode.component';
import { FILTER_MODE } from '../../constants/filter-mode';
import { ITodo } from '../../interfaces';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';

describe('FilterModeComponent Test', () => {

  let component: FilterModeComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<FilterModeComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        FilterModeComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModeComponent);
    todosService = fixture.debugElement.injector.get(TodosService);
    debugElement = fixture.debugElement;

  });

  beforeEach(() => {
    component = fixture.componentInstance;
    let todos: ITodo[];
    todosService.todos$.pipe(take(1)).subscribe(state => todos = state);

    todos.forEach((_, index) => {
      todosService.removeTodo(index);
    });

    fixture.detectChanges();
  });

  it('Component should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('Changing the filter mode should set the corresponding anchor tag as `selected`', () => {
    const event = new Event('click');

    // click anchor tag
    const element = debugElement.query(By.css('li:nth-child(2) > a'));
    element.triggerEventHandler('click', event);

    fixture.detectChanges();

    // service call invoked from click should change state to match element clicked
    let filterMode: string;
    todosService.filterMode$.pipe(take(1)).subscribe(state => filterMode = state);

    const activeFilterMode: FILTER_MODE = 'Active';

    expect(filterMode).toEqual(activeFilterMode);

    // anchor tag should have the "selected" css class
    expect((element.nativeElement as HTMLAnchorElement).classList.contains('selected'));

    // other anchor tags should *not* have the "selected" css class
    const otherElement = debugElement.query(By.css('li:nth-child(1) > a'));
    expect(!(otherElement.nativeElement as HTMLAnchorElement).classList.contains('selected'));
  });

});
