import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { take } from 'rxjs';

import { TodoFormComponent } from '../todo-form/todo-form.component';
import { ITodo } from '../../interfaces';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';

describe('TodoFormComponent Test', () => {

  let component: TodoFormComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TodoFormComponent>;
  let todosService: TodosService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        TodoFormComponent,
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

    fixture = TestBed.createComponent(TodoFormComponent);
    debugElement = fixture.debugElement;
    todosService = fixture.debugElement.injector.get(TodosService);

  });

  beforeEach(() => {
    component = fixture.componentInstance;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('Component should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('Should focus the text input after the view initializes', () => {
    fixture.detectChanges();

    const nativeElement = (debugElement.nativeElement as HTMLElement).querySelector('input');

    spyOn(nativeElement, 'focus');

    jasmine.clock().tick(101);
    expect(nativeElement.focus).toHaveBeenCalled();
  });

  it('Should call addTodo if no todo object is provided as input', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const form: DebugElement = debugElement.query(By.css('form'));
    const textInput: HTMLInputElement = debugElement.query(By.css('input')).nativeElement;

    const textInputSpy = spyOn(textInput, 'focus');
    const todoServiceSpy = spyOn(todosService, 'addTodo').and.callThrough();

    // set input value
    textInput.value = 'New Todo';
    textInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // submit form
    form.triggerEventHandler('ngSubmit', new Event('submit'));
    fixture.detectChanges();

    // form should reset
    expect(textInput.value).toBeFalsy();

    // wait for focus to occur
    jasmine.clock().tick(101);

    expect(textInputSpy).toHaveBeenCalled();

    // Check service was called
    expect(todoServiceSpy).toHaveBeenCalled();

    // call to service invoked by submit should have created 1 new todo
    let todos: ITodo[];
    todosService.allTodos$.pipe(take(1)).subscribe(state => todos = state);

    // New todo should be added
    expect(todos.length).toEqual(1);

  });

  it('Should call updateTodo if any todo objects are present', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const todoServiceSpy = spyOn(todosService, 'updateTodo').and.callThrough();

    // set up data
    todosService.addTodo('Todo 1');
    todosService.addTodo('Todo 2');

    let todos: ITodo[];
    todosService.allTodos$.pipe(take(1)).subscribe(state => todos = state);

    // populate component inputs
    const index = 1;
    component.index = index;
    component.todo = todos[index];
    fixture.detectChanges();

    // Update text input and submit form
    const form: DebugElement = debugElement.query(By.css('form'));
    const textInput: HTMLInputElement = debugElement.query(By.css('input')).nativeElement;

    const updateText = 'Updated Todo';
    textInput.value = updateText;
    textInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    form.triggerEventHandler('ngSubmit', new Event('submit'));
    fixture.detectChanges();

    // get latest data from service and validate changes
    todosService.allTodos$.pipe(take(1)).subscribe(state => todos = state);
    const updatedTodo = todos[index];

    expect(todoServiceSpy).toHaveBeenCalled();
    expect(updatedTodo.text).toBe(updateText);
  });

});
