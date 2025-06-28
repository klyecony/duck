import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  type Selection,
} from "@heroui/react";
import { useFilter } from "@react-aria/i18n";
import { type KeyboardEvent, type ReactNode, useCallback, useMemo, useState } from "react";
import { Text } from "./Text";
type SearchBoxType = {
  startContent?: ReactNode;
  endContent?: ReactNode;
  label: string;
  description?: string;
  key: string;

  isDisabled?: boolean;
};

type CreatorCallbackProps = {
  searchValue: string;
  close: () => void;
};

interface SearchBoxProps {
  children?: ReactNode | (({ searchValue }: { searchValue: string }) => ReactNode);
  emptyContent?: ({ searchValue, close }: CreatorCallbackProps) => ReactNode;

  selectedKeys: Selection;
  onSelectionChange: (selection: Selection) => void;
  items?: SearchBoxType[];

  isDisabled?: boolean;
}

const SearchBox = ({
  children,
  emptyContent,
  selectedKeys,
  items,
  onSelectionChange,
  isDisabled,
}: SearchBoxProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const { contains } = useFilter({
    sensitivity: "base",
  });

  const matchedComposers = useMemo(() => {
    return items?.filter(composer => {
      return (
        contains(composer.label, searchValue) ||
        (composer.description && contains(composer.description, searchValue))
      );
    });
  }, [items, searchValue, contains]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      setSearchValue("");
      setOpen(open);
    },
    [searchValue, setOpen],
  );

  const getPopoverContent = useCallback(() => {
    if (matchedComposers?.length === 0 && emptyContent) {
      return emptyContent({ searchValue, close: () => setOpen(false) });
    }
    return (
      <Listbox
        className="max-h-48 overflow-scroll p-1"
        items={matchedComposers}
        aria-label="Search results"
        emptyContent="Keine Ergebnisse..."
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={v => {
          setOpen(false);
          onSelectionChange(v);
        }}
      >
        {(item: SearchBoxType) => (
          <ListboxItem
            variant="flat"
            key={item.key}
            textValue={item.label}
            description={
              item.description && (
                <Text behave="truncate" weight="normal">
                  {item.description}
                </Text>
              )
            }
            data-selected={[...selectedKeys].includes(item.key)}
            endContent={item.endContent && item.endContent}
            startContent={item.startContent && item.startContent}
            classNames={{
              title: "text-nowrap",
            }}
          >
            <Text behave="truncate">{item.label}</Text>
          </ListboxItem>
        )}
      </Listbox>
    );
  }, [matchedComposers, emptyContent]);

  return (
    <Popover
      isTriggerDisabled={isDisabled}
      triggerScaleOnOpen={false}
      shouldBlockScroll={true}
      isOpen={open}
      shadow="lg"
      radius="lg"
      placement="bottom-start"
      onOpenChange={onOpenChange}
      offset={10}
      classNames={{
        content: "p-2",
      }}
    >
      <PopoverTrigger>
        {typeof children === "function"
          ? children({ searchValue })
          : (children ?? <Button color="primary">Öffnen</Button>)}
      </PopoverTrigger>
      <PopoverContent className="w-64 gap-2">
        <Input
          name="search"
          autoComplete="off"
          radius="sm"
          autoFocus={true}
          value={searchValue}
          onValueChange={setSearchValue}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (!emptyContent) return;
            if (e.key === "Enter") {
              onSelectionChange(new Set([searchValue]));
              onOpenChange(false);
            }
          }}
        />
        {getPopoverContent()}
      </PopoverContent>
    </Popover>
  );
};

SearchBox.displayName = "SearchBox";

export { SearchBox };
