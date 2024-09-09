import { CustomPagination } from "@/components/shared/custom-pagination";
import { FilterSelection } from "@/components/shared/filter-selection";
import { CallsTable } from "@/components/table";
import { cookies } from "next/headers";
const LIMIT = 10; // Number of items per page

// API call to fetch all calls with error handling
const getAllCalls = async (offset: number, limit: number) => {
    try {
        const cookieStore = cookies();

        const authorization = cookieStore.get("Authorization");
        console.log(authorization);
        if (!authorization) {
            throw new Error("You must be logged in to view this page");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/calls?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authorization.value}`,
                },
                next: { tags: ["get-all-calls"] },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch calls. Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching calls:", error);
        return {
            error: true,
            message: error.message || "An error occurred while fetching calls.",
        };
    }
};

// Filter calls based on archive status
const filterCalls = (filter: string, calls: Call[]) => {
    switch (filter) {
        case "archived":
            return calls.filter((call) => call.is_archived);
        case "unarchived":
            return calls.filter((call) => !call.is_archived);
        default:
            return calls;
    }
};

// Main Calls Page component
const CallsPage = async ({
    searchParams,
}: {
    searchParams: { filter: string; page: string; offset: string };
}) => {
    const page = parseInt(searchParams.page || "1", 10);
    const offset = (page - 1) * LIMIT;
    const filter = searchParams.filter || null;

    // Fetching calls
    const response = await getAllCalls(offset, LIMIT);
    if (response.error) {
        return (
            <div className="h-screen flex flex-col justify-center space-y-4 items-center font-bold text-3xl">
                <p>{response.message}</p>
                {/* <Link href="/login">
                    <Button>Go to Login Page</Button>
                </Link> */}
            </div>
        );
    }

    let calls = response.nodes || [];

    // Filter calls based on the filter criteria
    if (filter) {
        calls = filterCalls(filter, calls);
        if (calls.length === 0) {
            return <div>No calls found.</div>;
        }
    }

    const totalRecords = response.totalCount || 0;
    const hasNextPage = response.hasNext || false;

    return (
        <section className="space-y-4 container mx-auto max-w-[1440px]">
            <FilterSelection
                id="calls-filter"
                placeholder="Filter by"
                page={searchParams.page}
                offset={searchParams.offset}
                options={[
                    { label: "All", value: "all" },
                    { label: "Archived", value: "archived" },
                    { label: "Not Archived", value: "unarchived" },
                ]}
            />

            <CallsTable calls={calls} />

            <CustomPagination
                page={page.toString()}
                offset={offset.toString()}
                total={totalRecords}
                hasNextPage={hasNextPage}
                filter={filter}
            />
        </section>
    );
};

export default CallsPage;
