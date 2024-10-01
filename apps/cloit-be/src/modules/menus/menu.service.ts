import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MenuItem, Prisma } from '@cloit/prisma';
import { TerminusLogger } from 'src/common/terminus/terminus.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: TerminusLogger,
  ) {}
  async create(payload: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    this.logger.log('processing create menu services');
    const data: Prisma.MenuItemCreateInput = {
      ...payload,
      created_at: new Date().toISOString(),
      depth: !payload.parent_id ? 1 : payload.depth,
    };
    return this.prisma.menuItem.create({
      data,
    });
  }
  async list(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MenuItemWhereUniqueInput;
    where?: Prisma.MenuItemWhereInput;
    orderBy?: Prisma.MenuItemOrderByWithRelationInput;
  }): Promise<MenuItem[]> {
    this.logger.log('processing get  list menu item services');
    const { skip, take, cursor, where, orderBy } = params;
    const data = await this.prisma.menuItem.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    // Step 1: Create a map of all items by their menu id
    const itemMap = new Map();
    data.forEach((item) => {
      itemMap.set(item.menu_id, { ...item, children: [] });
    });

    // Step 2: Build the hierarchical structure
    const result = [];

    data.forEach((item) => {
      if (item.parent_id) {
        // If item has a parent_id, find the parent based on its menu_id and append it to its children array
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(itemMap.get(item.menu_id)); // Push the child based on menu_id
        }
      } else {
        // If item has no parent_id, it's a top-level item, add it to the result
        result.push(itemMap.get(item.menu_id));
      }
    });

    return result;
  }

  async getById(
    menuItemWhereUniqueInput: Prisma.MenuItemWhereUniqueInput,
  ): Promise<MenuItem | null> {
    this.logger.log('processing get menu item services');
    return this.prisma.menuItem.findUnique({
      where: menuItemWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.MenuItemWhereUniqueInput;
    data: Prisma.MenuItemUpdateInput;
  }): Promise<MenuItem> {
    this.logger.log('processing update menu services');
    const { where, data } = params;
    return this.prisma.menuItem.update({
      data,
      where,
    });
  }

  // recursive services, if parent delete, delete also its children
  async delete(menuId: string): Promise<object> {
    this.logger.log('Processing delete menu services');

    const childMenus = await this.prisma.menuItem.findMany({
      where: { parent_id: menuId },
    });

    for (const childMenu of childMenus) {
      await this.delete(childMenu.menu_id);
    }
    return this.prisma.menuItem.delete({
      where: { menu_id: menuId },
    });
  }
}
