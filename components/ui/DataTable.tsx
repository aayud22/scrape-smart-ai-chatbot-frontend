import React from "react";
import { cn } from "@/utils/helpers";

import { Column } from "@/types/ui";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowClassName?: string;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
}

export function DataTable<T>({ 
  columns, 
  data, 
  rowClassName,
  onRowClick,
  hoverable = true
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/30 border-b border-border">
              {columns.map((column, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-6 py-3.5 text-xs font-semibold text-muted-foreground",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors group",
                    hoverable && "hover:bg-accent/20",
                    onRowClick && "cursor-pointer",
                    rowClassName
                  )}
                >
                  {columns.map((column, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={cn(
                        "px-6 py-4 text-sm",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.cellClassName
                      )}
                    >
                      {column.cell 
                        ? column.cell(item) 
                        : column.accessorKey 
                          ? (item[column.accessorKey] as React.ReactNode)
                          : null
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground text-sm font-medium">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
