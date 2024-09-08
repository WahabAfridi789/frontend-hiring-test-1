"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

type Option = {
    value: string;
    label: string;
};

export function FilterSelection({
    placeholder,
    options,
    offset,
    page
}: {
    placeholder: string;
    id?: string;
    page: string;
    offset: string;
    options: Option[];
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleFilterChange = (value: string) => {
        console.log(value);
        router.push(`${pathname}?filter=${value}${page ? `&page=${page}` : ""}${offset ? `&offset=${offset}` : ""}`);
    };

    return (
        <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-fit max-w-[200px] h-10 bg-white gap-2">
                <SelectValue
                    placeholder={placeholder}
                    className="truncate !text-custom-text-secondary"
                />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
