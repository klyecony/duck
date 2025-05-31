// components/ModalProvider.tsx
"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, type ModalProps } from "@heroui/react";
import { motionProps } from "@/components/ui/config/modal";

interface EditorContextType {
  openEditor: (props: { children: ReactNode } & Partial<ModalProps>) => void;
  closeEditor: () => void;
  onOpenChange: (open: boolean) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside ModalProvider");
  return ctx;
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState<Partial<ModalProps>>({});
  const [content, setContent] = useState<ReactNode>(null);

  const openEditor = useCallback((props: { children: ReactNode } & Partial<ModalProps>) => {
    setContent(props.children);
    setModalProps(props);
  }, []);

  const closeEditor = useCallback(() => {
    setContent(null);
    setModalProps({});
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setContent(null);
      setModalProps({});
    }
  }, []);

  return (
    <EditorContext.Provider value={{ openEditor, closeEditor, onOpenChange }}>
      {children}
      <Modal
        isOpen={!!content}
        onOpenChange={onOpenChange}
        motionProps={motionProps}
        placement="center"
        backdrop="blur"
        shadow="none"
        {...modalProps}
      >
        <ModalContent>
          <ModalHeader>{modalProps.title}</ModalHeader>
          <ModalBody>{content}</ModalBody>
        </ModalContent>
      </Modal>
    </EditorContext.Provider>
  );
};
