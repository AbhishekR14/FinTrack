"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionsType } from "@/app/home/types";
import { useRecoilState, useRecoilValue } from "recoil";
import { allTransactionsAtom } from "@/store/atoms/transactions";
import { getAllTransactions } from "@/app/api/transactions/actions/transactions";
import EditDeleteDropdown from "./EditDeleteDropdown";
import { loadTransactions } from "@/store/atoms/misc";
import { formatDateToString } from "@/app/home/page";

export const columns: ColumnDef<transactionsType>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="pl-4">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="pl-4 font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pl-4">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "note",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Note
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 capitalize">{row.getValue("note")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      return <EditDeleteDropdown row={row} />;
    },
  },
];

export function DetailedSummary({ user }: { user: any }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [allTransactions, setAllTransactions] =
    useRecoilState(allTransactionsAtom);
  const [loadingText, setLoadingText] = React.useState("");
  const reloadTransactions = useRecoilValue(loadTransactions);

  async function callGetAllTransactions() {
    const res = await getAllTransactions(user?.id || "");
    setLoadingText("No Transactions! Create some to see them here");
    if (res) {
      setAllTransactions(
        //@ts-ignore
        res.map((transaction: any) => {
          return { ...transaction, date: formatDateToString(transaction.date) };
        })
      );
    }
  }
  React.useEffect(() => {
    setLoadingText("Loading your data...");
    callGetAllTransactions();
  }, [reloadTransactions]);

  const table = useReactTable({
    data: allTransactions,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="w-full p-4 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 ">
      <div className="flex items-center py-4">
        <h3 className="text-xl mb-2 dark:border-cyan-50">All Transactions</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border dark:border-gray-700 ">
        <Table className="border dark:border-gray-700">
          <TableHeader className="border dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-t border-b dark:border-gray-700"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-t border-b dark:border-gray-700 hover:dark:bg-gray-700 hover:bg-gray-100"
                  data-state={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-t border-b dark:border-gray-700">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loadingText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getPageCount() > 0
            ? table.getState().pagination.pageIndex + 1
            : 0}{" "}
          - {table.getPageCount()} Page{table.getPageCount() > 1 ? "s" : ""}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
