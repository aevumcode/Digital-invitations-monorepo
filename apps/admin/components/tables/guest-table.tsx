"use client";

import * as React from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
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
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

import { FormDialog } from "@/components/form-dialog";
import { InviteeForm, InviteeFormHandle } from "@/components/forms/invitee-form";
import { DialogMode } from "@/types/_dialog-mode";
import type { Invitee, CreateInviteeDto, RSVPFilter, GenderFilter } from "@/types/_invitee";
import initialInvitee from "@/constants/initial-invitee";
import debounce from "lodash/debounce";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterInviteeForm from "@/components/forms/firter-invitee-form";
import { inviteeColumns } from "./columns";

// server actions
import { createInviteeAction } from "@/data-access/invitees/create-invitee";

// correct type for initialData
import type { getInvitees } from "@/data-access/invitees/get-invitee";
import { fetchInviteesAction } from "@/data-access/actions/invitees";
type InviteesResponse = Awaited<ReturnType<typeof getInvitees>>;

export function GuestTable({
  projectId,
  initialData,
}: {
  projectId: string;
  initialData: InviteesResponse;
}) {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const formRef = React.useRef<InviteeFormHandle>(null);

  const [isFilterOpen, setFilterOpen] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<RSVPFilter>("ANY");
  const [filterGender, setFilterGender] = React.useState<GenderFilter>("ANY");
  const [pendingStatus, setPendingStatus] = React.useState<RSVPFilter>("ANY");
  const [pendingGender, setPendingGender] = React.useState<GenderFilter>("ANY");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // hydrate from server
  const [invitees, setInvitees] = React.useState<Invitee[]>(() =>
    initialData.items.map((i) => ({
      ...i,
      createdAt: i.createdAt.toString(),
      updatedAt: i.updatedAt.toString(),
    })),
  );
  const [pageCount, setPageCount] = React.useState(initialData.pageCount);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const handler = debounce(() => setDebounced(searchQuery), 400);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debounced]);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const result = await fetchInviteesAction({
          projectId,
          q: debounced || undefined,
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          status: filterStatus !== "ANY" ? filterStatus : undefined,
          gender: filterGender !== "ANY" ? filterGender : undefined,
        });

        setInvitees(
          result.items.map((i) => ({
            ...i,
            createdAt: new Date(i.createdAt).toString(),
            updatedAt: new Date(i.updatedAt).toString(),
          })),
        );
        setPageCount(result.pageCount);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [projectId, debounced, pagination, filterStatus, filterGender]);

  async function handleCreateInvitee(invitee: CreateInviteeDto) {
    const { email, phone, tag, ...rest } = invitee;
    const newInvitee = await createInviteeAction({
      ...rest,
      projectId,
      email: email ?? undefined,
      phone: phone ?? undefined,
      tag: tag ?? undefined,
    });
    setInvitees((prev) => [
      {
        ...newInvitee,
        createdAt: newInvitee.createdAt.toString(),
        updatedAt: newInvitee.updatedAt.toString(),
      },
      ...prev,
    ]);
    setDialogOpen(false);
  }

  function handleDeleteLocal(id: string) {
    setInvitees((prev) => prev.filter((i) => i.id !== id));
  }

  function handleFiltersSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFilterStatus(pendingStatus);
    setFilterGender(pendingGender);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    setFilterOpen(false);
  }

  const table = useReactTable({
    data: invitees,
    columns: inviteeColumns(handleDeleteLocal),
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters dialog */}
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
              onSubmit={(data) => handleCreateInvitee({ ...data, projectId })}
            />
          </FormDialog>
        </div>
      </div>

      {/* Table */}
      <div className="flex min-h-[360px] flex-1">
        <div className="relative flex w-full flex-col rounded-md border">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={inviteeColumns.length} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={inviteeColumns.length}
                      className="py-2 text-center md:py-10"
                    >
                      No guests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 border-t px-2 py-2 md:px-4">
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

            <div className="flex w-full items-center justify-center text-sm font-medium lg:w-auto">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
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
