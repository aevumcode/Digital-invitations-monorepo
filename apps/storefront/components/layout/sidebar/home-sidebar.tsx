import { ShopLinks } from "../shop-links";
import { Collection } from "@/lib/shopify/types";

interface HomeSidebarProps {
  collections: Collection[];
}

export function HomeSidebar({ collections }: HomeSidebarProps) {
  return (
    <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
      <div>
        <p className="italic tracking-tighter text-base">Celebrate life’s moments with style.</p>
        <div className="mt-5 text-base leading-tight">
          <p>Invitations designed to bring people closer.</p>
          <p>Personal, elegant, and easy to share.</p>
          <p>Because every occasion deserves a beautiful beginning.</p>
        </div>
      </div>
      <ShopLinks collections={collections} />
    </aside>
  );
}
