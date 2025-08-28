'use client'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export function StarshipsLoadingSkeleton() {
  const rows = Array.from({ length: 6 })
  return (
    <div className="px-3 sm:px-6 py-3" aria-busy="true" aria-live="polite">
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {rows.map((_, i) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Skeleton className="h-3 w-24" />
              <div className="text-right">
                <Skeleton className="h-3 w-10 ml-auto" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-6 w-16 mt-1 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="text-right">Crew</TableHead>
                <TableHead className="text-center">Hyperdrive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5 rounded" /></TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Skeleton className="h-3 w-36" />
                  </TableCell>
                  <TableCell className="max-w-[320px]">
                    <Skeleton className="h-3 w-[280px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
