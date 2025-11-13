/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PenIcon, PlusIcon, Search, Trash, TrashIcon } from "lucide-react";
import debounce from "lodash/debounce";

// Dialog bits (simple in-file Add Guest form)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Server actions
import {
  createGuestAction,
  updateGuestAction,
  deleteGuestAction,
} from "@/data-access/actions/guest";
import { fetchGuestsAction, fetchGuestStatsAction } from "@/data-access/actions/guest-list";
import { GuestRow, GuestStats } from "@/types/_guest";
import { ReservationLite } from "@/types/_reservation";
import { AddGuestForm, fmtDate } from "../forms/add-guest";
import { EditGuestDialog, EditGuestPayload } from "../forms/edit-guest";
import { DeleteGuestDialog } from "../forms/delete-guest";

type AttendingFilter = "ANY" | "YES" | "NO";

// ---------- Columns ----------
function buildColumns(opts: {
  onEdit: (row: GuestRow) => void;
  onDelete: (row: GuestRow) => void;
}): ColumnDef<GuestRow, any>[] {
  return [
    {
      header: () => <div className="pl-8 text-left ">Ime i prezime</div>,
      accessorKey: "firstName",
      cell: ({ row }) => (
        <div className="font-medium flex w-full justify-start pl-8">
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    {
      header: () => <div className="text-left pl-6 ">Datum rezervacije</div>,
      accessorKey: "reservationDate",
      cell: ({ getValue }) => (
        <span className=" flex w-full justify-start pl-8 ">{fmtDate(String(getValue()))}</span>
      ),
    },
    {
      header: () => <div className="text-center ">Dolazak</div>,
      accessorKey: "attending",
      cell: ({ getValue }) => {
        const v = Boolean(getValue());
        return (
          <span
            className={` w-full justify-center  inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
              v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {v ? "Da" : "Ne"}
          </span>
        );
      },
    },
    {
      header: () => <div className="text-center ">Napomena</div>,
      accessorKey: "note",
      cell: ({ getValue }) => (
        <span className="flex w-full justify-center text-muted-foreground">
          {getValue() || "—"}
        </span>
      ),
    },
    {
      header: () => <div className="text-right pr-12">Radnje</div>,
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex w-full justify-end gap-2 pr-8">
          <Button variant="outline" size="sm" onClick={() => opts.onEdit(row.original)}>
            <PenIcon className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => opts.onDelete(row.original)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

// ---------- Main Table ----------
export function GuestTable({
  userTemplateId,
  initialData,
  initialStats,
  initialReservations,
}: {
  userTemplateId: string;
  initialData: { items: GuestRow[]; pageCount: number };
  initialStats: GuestStats;
  initialReservations: ReservationLite[];
}) {
  const [rows, setRows] = React.useState<GuestRow[]>(initialData.items);
  const [pageCount, setPageCount] = React.useState<number>(initialData.pageCount);
  const [stats, setStats] = React.useState<GuestStats>(initialStats);

  const [attendingFilter, setAttendingFilter] = React.useState<AttendingFilter>("ANY");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [loading, setLoading] = React.useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = React.useState(false);
  const [pendingAdd, setPendingAdd] = React.useState(false);

  // Debounce search
  React.useEffect(() => {
    const h = debounce(() => setDebounced(searchQuery), 400);
    h();
    return () => h.cancel();
  }, [searchQuery]);

  // Reset to page 1 on new search/filter
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debounced, attendingFilter]);

  // Fetch page
  React.useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchGuestsAction({
          userTemplateId,
          q: debounced || undefined,
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          attending:
            attendingFilter === "ANY" ? undefined : attendingFilter === "YES" ? true : false,
        });
        if (!alive) return;

        setRows(result.items);
        setPageCount(result.pageCount);

        const s = await fetchGuestStatsAction({ userTemplateId });
        if (!alive) return;
        setStats(s);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userTemplateId, debounced, attendingFilter, pagination.pageIndex, pagination.pageSize]);

  // Handlers
  async function handleAddGuest(payload: {
    firstName: string;
    lastName: string;
    reservationId: number | null;
  }) {
    setPendingAdd(true);
    try {
      const res = await createGuestAction({
        userTemplateId,
        reservationId: payload.reservationId ?? undefined,
        firstName: payload.firstName,
        lastName: payload.lastName,
        // isAttending optional; defaults to true
      });
      if (!res.ok) {
        alert(res.error || "Neuspješno dodavanje gosta.");
        return;
      }
      setAddOpen(false);
      setPagination((p) => ({ ...p }));
    } finally {
      setPendingAdd(false);
    }
  }

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<GuestRow | null>(null);
  const [saving, setSaving] = React.useState(false);

  function openEdit(row: GuestRow) {
    setSelected(row);
    setEditOpen(true);
  }
  function openDelete(row: GuestRow) {
    setSelected(row);
    setDeleteOpen(true);
  }

  async function submitEdit(data: EditGuestPayload) {
    if (!selected) return;
    setSaving(true);
    const res = await updateGuestAction({ id: selected.id, ...data });
    setSaving(false);
    if (!res.ok) return alert("Neuspješno ažuriranje.");
    setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...data } : r)));
    setEditOpen(false);
    setSelected(null);
  }

  async function confirmDelete() {
    if (!selected) return;
    setSaving(true);
    const res = await deleteGuestAction({ id: selected.id });
    setSaving(false);
    if (!res.ok) return alert("Neuspješno brisanje.");
    setRows((prev) => prev.filter((r) => r.id !== selected.id));
    setDeleteOpen(false);
    setSelected(null);
  }

  const columns = React.useMemo(
    () =>
      buildColumns({
        onEdit: openEdit,
        onDelete: openDelete,
      }),
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    getRowId: (row) => String(row.id),
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Toolbar */}
      <div className="w-full space-y-2 md:space-y-3">
        {/* Row 1: Search */}
        <div className="flex w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Pretraži goste…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-10 text-sm"
            />
          </div>
        </div>

        {/* Row 2: Filter + Add */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Attending Filter */}
          <div className="flex items-center gap-2 ">
            <Label className="text-xs md:text-sm">Dolazak</Label>
            <Select
              value={attendingFilter}
              onValueChange={(v: AttendingFilter) => setAttendingFilter(v)}
            >
              <SelectTrigger className="h-9 w-[120px] text-sm md:w-[160px]">
                <SelectValue placeholder="Bilo koji" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="ANY">Bilo koji</SelectItem>
                <SelectItem value="YES">Da</SelectItem>
                <SelectItem value="NO">Ne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Guest button (icon on mobile, text on desktop) */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <div>
                {/* Mobile: icon only */}
                <Button
                  className="md:hidden h-9 w-9 p-0 bg-black hover:bg-gray-800"
                  size="icon"
                  aria-label="Dodaj gosta"
                  variant="default"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>

                {/* ≥ md: icon + label */}
                <Button
                  className="hidden md:inline-flex bg-black hover:bg-gray-800"
                  variant="default"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Dodaj gosta
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj gosta</DialogTitle>
              </DialogHeader>
              <AddGuestForm
                reservations={initialReservations}
                onSubmit={handleAddGuest}
                pending={pendingAdd}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EditGuestDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        guest={selected ? { firstName: selected.firstName, lastName: selected.lastName } : null}
        saving={saving}
        onSubmit={submitEdit}
      />

      <DeleteGuestDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        guest={selected ? { firstName: selected.firstName, lastName: selected.lastName } : null}
        saving={saving}
        onConfirm={confirmDelete}
      />

      {/* Table */}
      <div className="flex min-h-[360px] flex-1 ">
        <div className="relative flex w-full flex-col rounded-md border">
          <div className="flex-1 overflow-auto">
            <Table
              className="
    w-full md:table-fixed
  "
            >
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center pt-10">
                      Učitavanje…
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
                    <TableCell colSpan={columns.length} className="py-2 text-center md:py-10">
                      Još nema gostiju.
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
                Redaka po stranici
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-28" id="rows-per-page">
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
              Stranica {table.getState().pagination.pageIndex + 1} od {table.getPageCount() || 1}
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
