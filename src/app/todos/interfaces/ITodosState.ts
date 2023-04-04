import { FILTER_MODE } from './../constants/filter-mode';
import { ITodo } from '../interfaces';

export interface ITodosState {
  filterMode?: FILTER_MODE;
  todos?: ITodo[];
}
