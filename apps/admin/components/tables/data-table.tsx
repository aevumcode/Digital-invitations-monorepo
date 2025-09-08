// "use client";

// import * as React from "react";
// import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
// } from "@tabler/icons-react";

// import { FormDialog } from "@/components/form-dialog";
// import { InviteeForm, InviteeFormHandle } from "@/components/forms/invitee-form";
// import { DialogMode } from "@/types/_dialog-mode";
// import type { Invitee, CreateInviteeDto, RSVPFilter, GenderFilter } from "@/types/_invitee";
// import initialInvitee from "@/constants/initial-invitee";
// import debounce from "lodash/debounce";

// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import FilterInviteeForm from "@/components/forms/firter-invitee-form";
// import { inviteeColumns } from "./columns";

// // server actions
// import { createInviteeAction } from "@/data-access/invitees/create-invitee";
// import { getInvitees } from "@/data-access/invitees/get-invitee";

// type InviteesResponse = Awaited<ReturnType<typeof getInvitees>>;

// export function GuestTable({
//   projectId,
//   initialData,
// }: {
//   projectId: string;
//   initialData: InviteesResponse;
// }) {
//   const [isDialogOpen, setDialogOpen] = React.useState(false);
//   const formRef = React.useRef<InviteeFormHandle>(null);

//   // Filters
//   const [isFilterOpen, setFilterOpen] = React.useState(false);
//   const [filterStatus, setFilterStatus] = React.useState<RSVPFilter>("ANY");
//   const [filterGender, setFilterGender] = React.useState<GenderFilter>("ANY");
//   const [pendingStatus, setPendingStatus] = React.useState<RSVPFilter>("ANY");
//   const [pendingGender, setPendingGender] = React.useState<GenderFilter>("ANY");

//   // Search & pagination
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [debounced, setDebounced] = React.useState("");
//   const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

//   // Data state (hydrate with initialData)
//   const [invitees, setInvitees] = React.useState<Invitee[]>(() =>
//     initialData.items.map((item) => ({
//       ...item,
//       createdAt: item.createdAt.toString(),
//       updatedAt: item.updatedAt.toString(),
//     })),
//   );
//   const [pageCount, setPageCount] = React.useState(initialData.pageCount);
//   const [isLoading, setIsLoading] = React.useState(false);

//   // sync pending filters on modal open
//   React.useEffect(() => {
//     if (isFilterOpen) {
//       setPendingStatus(filterStatus);
//       setPendingGender(filterGender);
//     }
//   }, [isFilterOpen, filterStatus, filterGender]);

//   // debounce search input
//   React.useEffect(() => {
//     const handler = debounce(() => setDebounced(searchQuery), 400);
//     handler();
//     return () => handler.cancel();
//   }, [searchQuery]);

//   // reset to first page when search changes
//   React.useEffect(() => {
//     setPagination((p) => ({ ...p, pageIndex: 0 }));
//   }, [debounced]);

//   // fetch invitees on client
//   React.useEffect(() => {
//     async function loadData() {
//       setIsLoading(true);
//       try {
//         const result = await getInvitees({
//           projectId,
//           q: debounced,
//           page: pagination.pageIndex + 1,
//           pageSize: pagination.pageSize,
//           status: filterStatus,
//           gender: filterGender,
//         });
//         setInvitees(
//           result.items.map((item) => ({
//             ...item,
//             createdAt: item.createdAt.toString(),
//             updatedAt: item.updatedAt.toString(),
//           })),
//         );
//         setPageCount(result.pageCount);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, [projectId, debounced, pagination, filterStatus, filterGender]);

//   async function handleCreateInvitee(invitee: CreateInviteeDto) {
//     const newInvitee = await createInviteeAction({
//       ...invitee,
//       projectId,
//       email: invitee.email ?? undefined,
//       phone: invitee.phone ?? undefined,
//       tag: invitee.tag ?? undefined,
//     });
//     setInvitees((prev) => [
//       {
//         ...newInvitee,
//         createdAt: newInvitee.createdAt.toString(),
//         updatedAt: newInvitee.updatedAt.toString(),
//       },
//       ...prev,
//     ]);
//     setDialogOpen(false);
//   }

