import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TerminusLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: any[]): void;

  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    // Customize how the error messages are logged here
    // Example: prepend custom info to the error message
    const timestamp = new Date().toISOString();
    const customMessage = `[${timestamp}] Custom Error: ${message}`;
    // Call the base class's error method to preserve default logging behavior
    super.error(customMessage, stack as string, context as string, ...rest);
  }
}
