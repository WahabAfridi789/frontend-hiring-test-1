import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { CALL_TABLE_HEADER_COLUMNS } from "@/const"
import { cn, formatDuration } from "@/lib/utils"
import { Button } from "./ui/button"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddNoteBox } from "./add-note-box"
import { ToggleArchiveButton } from "./toggle-archive-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"



export function CallsTable({ calls }: { calls: Call[] }) {

    return (
        <Table className="border">

            <TableHeader className="bg-neutral-100 ">
                <TableRow className="p-4">
                    {CALL_TABLE_HEADER_COLUMNS.map((column) => (
                        <TableHead className="uppercase font-avenir text-black" key={column.key}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {calls?.map((call) => (
                    <TableRow key={call.id}>
                        <TableCell className={cn("font-medium capitalize",
                            call.call_type === "answered" && "text-call-anwered",
                            call.call_type === "missed" && "text-call-missed",
                            call.call_type === "voicemail" && "text-call-voicemail",
                        )}>{call.call_type}</TableCell>
                        <TableCell className="text-call-primary capitalize">{call.direction}</TableCell>
                        <TableCell>{call.from}</TableCell>
                        <TableCell className="text-right">{call.to}</TableCell>
                        <TableCell>{formatDuration(call.duration)}
                            <span className="block text-call-primary">
                                ({call.duration} seconds)
                            </span>
                        </TableCell>

                        <TableCell>{call.via}</TableCell>
                        <TableCell>{call.created_at}</TableCell>
                        <TableCell>
                            <ToggleArchiveButton id={call.id} isArchived={call.is_archived} />
                        </TableCell>


                        <TableCell>
                            <Dialog>
                                <DialogTrigger className="" asChild>
                                    <Button className="bg-call-primary">Add Note</Button>
                                </DialogTrigger>

                                <DialogContent className="px-0" >
                                    <ScrollArea className="    h-[470px] w-full ">

                                        <div className="!h-[400px]">

                                            <DialogHeader className="p-6 ">
                                                <DialogTitle>Add Notes</DialogTitle>
                                                <DialogDescription className="text-call-primary">
                                                    Call ID : {call.id}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <Separator />

                                            <div className="space-y-2 p-6">
                                                <p className="text-sm flex  gap-4">
                                                    <span className="block capitalize font-medium text-black w-20">

                                                        Call Type:
                                                    </span>
                                                    <span className="block capitalize font-medium text-primary">{call.call_type}</span>
                                                </p>
                                                <p className="text-sm flex  gap-4">
                                                    <span className="block capitalize font-medium text-black w-20">  Duration :</span>

                                                    <span className="block capitalize font-medium text-black">{formatDuration(call.duration)}</span>
                                                </p>
                                                <p className="text-sm flex  gap-4">
                                                    <span className="block capitalize font-medium text-black w-20">  From :</span>
                                                    <span className="block capitalize font-medium text-black">{call.from}</span>

                                                </p>
                                                <p className="text-sm flex  gap-4">
                                                    <span className="block capitalize font-medium text-black w-20">  To :</span>
                                                    <span className="block capitalize font-medium text-black">{call.to}</span>
                                                </p>
                                                <p className="text-sm flex  gap-4">
                                                    <span className="block capitalize font-medium text-black w-20">  Via :</span>
                                                    <span className="block capitalize font-medium text-black">{call.via}</span>
                                                </p>


                                            </div>



                                            <AddNoteBox id={call.id} />
                                        </div>



                                    </ScrollArea>
                                </DialogContent>



                            </Dialog>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
