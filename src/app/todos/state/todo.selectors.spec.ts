import { FILTER_MODE } from '../constants/filter-mode';
import { ITodo } from '../interfaces/ITodo';
import * as todoSelectors from './todo.selectors';

function createTodos(todoText: string[]): ITodo[] {
  return todoText.map(text => ({
    text,
    completed: false
  }) as ITodo);
}

describe('Todo Selectors', () => {

  describe('completedTodos', () => {
    it('should return only completed todos', () => {
      const todos = createTodos(['Todo 1', 'Todo 2']);
      todos[1].completed = true;

      expect(todoSelectors.completedTodos.projector(todos)).toEqual([todos[1]]);
    });
  });

  describe('incompleteTodos', () => {
    it('should only return incomplete todos', () => {
      const todos = createTodos(['Todo 1', 'Todo 2']);
      todos[0].completed = true;

      expect(todoSelectors.incompleteTodos.projector(todos)).toEqual([todos[1]]);
    });
  });

  describe('todos', () => {
    it('should return todos that match the filter mode', () => {
      const todos = createTodos(['Todo 1', 'Todo 2', 'Todo3', 'Todo 4', 'Todo 5']);
      todos[2].completed = true;
      todos[3].completed = true;

      const active: FILTER_MODE = 'Active';
      const all: FILTER_MODE = 'All';
      const completed: FILTER_MODE = 'Completed';

      expect(todoSelectors.todos.projector(active, todos)).toEqual([todos[0], todos[1], todos[4]]);
      expect(todoSelectors.todos.projector(all, todos)).toEqual(todos);
      expect(todoSelectors.todos.projector(completed, todos)).toEqual([todos[2], todos[3]]);
    });
  });

  describe('allTodosCompleted', () => {
    it('should return `true` if all todos are complete', () => {
      const todos = createTodos(['Todo 1', 'Todo 2', 'Todo3']);
      todos.map(todo => todo.completed = true);

      const completedTodos = todoSelectors.completedTodos.projector(todos);
      const multipleTodosExist = todoSelectors.multipleTodosExist.projector(todos);

      expect(todoSelectors.allTodosCompleted.projector(todos, completedTodos, multipleTodosExist)).toBeTrue();
    });

    it('should return `false` if any todos are incomplete', () => {
      const todos = createTodos(['Todo 1', 'Todo 2', 'Todo3']);
      todos[0].completed = true;
      todos[1].completed = false;
      todos[2].completed = true;

      const completedTodos = todoSelectors.completedTodos.projector(todos);
      const multipleTodosExist = todoSelectors.multipleTodosExist.projector(todos);

      expect(todoSelectors.allTodosCompleted.projector(todos, completedTodos, multipleTodosExist)).toBeFalse();
    });
  });

  describe('noMatches', () => {
    it('should return true if there are any todos matching the FILTER_MODE', () => {
      const todos = createTodos(['Todo 1', 'Todo 2', 'Todo3']);
      const todos2 = [...todos].map((todo, index) => ({ ...todo, completed: true }));

      const active: FILTER_MODE = 'Active';
      const completed: FILTER_MODE = 'Completed';
      const activeTodos: ITodo[] = todoSelectors.todos.projector(completed, todos);
      const completedTodos: ITodo[] = todoSelectors.todos.projector(active, todos2);
      const todosExist = todoSelectors.todosExist.projector(todos);

      expect(todoSelectors.noMatches.projector(active, todosExist, completedTodos)).toBeTrue();
      expect(todoSelectors.noMatches.projector(completed, todosExist, activeTodos)).toBeTrue();
    });
  });

});
