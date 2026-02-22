"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  searchKeys?: (keyof T)[];
}

export function GenericTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  searchKeys = [],
}: GenericTableProps<T>) {
  const [filter, setFilter] = useState("");

  const finalColumns = useMemo(() => {
    const actionCol: ColumnDef<T>[] =
      onEdit || onDelete || onView
        ? [
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                  {onView && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(row.original)}
                      className="rounded-xl h-8 w-8 p-0 border-muted-foreground/20 hover:bg-primary/5 hover:border-primary/30"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row.original)}
                      className="rounded-xl h-8 w-8 p-0 border-muted-foreground/20 hover:bg-primary/5 hover:border-primary/30"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(row.original)}
                      className="rounded-xl h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  )}
                </div>
              ),
            },
          ]
        : [];
    return [...columns, ...actionCol];
  }, [columns, onEdit, onDelete, onView]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { globalFilter: filter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      if (!searchKeys.length) return true;
      return searchKeys.some((key) =>
        String(row.original[key]).toLowerCase().includes(String(filterValue).toLowerCase())
      );
    },
  });

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}