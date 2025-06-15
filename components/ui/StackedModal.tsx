"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Modal, type ModalProps } from "@heroui/react";
import { id } from "@instantdb/react";

type ModalOptions = Pick<ModalProps, "isDismissable" | "closeButton" | "hideCloseButton">;

interface ModalStackContextType {
  add: (props: ReactNode, options?: ModalOptions) => void;
  remove: () => void;
  close: () => void;
}

type ModalItem = {
  id: string;
  children: ReactNode;
  options?: ModalOptions;
};

const ModalStackContext = createContext<ModalStackContextType | null>(null);

export const useModalStack = () => {
  const ctx = useContext(ModalStackContext);
  if (!ctx) throw new Error("useModalStack must be used inside ModalProvider");
  return ctx;
};

export const ModalStackProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<(ModalItem & ModalOptions)[]>([]);

  const add = (props: ReactNode, options?: ModalOptions) =>
    setModals(prev =>
      prev.concat({
        id: id(),
        children: props,
        options,
      }),
    );

  const remove = () => setModals(modals.slice(0, -1));

  const close = () => setModals([]);

  const getMotionProps = (visibleIndex: number, isTopMost: boolean) => {
    const scale = 1 - visibleIndex * 0.05;
    const opacity = 1 - visibleIndex * 0.2;
    const y = visibleIndex * 16;

    return {
      initial: isTopMost ? { opacity: 0, scale: 0.9, y: 8 } : { opacity, scale, y },
      animate: {
        opacity,
        scale,
        y,
        transition: isTopMost
          ? {
              duration: 0.4,
              delay: 0.07,
              ease: [0.22, 1, 0.36, 1],
            }
          : {
              duration: 0.2,
              ease: [0.4, 0, 1, 1],
            },
      },
    };
  };

  return (
    <ModalStackContext.Provider
      value={{
        add,
        remove,
        close,
      }}
    >
      {children}
      {modals.map((modal, i) => {
        const visibleIndex = modals.length - 1 - i;

        const isTopMost = i === modals.length - 1;
        const motionProps = getMotionProps(visibleIndex, isTopMost);

        return (
          <Modal
            key={modal.id}
            {...modal.options}
            isOpen={true}
            onClose={remove}
            motionProps={motionProps}
            placement="top"
            backdrop={visibleIndex === modals.length - 1 ? "blur" : "transparent"}
            shadow="none"
            classNames={{
              base: "h-full max-h-80",
              body: "pt-2",
            }}
          >
            {modal.children}
          </Modal>
        );
      })}
    </ModalStackContext.Provider>
  );
};
