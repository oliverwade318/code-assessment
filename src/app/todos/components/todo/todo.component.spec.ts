import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { TodoComponent } from './todo.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { ITodo } from '../../interfaces';
import { todosReducer } from '../../state/todos.reducer';
import { TodosService } from '../../services/todos.service';
import { TODOS_STORE_TOKEN } from '../../constants/injector-tokens';

describe('TodoComponent Test', () => {

  let component: TodoComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [
        TodoComponent,
        TodoFormComponent,
      ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(TODOS_STORE_TOKEN, todosReducer),
      ],
      providers: [
        UntypedFormBuilder,
        TodosService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    debugElement = fixture.debugElement;

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

  it('should render the todo text when the component input is provided', () => {
    const todoText = 'Todo 1';
    const todo: ITodo = {
      text: todoText,
      completed: false,
    };

    component.index = 0;
    component.todo = todo;

    fixture.detectChanges();

    const label: HTMLLabelElement = (debugElement.nativeElement as HTMLElement).querySelector('div > label');
    expect(label.innerText).toEqual(todoText);
  });

  it('should render the update form when in edit mode', () => {
    const todoText = 'Todo 1';
    const todo: ITodo = {
      text: todoText,
      completed: false,
    };

    component.index = 0;
    component.todo = todo;

    fixture.detectChanges();

    debugElement.query(By.css('.view > label')).triggerEventHandler('dblclick', null);

    fixture.detectChanges();

    jasmine.clock().tick(200);
    expect(component.todoFormComponent).toBeDefined();
  });

});
