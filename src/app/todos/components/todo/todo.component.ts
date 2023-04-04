import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';

import { ITodo } from '@app/todos/interfaces';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '[appTodo]',
  templateUrl: './todo.component.html',
})
export class TodoComponent {

  @HostBinding('class.completed')
  private get isCompleted(): boolean {
    return this.todo.completed;
  }

  @HostBinding('class.editing')
  private get isEditing(): boolean {
    return this.editing;
  }

  @Input()
  index: number;

  @Input()
  todo: ITodo;

  @Output()
  completeTodo = new EventEmitter<number>();

  @Output()
  removeTodo = new EventEmitter<number>();

  // used by tests
  @ViewChild('editForm')
  todoFormComponent: TodoFormComponent;

  editing = false;

  markAsComplete(): void {
    this.completeTodo.emit(this.index);
  }

  remove(): void {
    this.removeTodo.emit(this.index);
  }

  toggleEditMode(): void {
    this.editing = true;
  }

  onTodoUpdated(updated: boolean): void {
    if (updated) {
      this.editing = false;
    }
  }

}
