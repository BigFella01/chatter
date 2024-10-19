"use server";

import type { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/db";
import paths from "@/paths";
// We are importing this 'paths' object so we know exactly
// what path we're going to navigate the user to.

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lower case letters or dashes without spaces",
    }),
  description: z.string().min(10),
});
// zod allows us to define form validation shapes and
// requirements. In this case, we used an object with
// two key value pairs (name, description) then specified
// necessary characteristics for both.

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    // ^NOTE: These key value pairs are optional because
    // if there is no error with the 'name' property, it won't
    // be sent back to the component. Same with description
    _form?: string[];
    // ^This _form value is for errors that aren't related to 
    // form validation. For example, if the user tries to create a
    // post and is not signed in, or there is simply an error adding
    // the topic to the data base. Also, we used the underscore 
    // before the name to prevent any collision with a different key. 
  };
}
// We built this interface to provide a type for the formState
// parameter in our createTopic server action. createTopic
// returns a promise of that same type. This is due to this server
// action being connected to the useFormState hook on create-topic-
// form.tsx. The types on that hook and this server action must be
// the same.

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  // We run the results of the form through our zod 
  // schema using the safeParse() function. 

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  // If there are any form validation errors, we will return an
  // object of the type CreateTopicFormState. 

  const session = await auth();
  // This is to retrieve the information that tells us whether
  // the user is signed in or not. 
  
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }
  // If the user is not signed in, we will return an object of
  // the type CreateTopicFormState. 

  let topic: Topic;
  try {
    topic = await prisma.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath('/')
  redirect(paths.showTopic(topic.slug));

  
}
