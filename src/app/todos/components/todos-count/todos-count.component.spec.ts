import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { TodosCountComponent } from './todos-count.component';
import { ITodo } from '../../interfaces';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';

describe('TodosCountComponent Test', () => {

  let component: TodosCountComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TodosCountComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        TodosCountComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosCountComponent);
    debugElement = fixture.debugElement;
    todosService = fixture.debugElement.injector.get(TodosService);

  });

  beforeEach(() => {
    component = fixture.componentInstance;

    let todos: ITodo[];
    todosService.todos$.pipe(take(1)).subscribe(state => todos = state);

    todos.forEach((_, index) => {
      todosService.removeTodo(index);
    });
  });

  it('Component should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('Should display "[count] items left" when the count does not equal 1', () => {
    component.ngOnInit();
    fixture.detectChanges();

    ['Todo 1', 'Todo 2', 'Todo 3'].map(text => {
      todosService.addTodo(text);
    });

    fixture.detectChanges();

    const spanElement: HTMLSpanElement = debugElement.query(By.css('.todo-count')).nativeElement;

    expect(spanElement.innerText).toBe('3 items left');
  });

  it('Should display "1 item left" when the count equals 1', () => {
    component.ngOnInit();
    fixture.detectChanges();

    todosService.addTodo('Todo 1');

    fixture.detectChanges();

    const spanElement: HTMLSpanElement = debugElement.query(By.css('.todo-count')).nativeElement;

    expect(spanElement.innerText).toBe('1 item left');
  });

});
