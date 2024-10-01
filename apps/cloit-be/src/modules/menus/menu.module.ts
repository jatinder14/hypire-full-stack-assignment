import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TerminusModule } from 'src/common/terminus/terminus.module';

@Module({
  imports: [PrismaModule, TerminusModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
