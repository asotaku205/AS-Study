import React from "react";

const CategoryCard = ({ icon, category }: { icon: React.ReactNode; category: string }) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
    >
      {icon}
      {category}
    </button>
  );
};

export default CategoryCard;
