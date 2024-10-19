import { Divider } from "@nextui-org/react";
import CreateTopicForm from "@/components/topics/create-topic-form";
import TopicList from "@/components/topics/topic-list";
import PostList from "@/components/posts/post-list";
import { fetchTopPosts } from "@/db/queries/posts";

export default async function Home() {
  // When we make use of this auth() function inside of a
  // server component, as we did right here, we get back a
  // session object that might be null, and if its not null,
  // it's going to have a user property that's going to
  // contain information about the user. However, when we
  // make use of the useSession hook (in profile.tsx),
  // the data type or the value that gets returned is slightly
  // different. We're going to get back an object that's always
  // going to be defined. The actual session data will be available
  // on a data property which might be null. (session.data?.user).
  // That user property will only be defined if the user is signed
  // in.

  // Checking from server component: session?.user
  // Checking from client component: session.data?.user

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-xl m-2">Top Posts</h1>
        <PostList fetchData={fetchTopPosts} />
      </div>
      <div className="border shadow py-3 px-2">
        <CreateTopicForm />
        <Divider className="my-2" />
        <h3 className="text-lg">Topics</h3>
        <TopicList />
      </div>
    </div>
  );
}
