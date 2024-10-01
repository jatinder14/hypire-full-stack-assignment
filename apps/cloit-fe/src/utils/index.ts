import { IMenuItem } from "@/types";

export const appendChildToParent = (
  menus: IMenuItem[],
  newItem: IMenuItem
): IMenuItem[] => {
  return menus.map((menu) => {
    if (menu.menu_id === newItem.parent_id) {
      return {
        ...menu,
        children: [...(menu.children || []), newItem],
      };
    }

    // Recursively traverse children
    if (menu.children && menu.children.length > 0) {
      return {
        ...menu,
        children: appendChildToParent(menu.children, newItem),
      };
    }

    return menu;
  });
};
