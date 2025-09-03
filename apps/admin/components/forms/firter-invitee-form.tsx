"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { RSVPFilter, GenderFilter } from "@/types/_invitee";

interface FilterInviteeFormProps {
  status: RSVPFilter;
  gender: GenderFilter;
  onChangeStatus: (val: RSVPFilter) => void;
  onChangeGender: (val: GenderFilter) => void;
  onClear?: () => void;
}

const FilterInviteeForm: React.FC<FilterInviteeFormProps> = ({
  status,
  gender,
  onChangeStatus,
  onChangeGender,
  onClear,
}) => {
  return (
    <div className="space-y-4 p-4">
      {/* RSVP Status */}
      <div className="space-y-2">
        <Label htmlFor="status">RSVP Status</Label>
        <Select
          value={status ?? "ANY"}
          onValueChange={(val) => onChangeStatus(val as RSVPFilter)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={gender ?? "ANY"}
          onValueChange={(val) => onChangeGender(val as GenderFilter)}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Any gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any</SelectItem>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {onClear && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterInviteeForm;
