import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { ClearCompletedComponent } from './clear-completed.component';
import { ITodo } from '../../interfaces';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';

describe('ClearCompletedComponent Test', () => {

  let component: ClearCompletedComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<ClearCompletedComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        ClearCompletedComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClearCompletedComponent);
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

  it('should display the button if completed todos exist', () => {
    todosService.addTodo('Todo 1');
    todosService.toggleComplete(0);

    fixture.detectChanges();

    expect((debugElement.nativeElement as HTMLElement).querySelector('.clear-completed')).toBeTruthy();
  });

  it('should not disply the button if completed todos do not exist', () => {
    todosService.addTodo('Incomplete');

    fixture.detectChanges();

    expect((debugElement.nativeElement as HTMLElement).querySelector('.clear-completed')).toBeFalsy();
  });

});
