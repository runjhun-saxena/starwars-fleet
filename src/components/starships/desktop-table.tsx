'use client'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { motion } from 'framer-motion'
import type { Table as ReactTable } from '@tanstack/react-table'
import type { Starship } from '@/lib/swapi'
import { flexRender } from '@tanstack/react-table'
import { renderHeaderCell } from './columns'

type Props = {
  table: ReactTable<Starship>
}
export function DesktopTable({ table }: Props) {
  const rows = table.getRowModel().rows
  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>{renderHeaderCell(header)}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <motion.tr
                key={row.id}
                layout="position"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === 'crew'
                        ? 'text-right'
                        : cell.column.id === 'hyperdrive'
                        ? 'text-center'
                        : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No starships found matching your criteria
        </div>
      )}
    </div>
  )
}
