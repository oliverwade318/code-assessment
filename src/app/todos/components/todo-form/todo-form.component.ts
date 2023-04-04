import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ITodo } from '@app/todos/interfaces';
import { TodosService } from '@app/todos/services/todos.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent implements AfterViewInit, OnInit {

  @ViewChild('textInput')
  textInput: ElementRef;

  @Input()
  index: number = null;

  @Input()
  todo: ITodo = null;

  @Output()
  updated = new EventEmitter<boolean>();

  form: UntypedFormGroup;

  get cssClass(): string {
    return this.todo ? 'edit' : 'new-todo';
  }

  constructor (
    private formBuilder: UntypedFormBuilder,
    private todosService: TodosService,
  ) {}

  ngAfterViewInit(): void {
    this.focusTextInput();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: [
        this.todo ? this.todo.text : '', [Validators.required]
      ]
    });
  }

  onSubmit(): void {
    const text = this.form.value.text;

    if (text) {
      if (this.todo) {
        this.todosService.updateTodo(this.index, text);
        this.updated.emit(true);
      }
      else {
        this.todosService.addTodo(text);
      }

      this.form.reset();
      this.focusTextInput();
    }
  }

  focusTextInput(): void {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    }, 100);
  }

}
