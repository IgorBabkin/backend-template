export interface ITodoValue {
  title: string;
  description: string;
}

export interface ITodo extends ITodoValue {
  id: string;
}
