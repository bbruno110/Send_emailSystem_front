"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

const statusOptions = [
  { value: "status1", label: "Status 1" },
  { value: "status2", label: "Status 2" },
  { value: "status3", label: "Status 3" },
];

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (status: string) => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ open, onClose, onSave }) => {
  const [status, setStatus] = React.useState<string>("");

  return (
    <Popover open={open} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {status ? statusOptions.find(option => option.value === status)?.label : "Select status..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandEmpty>No status found.</CommandEmpty>
          <CommandGroup>
            {statusOptions.map(option => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setStatus(currentValue);
                  onSave(currentValue);
                  onClose();
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(status)}>
            Salvar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
