import { ShopLinks } from "../shop-links";
import { Collection } from "@/lib/shopify/types";

interface HomeSidebarProps {
  collections: Collection[];
}

export function HomeSidebar({ collections }: HomeSidebarProps) {
  return (
    <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
      <div>
        <p className="italic tracking-tighter text-base">
          Proslavite najljepše trenutke sa stilom.
        </p>

        <div className="mt-5 text-base leading-tight">
          <p>Pozivnice koje povezuju ljude.</p>
          <p>Personalizirane, elegantne i jednostavne za dijeljenje.</p>
          <p>Jer svaki poseban trenutak zaslužuje prekrasan početak.</p>
        </div>
      </div>

      <ShopLinks collections={collections} />
    </aside>
  );
}
