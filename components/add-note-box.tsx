"use client"
import { addNoteAction } from '@/actions/call.action'
import { toast } from '@/hooks/use-toast'
import { Loader } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
export const AddNoteBox = ({
    id,
}: {
    id: string
}) => {

    const [isSubmtting, setIsSubmitting] = React.useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('callId', id)
        try {
            setIsSubmitting(true)
            const result = await addNoteAction(formData)
            if (result) {
                toast({
                    title: 'Note added',
                    variant: 'default',
                    description: 'The note has been added successfully',
                    duration: 5000,
                })
            }

        } catch (error: any) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: error.message,
                duration: 5000,
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="p-6">
                <p className="text-sm font-medium text-black">Notes</p>
                <Textarea
                    className="w-full"
                    placeholder="Add Notes"
                    name="content"
                    id="content"
                />
            </div>



            <Separator />

            <div className="w-full p-6">
                <DialogClose asChild>
                    <Button
                        disabled={isSubmtting}
                        type="submit" className="bg-call-primary w-full">
                        {
                            isSubmtting && <Loader className="mr-2 animate-spin" size={16} />
                        }

                        {isSubmtting ? 'Saving' : 'Save'}
                    </Button>
                </DialogClose>
            </div>
        </form>

    )
}
