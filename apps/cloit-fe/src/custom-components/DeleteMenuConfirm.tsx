import { Button } from "@/components/ui/button";
import BaseModal from "@/custom-components/BaseModal";
import {
  deleteMenuItem,
  revalidateMenuItems,
} from "@/lib/features/menu/menuSlice";
import { AppDispatch } from "@/lib/store";
import { IMenuItem } from "@/types";
import { FC } from "react";
import { useDispatch } from "react-redux";

interface IDeleteMenuConfirm {
  onShowModal: () => void;
  isOpen: boolean;
  data: IMenuItem;
}

const DeleteMenuConfirm: FC<IDeleteMenuConfirm> = ({
  onShowModal,
  isOpen,
  data,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const onSubmitDeletion = async (e: any) => {
    e.preventDefault();
    await dispatch(deleteMenuItem(data.menu_id));
    await dispatch(revalidateMenuItems());
    onShowModal();
  };
  return (
    <BaseModal
      onShowModal={onShowModal}
      isOpen={isOpen}
      title={"Confirm Deletion"}
    >
      <h1>Are you sure to delete this menu item?</h1>
      <Button onClick={onSubmitDeletion}>Yes</Button>
      <Button>No</Button>
    </BaseModal>
  );
};

export default DeleteMenuConfirm;
