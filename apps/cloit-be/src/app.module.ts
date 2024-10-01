import { Module } from '@nestjs/common';
import { MenuModule } from './modules/menus/menu.module';

@Module({
  imports: [
    MenuModule,
    // other modules, e.g product, user
  ],
})
export class AppModule {}
