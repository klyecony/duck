"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Drawer, type ModalProps } from "@heroui/react";
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
  const [closingIds, setClosingIds] = useState<string[]>([]);

  const add = (props: ReactNode, options?: ModalOptions) =>
    setModals(prev =>
      prev.concat({
        id: id(),
        children: props,
        options,
      }),
    );

  const remove = () => {
    if (modals.length === 0) return;
    setClosingIds(prev => [...prev, modals[modals.length - 1].id]);
    setTimeout(() => {
      setModals(modals.slice(0, -1));
      setClosingIds(prev => prev.slice(0, -1));
    }, 100);
  };

  const close = () => {
    setClosingIds([...modals.map(modal => modal.id)]);
    setTimeout(() => {
      setModals([]);
      setClosingIds([]);
    }, 100);
  };

  const getDrawerMotionProps = (visibleIndex: number, isTopMost: boolean) => {
    const opacity = 1 - visibleIndex * 0.2;
    const yOffset = -visibleIndex * 6;

    return {
      variants: {
        enter: {
          y: isTopMost ? 30 : yOffset + 30,
          opacity,
          transition: isTopMost
            ? {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }
            : {
                duration: 0.1,
                ease: [0.4, 0, 1, 1],
              },
        },
        exit: {
          y: "100%",
          opacity: isTopMost ? 0 : opacity,
          transition: {
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          },
        },
        initial: isTopMost
          ? {
              y: "100%",
              opacity: 0,
              scale: 0.9,
            }
          : {
              y: yOffset,
              opacity,
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
        const motionProps = getDrawerMotionProps(visibleIndex, isTopMost);

        return (
          <Drawer
            key={modal.id}
            {...modal.options}
            isOpen={!closingIds.includes(modal.id)}
            onClose={remove}
            motionProps={motionProps}
            placement="bottom"
            backdrop={visibleIndex === modals.length - 1 ? "blur" : "transparent"}
            shadow="none"
            classNames={{
              base: "h-full max-h-[430px] overflow-hidden pb-[30px]",
              header: "p-2.5",
              body: "px-1 pt-0",
              footer: "pb-8",
            }}
          >
            {modal.children}
          </Drawer>
        );
      })}
      {/* <div
        className={cn(
          "fixed bottom-0 left-0 z-[1000] h-1.5 w-full bg-background transition-all ",
          modals.length > 1
            ? "translate-y-0 opacity-100 delay-[70ms] duration-200 ease-[cubic-bezier(0.4,0,1,1)]"
            : "translate-y-1.5 opacity-0 duration-[500ms]",
        )}
      /> */}
    </ModalStackContext.Provider>
  );
};
