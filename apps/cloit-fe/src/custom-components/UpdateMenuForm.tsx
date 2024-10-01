import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BaseModal from "@/custom-components/BaseModal";
import {
  revalidateMenuItems,
  updateMenuItem,
} from "@/lib/features/menu/menuSlice";
import { AppDispatch } from "@/lib/store";
import { IMenuItem } from "@/types";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";

interface IModalForm {
  onShowModal: () => void;
  isOpen: boolean;
  menuData: IMenuItem;
}

const UpdateMenuForm: FC<IModalForm> = ({ onShowModal, isOpen, menuData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    await dispatch(
      updateMenuItem({
        menuId: menuData.menu_id,
        payloadData: {
          name,
        },
      })
    );
    await dispatch(revalidateMenuItems());
    onShowModal();
    setName("");
  };
  return (
    <BaseModal onShowModal={onShowModal} isOpen={isOpen} title={"Update Menu"}>
      <form className="grid gap-4 py-4" onSubmit={onSubmitForm}>
        <div className="grid gap-2">
          <Label htmlFor="menuId">Menu ID</Label>
          <Input
            id="menuId"
            defaultValue={menuData.menu_id}
            className="bg-white"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="depth">Depth</Label>
          <Input
            id="depth"
            defaultValue={menuData.depth}
            className="bg-gray-100"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue={menuData.name}
            className="bg-white"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save
        </Button>
      </form>
    </BaseModal>
  );
};

export default UpdateMenuForm;
