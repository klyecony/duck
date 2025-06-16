"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { BowlFood, CalendarDots, List, ListChecks, Notches, Plus } from "@phosphor-icons/react";
import {
  Button,
  Card,
  CardBody,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import MealForm from "@/components/shopping/MealForm";
import { EntryForm } from "@/components/shopping/EntryForm";
import { useModalStack } from "@/components/ui/StackedModal";
import { Text } from "@/components/ui/Text";
import Image from "next/image";

const Creator = () => {
  const { add } = useModalStack();
  const ref = useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const [position, setPosition] = useLocalStorage("creatorPosition", { x: 0, y: 0 });
  const [quote, setQuote] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/quote");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuote(data[0]); // ZenQuotes returns an array
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };

    fetchQuote();
  }, []);

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
        size="lg"
        variant="shadow"
        isIconOnly
        onPress={() =>
          add(
            <ModalContent className="relative">
              <ModalHeader>
                <Text variant="h2" weight="bold">
                  Erstellen
                </Text>
              </ModalHeader>
              <ModalBody className="grid grid-cols-2 gap-2">
                <Card
                  className="aspect-square bg-transparent p-2"
                  isPressable
                  isHoverable
                  onPress={() => add(<MealForm />)}
                >
                  <CardBody className="flex items-center justify-center">
                    <CalendarDots size={44} weight="thin" />
                  </CardBody>
                </Card>
                <Card
                  className="aspect-square bg-transparent p-2"
                  isPressable
                  isHoverable
                  onPress={() => add(<EntryForm />)}
                >
                  <CardBody className="flex items-center justify-center">
                    <List size={44} weight="thin" />
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter>
                <Text variant="small" className="font-serif">
                  {`${quote?.q} - ${quote?.a}`}
                </Text>
              </ModalFooter>
              <Image
                src="/logo.svg"
                alt="Duck Logo"
                width={1024}
                height={1024}
                className="-z-10 -translate-x-44 absolute h-[512px] w-[512px] opacity-5"
              />
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
