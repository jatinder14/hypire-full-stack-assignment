// response.dto.ts
export class ResponseBuilder<T = any> {
  status: 'success' | 'failed';
  message: string;
  data: T;

  constructor(status: 'success' | 'failed', message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