//   function handleFiltersSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setFilterStatus(pendingStatus);
//     setFilterGender(pendingGender);
//     setPagination((p) => ({ ...p, pageIndex: 0 }));
//     setFilterOpen(false);
//   }

//   const table = useReactTable({
//     data: invitees,
//     columns: inviteeColumns,
//     state: { pagination },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     manualPagination: true,
//     pageCount,
//     getRowId: (row) => row.id,
//   });

//   return (
//     <div className="flex h-full flex-col space-y-4">
//       {/* Add new guest button */}
//       <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="w-full sm:max-w-xs">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search guests..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Filters modal (Hello world for now) */}
//           <FormDialog
//             title="Filters"
//             trigger={<Button variant="outline">Filters</Button>}
//             isOpen={isFilterOpen}
//             setIsOpen={setFilterOpen}
//             onSubmit={handleFiltersSubmit}
//             mode={DialogMode.PREVIEW}
//           >
//             <FilterInviteeForm
//               status={pendingStatus}
//               gender={pendingGender}
//               onChangeStatus={setPendingStatus}
//               onChangeGender={setPendingGender}
//               onClear={() => {
//                 setPendingStatus("ANY");
//                 setPendingGender("ANY");
//               }}
//             />
//           </FormDialog>

//           {/* Add guest dialog */}
//           <FormDialog
//             title="Dodaj gosta"
//             trigger={<Button variant="default">+ Add Guest</Button>}
//             isOpen={isDialogOpen}
//             setIsOpen={setDialogOpen}
//             onSubmit={(e) => {
//               e.preventDefault();
//               formRef.current?.submitForm();
//             }}
//           >
//             <InviteeForm
//               ref={formRef}
//               defaultValues={initialInvitee}
//               mode={DialogMode.ADD}
//               onSubmit={(payload) => handleCreateInvitee({ ...payload, projectId })}
//             />
//           </FormDialog>
//         </div>
//       </div>

//       {/* Table container with fixed/available height → rows area scrolls */}
//       <div className="flex min-h-[360px] flex-1">
//         <div className="relative flex w-full flex-col rounded-md border">
//           {/* Scroll area */}
//           <div className="flex-1 overflow-auto">
//             <Table>
//               {/* Sticky header like your example */}
//               <TableHeader className="sticky top-0 z-10 bg-background">
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={`hg-${hg.id}`}>
//                     {hg.headers.map((header) => (
//                       <TableHead key={`h-${header.id}`}>
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>

//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={inviteeColumns.length} className="text-center">
//                       Loading...
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={`row-${row.id}`}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={`cell-${row.id}-${cell.column.id}`}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={inviteeColumns.length}
//                       className="py-2 text-center md:py-10"
//                     >
//                       No guests yet.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination bar pinned under the scroll area */}
//           <div className="flex items-center justify-between gap-4 border-t px-2 py-2 md:px-4">
//             {/* Rows-per-page (hidden on small screens) */}
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Rows per page
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => table.setPageSize(Number(value))}
//               >
//                 <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                   <SelectValue placeholder={table.getState().pagination.pageSize} />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Page indicator */}
//             <div className="flex w-full items-center justify-center text-sm font-medium lg:w-auto">
//               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
//             </div>

//             {/* Nav buttons */}
//             <div className="ml-auto flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Go to first page"
//               >
//                 <IconChevronsLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-8 w-8 p-0"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//                 aria-label="Go to previous page"
//               >
//                 <IconChevronLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-8 w-8 p-0"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Go to next page"
//               >
//                 <IconChevronRight />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//                 aria-label="Go to last page"
//               >
//                 <IconChevronsRight />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
