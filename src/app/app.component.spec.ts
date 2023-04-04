import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { CompleteAllComponent } from './todos/components/complete-all/complete-all.component';
import { TodosFooterComponent } from './todos/components/todos-footer/todos-footer.component';
import { TodoFormComponent } from './todos/components/todo-form/todo-form.component';
import { TodosListComponent } from './todos/components/todo-list/todo-list.component';
import { TodosService } from './todos/services/todos.service';
import { TODOS_STORE_TOKEN } from './todos/constants/injector-tokens';
import { todosReducer } from './todos/state/todos.reducer';

describe('AppComponent Test', () => {

  let component: AppComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CompleteAllComponent,
        TodosFooterComponent,
        TodoFormComponent,
        TodosListComponent,
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

    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
  });

  beforeEach(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component should initialize', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header', () => {
    const header: HTMLHeadingElement = debugElement.query(By.css('h1')).nativeElement;
    expect(header.innerText).toBe('todos');
  });

});
