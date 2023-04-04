import { initialState, todosReducer } from './todos.reducer';
import { ITodo, ITodosState } from './../interfaces';
import * as TodoActions from './todo.actions';

import { clone } from '@app/lib/utils';

describe('Todos Reducer', () => {
  let state: ITodosState;

  beforeEach(() => {
    state = clone(initialState);
    expect(state).toEqual(initialState);
  });

  describe('Add Todo', () => {
    it('Should add a new Todo', () => {
      const text = 'New todo';
      const todo: ITodo = {
        text,
        completed: false,
      };

      const newState = todosReducer(state, TodoActions.addTodo({ text }));
      expect(newState.todos).toEqual([todo]);
    });
  });

  describe('Remove Todo', () => {
    it('should remove a Todo', () => {
      const text1 = 'Todo 1';
      const todo1: ITodo = {
        text: text1,
        completed: false,
      };

      let newState: ITodosState;

      newState = todosReducer(state, TodoActions.addTodo({ text: text1 }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState = todosReducer(newState, TodoActions.removeTodo({ index: 0 }));
      expect(newState.todos).toEqual([todo1]);
    });
  });

  describe('Toggle Todo completed', () => {
    it('should toggle a todo as completed or not completed', () => {
      let newState: ITodosState;

      newState = todosReducer(state, TodoActions.addTodo({ text: 'New todo' }));
      newState = todosReducer(newState, TodoActions.toggleCompleted({ index: 0 }));
      expect(newState.todos[0].completed).toEqual(true);

      newState = todosReducer(newState, TodoActions.toggleCompleted({ index: 0 }));
      expect(newState.todos[0].completed).toEqual(false);
    });
  });

  describe('Update Todo', () => {
    it('should update the `text` of a todo', () => {
      let newState: ITodosState;
      newState = todosReducer(state, TodoActions.addTodo({ text: 'Todo 1' }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 3' }));
      newState = todosReducer(newState, TodoActions.updateTodo({ index: 1, text: 'Updated' }));
      expect(newState.todos[1].text).toEqual('Updated');
    });
  });

  describe('Toggle All Completed', () => {
    it('should set all `Active` todos as `Completed`', () => {
      let newState: ITodosState;
      newState = todosReducer(state, TodoActions.addTodo({ text: 'Todo 1' }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState = todosReducer(newState, TodoActions.toggleAllCompleted());

      expect(newState.todos[0].completed).toEqual(true);
      expect(newState.todos[1].completed).toEqual(true);
    });

    it('should set all `Completed` todos as `Active`', () => {
      let newState: ITodosState;
      newState = todosReducer(state, TodoActions.addTodo({ text: 'Todo 1' }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState.todos.map(todo => {
        todo.completed = true;
      });
      newState = todosReducer(newState, TodoActions.toggleAllCompleted());

      expect(newState.todos[0].completed).toEqual(false);
      expect(newState.todos[1].completed).toEqual(false);
    });
  });

  describe('Clear Completed', () => {
    it('should clear all `Completed` todos', () => {
      let newState: ITodosState;
      newState = todosReducer(state, TodoActions.addTodo({ text: 'Todo 1' }));
      newState = todosReducer(newState, TodoActions.addTodo({ text: 'Todo 2' }));
      newState = todosReducer(newState, TodoActions.toggleCompleted({ index: 1 }));
      newState = todosReducer(newState, TodoActions.clearCompleted());
      expect(newState.todos.length).toEqual(1);
    });
  });
});
