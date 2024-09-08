import { CallsTable } from '@/components/table'
import React from 'react'
import { auth } from '../auth'
import { FilterSelection } from '@/components/shared/filter-selection'
import { CustomPagination } from '@/components/shared/custom-pagination'
import Link from 'next/link'
import { Button } from '@/components/ui/button'


const LIMIT = 10; // Number of items per page 


const getAllCalls = async (offset: number, limit: number) => {
    const session = await auth();
    if (!session) {
        return {
            error: true,
            message: "You must be logged in to view this page",
        };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/calls?offset=${offset}&limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.access_token}`,
                },
                next: {
                    tags: ['get-all-calls'],
                }
            })

        const data = await response.json()
        return data


    } catch (error: any) {
        console.error(error)
        return {
            error: true,
            message: `An error occurred while fetching calls: ${error?.message}`,
        }
    }
}

const filterCalls = async (filter: string, calls: Call[]) => {



    switch (filter) {
        case 'archived':
            return calls.filter(call => call.is_archived)
        case 'unarchived':
            return calls.filter(call => !call.is_archived)
        default:
            return calls
    }
}


const CallsPage = async ({ searchParams }: {
    searchParams: {
        filter: string
        page: string
        offset: string
    }
}) => {

    const page = parseInt(searchParams.page || "1", 10);
    const offset = (page - 1) * LIMIT;
    const filter = searchParams.filter || null;
    let calls = []
    const response = await getAllCalls(offset, LIMIT);
    if (response.error) {
        return <div className='h-screen flex flex-col justify-center space-y-4 items-center font-bold text-3xl '>
            <p>
                {response.message}
            </p>
            <Link href={"/login"} className='block'>
                <Button>Got to Login Page</Button>

            </Link>

        </div>
    }

    calls = response.nodes
    if (filter) {
        calls = await filterCalls(filter, calls)
        if (calls.length === 0) {
            return <div>No calls found</div>
        }
    }

    const totalRecords = response.totalCount
    const hasNextPage = response.hasNext




    return (

        <section className='space-y-4'>

            <FilterSelection
                id="calls-filter"
                placeholder='Filter by'
                page={searchParams.page}
                offset={searchParams.offset}
                options={[
                    { label: 'All', value: 'all' },
                    { label: 'Archived', value: 'archived' },
                    { label: 'Not Archived', value: 'unarchived' },

                ]}
            />

            <CallsTable
                calls={calls}
            />

            <CustomPagination
                page={page.toString()}
                offset={offset.toString()}
                total={totalRecords}
                hasNextPage={hasNextPage}
                filter={filter}

            />
        </section>
    )
}

export default CallsPage