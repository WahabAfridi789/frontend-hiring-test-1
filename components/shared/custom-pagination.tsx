import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function CustomPagination({
    page,
    total,
    filter,
}: {
    page: string;
    offset: string;
    total: number;
    hasNextPage?: boolean;
    filter?: string | null;
}) {
    const currentPage = parseInt(page, 10) || 1;
    const limit = 10;
    const totalPages = Math.ceil(total / limit);
    const createPageLink = (pageNum: number) => {
        const offset = (pageNum - 1) * limit;
        const baseLink = `?page=${pageNum}&offset=${offset}`;
        return filter ? `${baseLink}&filter=${filter}` : baseLink;
    };

    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    {currentPage > 1 ? (
                        <PaginationPrevious href={createPageLink(currentPage - 1)} >
                            Previous
                        </PaginationPrevious>
                    ) : (
                        <PaginationPrevious href="#" isActive={false} />
                    )}
                </PaginationItem>


                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink href={createPageLink(pageNumber)} isActive={pageNumber === currentPage}>
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}


                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}


                <PaginationItem>
                    {currentPage < totalPages ? (
                        <PaginationNext href={createPageLink(currentPage + 1)} >
                            Next
                        </PaginationNext>
                    ) : (
                        <PaginationNext href="#" isActive={false}>
                            Next
                        </PaginationNext>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
