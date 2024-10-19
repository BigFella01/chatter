import CommentCreateForm from "@/components/comments/comment-create-form";
import PostShow from "@/components/posts/post-show";
import paths from "@/paths";
import Link from "next/link";
import { Suspense } from "react";
// This Suspense component from React allows us to display a 
// fallback until its children finish loading.
import CommentList from "@/components/comments/comment-list";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import PostShowLoading from "@/components/posts/post-show-loading";

interface PostShowPageProps {
  params: {
    slug: string;
    postId: string;
  };
}

export default function ShowPostPage({ params }: PostShowPageProps) {
  const { slug, postId } = params;
  return (
    <div className="space-y-3">
      <Link
        className="underline decoration-solid"
        href={paths.showTopic(slug)}
      ></Link>
      <Suspense fallback={<PostShowLoading />}>
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}
