"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { toggleArchiveAction } from "@/actions/call.action";
import { cn } from "@/lib/utils";

export const ToggleArchiveButton = ({ id, isArchived }: { id: string; isArchived: boolean }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleArchive = async () => {
        setIsSubmitting(true);

        try {
            const result = await toggleArchiveAction(id, isArchived);

            if (result) {
                toast({
                    title: "Success",
                    variant: "default",
                    description: `The call has been ${isArchived ? "unarchived" : "archived"} successfully`,
                    duration: 5000,
                });
                // Optionally, re-fetch the call data to update the UI
            }
        } catch (error: any) {
            toast({
                title: "Error",
                variant: "destructive",
                description: error.message,
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Button onClick={handleToggleArchive} disabled={isSubmitting}
            className={cn(isArchived ? "bg-neutral-200 text-gray-700 w-full h-6 text-sm" : "  text-sm w-full h-6 text-green-600 bg-green-100 ", "p-1 rounded-md text-center hover:bg-primary hover:text-white min-w-[100px]")}
        >
            {isSubmitting ? "Processing..." : isArchived ? "Unarchive" : "Archive"}
        </Button>
    );
};
