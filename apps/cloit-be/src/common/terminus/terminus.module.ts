// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { TerminusLogger } from './terminus.service';

@Global()
@Module({
  providers: [TerminusLogger],
  exports: [TerminusLogger],
})
export class TerminusModule {}
