"use client";

import { useEditor } from "@/components/lib/editor";
import Tag from "@/components/lib/Tag";
import { TagForm } from "@/components/lib/TagForm";
import { db } from "@/db";

const Page = () => {
  const { openEditor } = useEditor();

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
          isDisabled={tag.isDeleted}
          onClose={() => db.transact(db.tx.tags[tag.id].update({ isDeleted: true }))}
          onClick={() =>
            openEditor({
              title: "Tag bearbeiten",
              children: <TagForm tag={tag} />,
            })
          }
        />
      ))}
      <Tag
        onClick={() =>
          openEditor({
            title: "Tag erstellen",
            children: <TagForm />,
          })
        }
      />
    </>
  );
};

export default Page;
