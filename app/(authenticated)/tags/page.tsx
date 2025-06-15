"use client";

import Tag from "@/components/Tag";
import { TagForm } from "@/components/shopping/TagForm";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button } from "@heroui/react";
import { Plus } from "@phosphor-icons/react";

const Page = () => {
  const { add } = useModalStack();

  const { data } = db.useQuery({
    tags: {},
  });

  const tags = data?.tags || [];

  return (
    <>
      {tags.map(tag => (
        <Tag
          key={tag.id}
          tag={tag}
          isDisabled={!!tag.deletedAt}
          onClose={() =>
            db.transact(db.tx.tags[tag.id].update({ deletedAt: new Date().toISOString() }))
          }
          onClick={() => add(<TagForm tag={tag} />)}
        />
      ))}
      <Button isIconOnly variant="ghost" onPress={() => add(<TagForm />)}>
        <Plus />
      </Button>
    </>
  );
};

export default Page;
