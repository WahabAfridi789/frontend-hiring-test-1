"use server";

import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
export async function addNoteAction(formData: FormData) {
  const content = formData.get("content");
  const callId = formData.get("callId");

  const headersList = headers();

  headersList.forEach((value, key) => {
    console.log(key, value);
  });

  const authorization = headers().get("authorization");

  console.log(authorization); // Logs headers object

  //Data access layer
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "You must be logged in to add note",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calls/${callId}/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.access_token}`,
        },

        body: JSON.stringify({ content }),
      }
    );

    if (response.status === 201) {
      revalidatePath("/");
      return {
        success: true,
        mesaage: "Note added successfully",
      };
    }
    return {
      success: false,
      message: "An error occurred while adding note",
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: `An error occurred while adding note ${error?.message}`,
    };
  }
}

export async function toggleArchiveAction(callId: string, isArchived: boolean) {
  const session = await auth();
  if (!session) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calls/${callId}/archive`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.access_token}`,
        },
        body: JSON.stringify({ is_archived: !isArchived }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      revalidatePath("/");
      return data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
