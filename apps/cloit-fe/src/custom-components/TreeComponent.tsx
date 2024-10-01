"use client";
import { IMenuItem } from "@/types";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import AddMenuForm from "./AddMenuForm";
import DeleteMenuConfirm from "./DeleteMenuConfirm";
import UpdateMenuForm from "./UpdateMenuForm";

interface TreeComponentProps {
  menu: IMenuItem;
  expandAll: boolean;
}

const TreeComponent: FC<TreeComponentProps> = ({ menu, expandAll }) => {
  const [isExpanded, setIsExpanded] = useState(menu.depth < 2);
  const hasChildren = menu.children && menu.children.length > 0;
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  useEffect(() => {
    if (expandAll) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [expandAll]);

  return (
    <div className={`ml-${menu.depth} `}>
      <div className="flex items-center py-1">
        <div className="flex items-center">
          <button onClick={toggleExpand} className="focus:outline-none">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <span className="ml-2 text-sm">{menu.name}</span>
        </div>
        <div className="flex">
          <Plus
            size={20}
            className=" ml-2 text-blue-500 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
         {menu.parent_id && (
            <Trash2
              size={20}
              className="mx-2 text-blue-500 cursor-pointer"
              onClick={() => setShowConfirmDelete(true)}
            />
          )}
          <Pencil
            size={20}
            className="text-blue-500 cursor-pointer"
            onClick={() => setShowUpdateModal(true)}
          />
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-gray-300 pl-4">
          {menu.children.map((child) => (
            <TreeComponent
              key={child.menu_id}
              menu={child}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
      {showModal && (
        <AddMenuForm
          parentData={menu}
          onShowModal={() => setShowModal((prev) => !prev)}
          isOpen={showModal}
        />
      )}
      {showUpdateModal && (
        <UpdateMenuForm
          menuData={menu}
          onShowModal={() => setShowUpdateModal((prev) => !prev)}
          isOpen={showUpdateModal}
        />
      )}
      {showConfirmDelete && (
        <DeleteMenuConfirm
          data={menu}
          onShowModal={() => setShowConfirmDelete((prev) => !prev)}
          isOpen={showConfirmDelete}
        />
      )}
    </div>
  );
};

export default TreeComponent;
