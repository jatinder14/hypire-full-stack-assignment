import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BaseModal from "@/custom-components/BaseModal";
import {
  createMenuItem,
  revalidateMenuItems,
} from "@/lib/features/menu/menuSlice";
import { AppDispatch } from "@/lib/store";
import { IMenuItem } from "@/types";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";

interface IModalForm {
  onShowModal: () => void;
  isOpen: boolean;
  parentData: IMenuItem;
}

const AddMenuForm: FC<IModalForm> = ({ onShowModal, isOpen, parentData }) => {
  const menuIdGenerated = crypto.randomUUID();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    await dispatch(
      createMenuItem({
        parent_id: parentData.menu_id,
        menu_id: menuIdGenerated,
        depth: parentData.depth + 1,
        name,
      })
    );
    await dispatch(revalidateMenuItems());
    onShowModal();
    setName("");
  };
  return (
    <BaseModal onShowModal={onShowModal} isOpen={isOpen} title={"Add Menu"}>
      <form className="grid gap-4 py-4" onSubmit={onSubmitForm}>
        <div className="grid gap-2">
          <Label htmlFor="menuId">Menu ID</Label>
          <Input
            id="menuId"
            defaultValue={menuIdGenerated}
            className="bg-white"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="depth">Depth</Label>
          <Input
            id="depth"
            defaultValue={parentData.depth + 1}
            className="bg-gray-100"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parentData">Parent Data</Label>
          <Input
            id="parentData"
            defaultValue={parentData.name}
            className="bg-white"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue=""
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

export default AddMenuForm;
