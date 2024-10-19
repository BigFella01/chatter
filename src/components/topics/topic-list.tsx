import Link from "next/link";
import { Chip } from "@nextui-org/react";
import prisma from "@/db";
import paths from "@/paths";

export default async function TopicList() {
  const topics = await prisma.topic.findMany();

  const renderedTopics = topics.map((topic) => {
    return (
      <div key={topic.id}>
        <Link href={paths.showTopic(topic.slug)}>
          <Chip color="warning" variant="shadow">
            {topic.slug}
          </Chip>
        </Link>
      </div>
    );
  });

  return <div className="flex flex-row flex-wrap gap-2">{renderedTopics}</div>;
}
