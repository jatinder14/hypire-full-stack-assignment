"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TreeComponent from "@/custom-components/TreeComponent";
import { fetchMenus } from "@/lib/features/menu/menuSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { IMenuItem } from "@/types";
import { ChevronDown, Folder, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MenuPresenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menuStore = useSelector((state: RootState) => state.menus);
  const { data, isLoading, isError } = menuStore;
  const [selectedMenu, setSelectedMenu] = useState("system management");
  const [isExpandAll, setIsExpandAll] = useState<boolean>(false);
  const handleExpandAll = () => {
    setIsExpandAll((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);
  return (
    <div className="p-5">
      <div className="flex">
        <Folder className="h-5 w-5" /> <span> / Menus</span>
      </div>
      <div className="flex items-center my-5 py-5">
        <LayoutGrid className="h-[30px] w-[30px]" />
        <h1 className="text-[2rem] font-bold ml-3"> Menus</h1>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Menu</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                {selectedMenu}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem
                onSelect={() => setSelectedMenu("System Management")}
              >
                System Management
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSelectedMenu("Database Management")}
              >
                Database management
              </DropdownMenuItem>
              {/* Add more menu items as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex space-x-2">
          <Button variant="default" onClick={handleExpandAll}>
            {isExpandAll ? "Collapse All" : "Expand All"}
          </Button>
        </div>
      </div>
      {isLoading && <h1>is loading. . . </h1>}
      {!isLoading &&
        data?.length > 0 &&
        data?.map((menu: IMenuItem) => (
          <TreeComponent
            key={menu.menu_id}
            menu={menu}
            expandAll={isExpandAll}
          />
        ))}
      {isError && <h1>Error load data</h1>}
    </div>
  );
};

export default MenuPresenter;
