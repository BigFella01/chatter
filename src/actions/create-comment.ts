"use server";

import { revalidatePath } from "next/cache";
// This function rebuilds the route passed into it
import { z } from "zod";
// This is for validating form input
import { auth } from "@/auth";
// This is to see if a user is signed in
import prisma from "@/db";
// This gives us access to our database
import paths from "@/paths";
// This gives us our path helper functions

const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}
// ^This interface annotates the shape of the formState passed into
// the server action, as well as the object returned by the server
// action. It will always return an 'errors' object, whether it is
// empty or not. However, it will not always return a 'success' value,
// hence the ? operator

export async function createComment(
  { postId, parentId }: { postId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {
  // This server action receives three parameters.
  // p1: {postId, parentId} (postId is the id of the post the
  // user is commenting on, parentId is the id of the comment
  // the user is replying to.)
  // p2: formState (This is the object we send with the server
  // action for validation purposes)
  // p3: formData (This doesn't need explaining)

  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must sign in to do this."],
      },
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        parentId: parentId,
        userId: session.user.id!,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  const topic = await prisma.topic.findFirst({
    where: { posts: { some: { id: postId } } },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Failed to revalidate topic"],
      },
    };
  }

  revalidatePath(paths.showPost(topic.slug, postId));
  return {
    errors: {},
    success: true,
  };
}
