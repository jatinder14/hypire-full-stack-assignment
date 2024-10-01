import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { TerminusLogger } from 'src/common/terminus/terminus.service';
import { ResponseBuilder } from 'src/libs/response.dto';
import { MenuItem as MenuItemModel } from '@cloit/prisma';
import { MyHttpException } from 'src/libs/http-exception';
import { IMenuPayload } from 'src/types';

@Controller()
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly logger: TerminusLogger,
  ) {}

  @Post('menu')
  async createMenu(
    @Body() menuPayload: IMenuPayload,
  ): Promise<ResponseBuilder<MenuItemModel>> {
    try {
      const res = await this.menuService.create(menuPayload);
      return new ResponseBuilder(
        'success',
        'successfully create new menu item',
        res,
      );
    } catch (error) {
      console.log(error, 'ERROR BACKEND ');
      this.logger.error('error', 'CreateMenuController', 'CreateMenu');
      if (error.code === 'P2002') {
        throw new MyHttpException(
          HttpStatus.NOT_FOUND,
          'some attrs must be unique',
        );
      }
      throw new MyHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'error while creating menu item',
      );
    }
  }

  @Get('menu')
  async getMenus(): Promise<ResponseBuilder<MenuItemModel[]>> {
    const res = await this.menuService.list({ take: 100 });
    return new ResponseBuilder('success', 'successfully get list menu', res);
  }

  @Get('menu/:menu_id')
  async getMenuById(
    @Param('menu_id') menu_id: string,
  ): Promise<ResponseBuilder<MenuItemModel>> {
    try {
      const res = await this.menuService.getById({ menu_id });
      return new ResponseBuilder('success', 'successfully get menu by id', res);
    } catch (error) {
      this.logger.error('error', 'GetMenuByIdController', 'GetMenuById');
      if (error.code === 'P2025') {
        throw new MyHttpException(
          HttpStatus.NOT_FOUND,
          'menu record does not exist',
        );
      }
      throw new MyHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'error while get menu item',
      );
    }
  }

  @Put('menu/:menu_id')
  async updateMenuById(
    @Param('menu_id') menu_id: string,
    @Body() menuPayload: IMenuPayload,
  ): Promise<ResponseBuilder<MenuItemModel>> {
    try {
      const updatedItem = await this.menuService.update({
        where: { menu_id },
        data: menuPayload,
      });
      return new ResponseBuilder(
        'success',
        'menu updated successfully',
        updatedItem,
      );
    } catch (error) {
      this.logger.error('error', 'UpdateMenuController', 'UpdateMenu');
      if (error.code === 'P2025') {
        throw new MyHttpException(
          HttpStatus.NOT_FOUND,
          'menu record does not exist',
        );
      }
      throw new MyHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'error while updating menu',
      );
    }
  }

  @Delete('menu/:menu_id')
  async deleteMenuById(
    @Param('menu_id') menu_id: string,
  ): Promise<ResponseBuilder<object>> {
    try {
      await this.menuService.delete(menu_id);
      return new ResponseBuilder('success', 'menu deleted successfully', {});
    } catch (error) {
      this.logger.error('error', 'DeleteMenuController', 'DeleteMenu');
      if (error.code === 'P2025') {
        throw new MyHttpException(
          HttpStatus.NOT_FOUND,
          'menu record does not exist',
        );
      }
      throw new MyHttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'error while deleting menu',
      );
    }
  }
}
