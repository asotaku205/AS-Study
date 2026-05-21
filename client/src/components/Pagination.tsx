import Pagination from "@mui/material/Pagination";

type AppPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const AppPagination = ({
  page,
  totalPages,
  onChange,
}: AppPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end p-4 border-t border-slate-200 dark:border-slate-800">
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onChange(value)}
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "var(--muted-foreground)",
            borderRadius: "12px",
            fontWeight: 600,
          },

          "& .Mui-selected": {
            backgroundColor: "var(--primary) !important",
            color: "var(--primary-foreground)",
          },

          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "var(--accent)",
          },
        }}
      />
    </div>
  );
};

export default AppPagination;