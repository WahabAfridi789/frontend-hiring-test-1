"use server";

import { revalidatePath } from "next/cache";
import { getUserCookies } from "./auth.actions";
export async function addNoteAction(formData: FormData) {
  const content = formData.get("content");
  const callId = formData.get("callId");
  const token = await getUserCookies();

  console.log("dds", token);
  if (!token) {
    throw new Error("Your session has expired. Please login again");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calls/${callId}/note`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  const token = await getUserCookies();
  console.log("dds", token);

  if (!token) {
    throw new Error("You must be logged in to perform this action");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calls/${callId}/archive`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_archived: !isArchived }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      revalidatePath("/");
      return {
        success: true,
        message: `The call has been ${
          isArchived ? "unarchived" : "archived"
        } successfully`,
      };
    }
    return {
      success: false,
      message: `An error occurred while ${
        isArchived ? "unarchiving" : "archiving"
      } the call`,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
