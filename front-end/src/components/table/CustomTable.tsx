/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Check } from "lucide-react";
import TableFooter from "./TableFooter";
import SkeletonRow from "../loading/SkeletonRow";

export type DataAction<T> = {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
};

export type BulkAction<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  className?: string;
};

export type DataColumn<T> = {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  align?: "left" | "center" | "right";
  width?: string;
};
export type DataTableProps<T> = {
  data: T[];
  columns: DataColumn<T>[];
  keyField: keyof T;
  caption?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  emptyMessage?: string;
  actions?: DataAction<T>[];
  bulkActions?: BulkAction<T>[];
  pagination?: boolean;
  selectable?: boolean;
  pageIndex?: number;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  setPageIndex?: (page: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  maxSelectable?: number;
  selectedRows?: T[];
  setSelectedRows?: (selectedRows: T[]) => void;
  skeletonRows?: number;
  isLoading?: boolean;
};

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField,
  caption,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  emptyMessage = "No data available",
  actions,
  bulkActions,
  pagination = false,
  selectable = false,
  pageSize = 10,
  setPageSize = () => {},
  pageIndex = 1,
  setPageIndex = () => {},
  pageSizeOptions = [5, 10, 25, 50, 100],
  totalItems = 10,
  maxSelectable,
  selectedRows = [],
  setSelectedRows = () => {},
  skeletonRows = 5,
  isLoading = false,
}: DataTableProps<T>) => {
  // Pagination state
  // Selection state

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle page change
  const changePage = (page: number) => {
    setPageIndex(Math.max(1, Math.min(page, totalPages)));
  };
  // Handle row selection
  const toggleRowSelection = (row: T) => {
    if (!selectable) return;

    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow[keyField] === row[keyField]
    );
    let updatedSelection: T[];

    if (isSelected) {
      updatedSelection = selectedRows.filter(
        (selectedRow) => selectedRow[keyField] !== row[keyField]
      );
    } else if (maxSelectable && selectedRows.length >= maxSelectable) {
      updatedSelection = selectedRows;
    } else {
      updatedSelection = [...selectedRows, row];
    }

    setSelectedRows(updatedSelection);
  };

  // Check if a row is selected
  const isRowSelected = (row: T) => {
    return selectedRows.some(
      (selectedRow) => selectedRow[keyField] === row[keyField]
    );
  };

  // Render cell content
  const renderCell = (row: T, column: DataColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as React.ReactNode;
  };

  // Get alignment class based on column configuration
  const getAlignClass = (align: DataColumn<T>["align"]) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Create columns array with actions if provided
  let tableColumns = [...columns];

  // Add actions column if actions are provided
  if (actions && actions.length > 0) {
    tableColumns = [
      ...tableColumns,
      {
        header: "Actions",
        accessor: (row: T) => (
          <div className="flex items-center justify-end space-x-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                }}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  action.className ||
                  "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors"
                }`}
              >
                {action.icon && (
                  <span className={action.label ? "mr-1" : ""}>
                    {action.icon}
                  </span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        ),
        align: "right" as const,
      },
    ];
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bulk Actions */}
      {selectable && bulkActions && selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
          <div className="text-sm text-gray-300">
            <span className="font-medium">{selectedRows.length}</span> item
            {selectedRows.length !== 1 && "s"} selected
          </div>
          <div className="flex items-center space-x-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(selectedRows)}
                className={`px-3 py-1 text-xs rounded-md flex items-center ${
                  action.className ||
                  "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 transition-colors"
                }`}
              >
                {action.icon && (
                  <span className={action.label ? "mr-1" : ""}>
                    {action.icon}
                  </span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {caption && (
            <caption className="p-2 text-sm text-gray-400 text-left caption-bottom">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="border-b border-gray-800">
              {/* Checkbox column header */}
              {selectable && <th></th>}

              {/* Column headers */}
              {tableColumns.map((column, index) => (
                <th
                  key={index}
                  className={`py-3 px-4 text-sm font-medium text-gray-300 ${getAlignClass(
                    column.align
                  )} ${headerClassName}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Render skeleton rows when loading
              Array.from({ length: skeletonRows }).map((_, index) => (
                <SkeletonRow
                  key={`skeleton-${index}`}
                  tableColumns={tableColumns}
                  selectable={selectable}
                />
              ))
            ) : data.length > 0 ? (
              data.map((row) => {
                const isSelected = isRowSelected(row);
                return (
                  <tr
                    key={String(row[keyField])}
                    onClick={() => selectable && toggleRowSelection(row)}
                    className={`border-b border-gray-800 hover:bg-gray-800/50 ${
                      isSelected ? "bg-gray-800" : ""
                    } ${rowClassName} ${selectable ? "cursor-pointer" : ""}`}
                  >
                    {/* Checkbox cell */}
                    {selectable && (
                      <td className="py-3 px-4 text-sm text-gray-300 text-center w-10">
                        <div className="flex items-center justify-center">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowSelection(row);
                            }}
                            className={`h-4 w-4 rounded border cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-gray-600 border-gray-500"
                                : "border-gray-600 hover:border-gray-500"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Data cells */}
                    {tableColumns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`py-3 px-4 text-sm text-gray-300 ${getAlignClass(
                          column.align
                        )} ${cellClassName}`}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={tableColumns.length + (selectable ? 1 : 0)}
                  className="py-6 px-4 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <TableFooter
          pageIndex={pageIndex}
          pageSize={pageSize}
          changePage={changePage}
          totalItems={totalItems}
          setPageSize={setPageSize}
          pageSizeOptions={pageSizeOptions}
        ></TableFooter>
      )}
    </div>
  );
};
export default DataTable;
