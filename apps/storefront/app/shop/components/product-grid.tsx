export const ProductGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2 md:gap-1">
      {children}
    </div>
  );
};
