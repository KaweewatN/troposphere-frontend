export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input?: string | number | boolean | null;
  }>;
}
