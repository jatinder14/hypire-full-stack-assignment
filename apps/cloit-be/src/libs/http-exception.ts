import { HttpException, HttpStatus } from '@nestjs/common';

export class MyHttpException extends HttpException {
  constructor(
    private readonly statusCode: HttpStatus,
    public readonly message: string,
    private readonly error?: string,
  ) {
    super(
      {
        statusCode,
        message,
        error: error || null,
      },
      statusCode,
    );
  }
}
