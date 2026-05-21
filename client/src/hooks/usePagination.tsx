import { useMemo } from "react";

const usePagination = <T,>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.max(
    1,
    Math.ceil(data.length / itemsPerPage)
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return {
    totalPages,
    paginatedData,
  };
};

export default usePagination;