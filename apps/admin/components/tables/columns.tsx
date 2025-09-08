"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Invitee } from "@/types/_invitee";
import { deleteInviteeAction } from "@/data-access/invitees/delete-invitee";

function ActionsCell({ invitee, onDelete }: { invitee: Invitee; onDelete: (id: string) => void }) {
  const handleDelete = async () => {
    if (!confirm(`Delete invitee ${invitee.email || invitee.firstName}?`)) return;
    try {
      await deleteInviteeAction(invitee.id);
      onDelete(invitee.id); // ✅ remove from UI immediately
    } catch (err) {
      console.error(err);
      alert("Failed to delete invitee");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground">
          <IconDotsVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => alert(`Edit ${invitee.email}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 👇 inviteeColumns is now a function that takes onDelete
export const inviteeColumns = (onDelete: (id: string) => void): ColumnDef<Invitee>[] => [
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
    cell: ({ row }) => <ActionsCell invitee={row.original} onDelete={onDelete} />,
  },
];
