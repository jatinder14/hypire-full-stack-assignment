import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, ReactNode } from "react";

interface IModalForm {
  onShowModal: () => void;
  title: string;
  isOpen: boolean;
  children: ReactNode;
}

const BaseModal: FC<IModalForm> = ({
  onShowModal,
  isOpen,
  children,
  title = "Add Menu",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onShowModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
