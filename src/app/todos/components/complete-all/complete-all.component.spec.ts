import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { CompleteAllComponent } from './complete-all.component';
import { ITodo } from '../../interfaces';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';

describe('CompleteAllComponent Test', () => {

  let component: CompleteAllComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<CompleteAllComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        CompleteAllComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteAllComponent);
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

    fixture.detectChanges();
  });

  it('Component should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('should only display the container if multiple todos exist', () => {
    todosService.addTodo('Todo 1');
    todosService.addTodo('Todo 2');

    fixture.detectChanges();

    expect((debugElement.nativeElement as HTMLElement).querySelector('#toggle-all')).toBeTruthy();
  });

  it('should mark all todos as complete when clicked', () => {
    // set up data
    todosService.addTodo('Todo 1');
    todosService.addTodo('Todo 2');
    todosService.addTodo('Todo 3');

    fixture.detectChanges();

    // trigger click of checkbox
    debugElement.query(By.css('#toggle-all')).triggerEventHandler('click', null);

    fixture.detectChanges();

    expect((debugElement.nativeElement as HTMLInputElement).querySelector('#toggle-all').hasAttribute('checked')).toBeTrue();

    // service call invoked from click should have set all todos as complete
    let todos: ITodo[];
    todosService.allTodos$.pipe(take(1)).subscribe(state => todos = state);

    const completeStatuses: boolean[] = todos.map(todo => todo.completed);

    expect(completeStatuses.every(status => status === true)).toBeTrue();
  });

});
