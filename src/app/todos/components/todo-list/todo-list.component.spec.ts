import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { TodoComponent } from '../todo/todo.component';
import { TodosListComponent } from './todo-list.component';
import { ITodo } from '../../interfaces';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';

describe('TodoListComponent Test', () => {

  let component: TodosListComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TodosListComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        TodoComponent,
        TodosListComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        UntypedFormBuilder,
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosListComponent);
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

  it('should render a list of todo components', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const todoTextArray = ['Todo 1', 'Todo2', 'Todo 3'];
    todoTextArray.map(text => {
      todosService.addTodo(text);
    });

    fixture.detectChanges();

    const labelTags: DebugElement[] = debugElement.queryAll(By.css('label'));
    expect(labelTags.length).toEqual(todoTextArray.length);
  });

  it('Should show the no-matches element if there are no todos matching the filter mode', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const todoTextArray = ['Todo 1', 'Todo2', 'Todo 3'];
    todoTextArray.map(text => {
      todosService.addTodo(text);
    });

    fixture.detectChanges();

    todosService.changeFilterMode('Completed');

    fixture.detectChanges();

    const noMatches: HTMLParagraphElement = debugElement.query(By.css('.no-matches')).nativeElement;

    expect(noMatches).toBeTruthy();
  });

  it('Should handle onTodoCompleted when the app-todo component emits (completeTodo)', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();

    const todoTextArray = ['Todo 1', 'Todo2', 'Todo 3'];
    todoTextArray.map(text => {
      todosService.addTodo(text);
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const onTodoCompletedSpy = spyOn(component, 'onTodoCompleted').and.callThrough();

      const firstTodoComponent: TodoComponent = component.todoComponents.first;
      firstTodoComponent.markAsComplete();

      expect(onTodoCompletedSpy).toHaveBeenCalledWith(0);

      let todos: ITodo[];
      todosService.todos$.pipe(take(1)).subscribe(state => todos = state);

      expect(todos[0].completed).toBeTrue();
    });

  }));

  it('Should handle onRemoveTodo when the app-todo component emits (removeTodo)', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();

    const todoTextArray = ['Todo 1', 'Todo2', 'Todo 3'];
    const lastIndex = todoTextArray.length - 1;
    todoTextArray.map(text => {
      todosService.addTodo(text);
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const onRemoveTodoSpy = spyOn(component, 'onRemoveTodo').and.callThrough();

      const firstTodoComponent: TodoComponent = component.todoComponents.last;
      firstTodoComponent.remove();

      expect(onRemoveTodoSpy).toHaveBeenCalledWith(lastIndex);

      let todos: ITodo[];
      todosService.todos$.pipe(take(1)).subscribe(state => todos = state);

      expect(todos.length).toBe(2);
    });

  }));

});
