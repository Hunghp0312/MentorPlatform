import { DataColumn } from "../table/CustomTable";

// Add the SkeletonCell component inside the DataTable component
const SkeletonCell = ({ width }: { width?: string }) => (
  <td className={`py-3 px-4 `}>
    <div
      className="h-4 animate-pulse rounded bg-gray-500"
      style={{ width: width || "100%" }}
    ></div>
  </td>
);

// Add the SkeletonRow component inside the DataTable component
const SkeletonRow = <T,>({
  selectable,
  tableColumns,
}: {
  selectable?: boolean;
  tableColumns: DataColumn<T>[];
}) => (
  <tr className={`border-b border-gray-800 `}>
    {selectable && (
      <td className="py-3 px-4 text-center w-10">
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-500"></div>
        </div>
      </td>
    )}
    {tableColumns.map((column, index) => (
      <SkeletonCell
        key={index}
        width={
          column.align === "right"
            ? "90%"
            : column.align === "center"
            ? "80%"
            : "90%"
        }
      />
    ))}
  </tr>
);

export default SkeletonRow;
