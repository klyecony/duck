"use client";

import Tag from "@/components/tags/Tag";
import { TagForm } from "@/components/tags/TagForm";
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
            db.transact(db.tx.tags[tag.id].update({ deletedAt: Date.now() }))
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
