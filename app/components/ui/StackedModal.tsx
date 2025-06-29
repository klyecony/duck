import { createContext, useContext, useState, type ReactNode } from "react";
import { Drawer, type ModalProps } from "@heroui/react";
import { id } from "@instantdb/react";
import { easeInOut, easeIn } from "framer-motion";

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
    setModals(prev => {
      setClosingIds(_ => {
        const last = prev[prev.length - 1];
        return last ? [last.id] : [];
      });
      return prev;
    });
    setTimeout(() => {
      setModals(prev => prev.slice(0, -1));
    }, 200);
  };

  const close = () => {
    setModals(prev => {
      setClosingIds(_ => prev.map(modal => modal.id));
      return prev;
    });
    setTimeout(() => {
      setModals([]);
      setClosingIds([]);
    }, 200);
  };

  // Import easing functions from framer-motion

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
                ease: easeInOut,
              }
            : {
                duration: 0.1,
                ease: easeInOut,
              },
        },
        exit: {
          y: "100%",
          opacity: isTopMost ? 0 : opacity,
          transition: {
            duration: 0.25,
            ease: easeIn,
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
            hideCloseButton
            isOpen={!closingIds.includes(modal.id)}
            onClose={remove}
            motionProps={motionProps}
            placement="bottom"
            shadow="none"
            radius="lg"
            classNames={{
              backdrop:
                visibleIndex === modals.length - 1
                  ? "bg-gradient-to-t from-secondary/10 to-background backdrop-opacity-20"
                  : "bg-transparent",
              base: "h-full max-h-[430px] pb-[30px]",
              header: "p-2.5",
              body: "px-4 py-0",
              footer: "pb-8",
            }}
          >
            {modal.children}
          </Drawer>
        );
      })}
    </ModalStackContext.Provider>
  );
};
