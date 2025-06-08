"use client";

import type React from "react";
import { useRef } from "react";
import { BowlFood, ListChecks, Notches, Plus } from "@phosphor-icons/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import MealForm from "../shopping/MealForm";
import { EntryForm } from "../shopping/EntryForm";
import { useModalStack } from "../ui/StackedModal";
import { Text } from "../ui/Text";

const Creator = () => {
  const { add } = useModalStack();
  const ref = useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const [position, setPosition] = useLocalStorage("creatorPosition", { x: 0, y: 0 });

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  const startDrag = (
    clientX: number,
    clientY: number,
    stopEvent: "mouseup" | "touchend",
    moveEvent: "mousemove" | "touchmove",
  ) => {
    const startX = clientX;
    const startY = clientY;
    const initialX = position.x;
    const initialY = position.y;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = currentX - startX;
      const dy = currentY - startY;

      if (ref.current && size.width && size.height) {
        const node = ref.current;
        const extraRightMargin = 30;
        const extraBottomMargin = 16;

        const newX = clamp(initialX + dx, 0, size.width - node.offsetWidth - extraRightMargin);
        const newY = clamp(initialY + dy, 0, size.height - node.offsetHeight - extraBottomMargin);

        setPosition({ x: newX, y: newY });
      }
    };

    const stop = () => {
      window.removeEventListener(moveEvent, handleMove);
      window.removeEventListener(stopEvent, stop);
    };

    window.addEventListener(moveEvent, handleMove, { passive: false });
    window.addEventListener(stopEvent, stop);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY, "mouseup", "mousemove");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY, "touchend", "touchmove");
    }
  };

  return (
    <div
      ref={ref}
      className="absolute z-50 touch-none"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <Notches
        size={16}
        className="-right-4 -top-4 absolute rotate-90 cursor-move text-default-500"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />

      <Button
        color="primary"
        variant="shadow"
        isIconOnly
        onPress={() =>
          add(
            <ModalContent>
              <ModalHeader>
                <Text variant="large" weight="bold">
                  Erstellen
                </Text>
              </ModalHeader>
              <ModalBody className="grid grid-cols-2 gap-2">
                <Card className="p-2" isPressable isHoverable onPress={() => add(<MealForm />)}>
                  <CardHeader className="pb-0">Gericht</CardHeader>
                  <CardBody className="flex flex-col items-start justify-start">
                    <BowlFood size={52} weight="thin" />
                  </CardBody>
                </Card>
                <Card className="p-2" isPressable isHoverable onPress={() => add(<EntryForm />)}>
                  <CardHeader className="pb-0">Eintrag</CardHeader>
                  <CardBody className="flex flex-col items-start justify-start">
                    <ListChecks size={52} weight="thin" />
                  </CardBody>
                </Card>
              </ModalBody>
            </ModalContent>,
          )
        }
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export { Creator };
