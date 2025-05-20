import { ChevronLeft, ChevronRight } from "lucide-react";
interface TableFooterProps {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  pageSizeOptions?: number[];
  setPageSize: (size: number) => void;
  changePage: (index: number) => void;
  className?: string;
}
const TableFooter: React.FC<TableFooterProps> = ({
  pageSize,
  pageIndex,
  totalItems,
  setPageSize,
  changePage,
  pageSizeOptions = [5, 10, 20],
  className = "",
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    changePage(1);
  };
  return (
    <div className={`flex items-center justify-between px-2 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="bg-gray-800 border border-gray-700 rounded-md text-gray-300 text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-gray-600"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm text-gray-400">
        Showing {totalItems > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-
        {pageIndex * pageSize > totalItems ? totalItems : pageIndex * pageSize}{" "}
        of {totalItems} items
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => changePage(pageIndex - 1)}
          disabled={pageIndex === 1}
          className="p-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (pageIndex <= 3) {
              pageNum = i + 1;
            } else if (pageIndex >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = pageIndex - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => changePage(pageNum)}
                className={`h-8 w-8 rounded-md text-sm flex items-center justify-center ${
                  pageIndex === pageNum
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => changePage(pageIndex + 1)}
          disabled={pageIndex >= totalPages}
          className="p-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
export default TableFooter;
