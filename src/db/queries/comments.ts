import type { Comment } from "@prisma/client";
import { cache } from "react";
// This cache function allows us to make duplicate data
// requests without the penalty of slowing down the application. 
// The function will only be executed one time. 
import prisma from "@/db";

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

export const fetchCommentsByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    return prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);
