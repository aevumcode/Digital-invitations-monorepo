"use client";

import * as React from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

import { FormDialog } from "@/components/form-dialog";
import { InviteeForm, InviteeFormHandle } from "@/components/forms/invitee-form";
import { DialogMode } from "@/types/_dialog-mode";
import type { Invitee, CreateInviteeDto, RSVPFilter, GenderFilter } from "@/types/_invitee";
import { useFetchInvitees } from "@/api/useFetchInvitees";
import { useCreateInvitee } from "@/api/useCreateInvitee";
import initialInvitee from "@/constants/initial-invitee";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

// Pagination UI bits
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import FilterInviteeForm from "../forms/firter-invitee-form";

const columns: ColumnDef<Invitee>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "rsvpStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.rsvpStatus;
      const color =
        status === "ACCEPTED"
          ? "bg-green-500/20 text-green-600"
          : status === "DECLINED"
            ? "bg-red-500/20 text-red-600"
            : "bg-yellow-500/20 text-yellow-600";
      return <Badge className={color}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground">
            <IconDotsVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert(`Edit ${row.original.email}`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => alert(`Delete ${row.original.email}`)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function GuestTable({ projectId }: { projectId: string }) {
  // Dialog state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<InviteeFormHandle>(null);

  // Filters state
  const [isFilterOpen, setFilterOpen] = useState(false);
  // active filters (used for fetching)
  const [filterStatus, setFilterStatus] = useState<RSVPFilter>("ANY");
  const [filterGender, setFilterGender] = useState<GenderFilter>("ANY");

  // pending filters (only used inside the modal UI)
  const [pendingStatus, setPendingStatus] = useState<RSVPFilter>("ANY");
  const [pendingGender, setPendingGender] = useState<GenderFilter>("ANY");

  // SEARCH & PAGINATION state
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    if (isFilterOpen) {
      setPendingStatus(filterStatus);
      setPendingGender(filterGender);
    }
  }, [isFilterOpen, filterStatus, filterGender]);

  // debounce input
  useEffect(() => {
    const handler = debounce(() => setDebounced(searchQuery), 400);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  // reset page when search changes
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debounced]);

  const { data, isLoading } = useFetchInvitees(
    projectId,
    debounced,
    pagination.pageIndex,
    pagination.pageSize,
    filterStatus,
    filterGender,
  );

  const invitees = data?.items ?? [];
  const pageCount = data?.pageCount ?? 0;
  const { mutate: createInvitee } = useCreateInvitee();

  const handleCreateInvitee = (invitee: CreateInviteeDto) => {
    createInvitee({ ...invitee, projectId }, { onSuccess: () => setDialogOpen(false) });
  };

  const handleFiltersSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setFilterStatus(pendingStatus);
    setFilterGender(pendingGender);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setFilterOpen(false);
  };

  const table = useReactTable({
    data: invitees,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    getRowId: (row) => row.id,
  });
  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Add new guest button */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters modal (Hello world for now) */}
          <FormDialog
            title="Filters"
            trigger={<Button variant="outline">Filters</Button>}
            isOpen={isFilterOpen}
            setIsOpen={setFilterOpen}
            onSubmit={handleFiltersSubmit}
            mode={DialogMode.PREVIEW}
          >
            <FilterInviteeForm
              status={pendingStatus}
              gender={pendingGender}
              onChangeStatus={setPendingStatus}
              onChangeGender={setPendingGender}
              onClear={() => {
                setPendingStatus("ANY");
                setPendingGender("ANY");
              }}
            />
          </FormDialog>

          {/* Add guest dialog */}
          <FormDialog
            title="Dodaj gosta"
            trigger={<Button variant="default">+ Add Guest</Button>}
            isOpen={isDialogOpen}
            setIsOpen={setDialogOpen}
            onSubmit={(e) => {
              e.preventDefault();
              formRef.current?.submitForm();
            }}
          >
            <InviteeForm
              ref={formRef}
              defaultValues={initialInvitee}
              mode={DialogMode.ADD}
              onSubmit={(payload) => handleCreateInvitee({ ...payload, projectId })}
            />
          </FormDialog>
        </div>
      </div>

      {/* Table container with fixed/available height → rows area scrolls */}
      <div className="flex min-h-[360px] flex-1">
        <div className="relative flex w-full flex-col rounded-md border">
          {/* Scroll area */}
          <div className="flex-1 overflow-auto">
            <Table>
              {/* Sticky header like your example */}
              <TableHeader className="sticky top-0 z-10 bg-background">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={`hg-${hg.id}`}>
                    {hg.headers.map((header) => (
                      <TableHead key={`h-${header.id}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={`row-${row.id}`}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={`cell-${row.id}-${cell.column.id}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-2 text-center md:py-10">
                      No guests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination bar pinned under the scroll area */}
          <div className="flex items-center justify-between gap-4 border-t px-2 py-2 md:px-4">
            {/* Rows-per-page (hidden on small screens) */}
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page indicator */}
            <div className="flex w-full items-center justify-center text-sm font-medium lg:w-auto">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>

            {/* Nav buttons */}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to first page"
              >
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Go to previous page"
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Go to next page"
              >
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Go to last page"
              >
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
