import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Drawer, type ModalProps } from "@heroui/react";
import { id } from "@instantdb/react";
import {} from "framer-motion";

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

  const getDrawerMotionProps = useMemo(() => {
    return (visibleIndex: number, isTopMost: boolean) => {
      const opacity = Math.max(0.4, 1 - visibleIndex * 0.15);
      const yOffset = -visibleIndex * 8;

      return {
        variants: {
          enter: {
            transform: isTopMost
              ? "translateY(20px) translateZ(0)"
              : `translateY(${yOffset + 20}px) translateZ(0)`,
            opacity,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
          exit: {
            transform: "translateY(100%) translateZ(0)",
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.35,
              ease: [0.4, 0, 1, 1],
            },
          },
          initial: isTopMost
            ? {
                transform: "translateY(100%) translateZ(0) scale(0.95)",
                opacity: 0,
              }
            : {
                transform: `translateY(${yOffset}px) translateZ(0)`,
                opacity,
              },
        },
      };
    };
  }, []);

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
            motionProps={motionProps as any}
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
