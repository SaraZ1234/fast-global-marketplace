"use client";
import { apiRequest } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/UI";
import CartLineItem, { CartItem } from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import CartSkeleton from "@/components/cart/CartSkeleton";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";

// UI-only seed data. Replace with cart state from context / API integration.
// const SEED_ITEMS: CartItem[] = [
//   {
//     id: "itm-001",
//     name: "CNC Vertical Machining Center, 3-Axis, 800x400mm Table",
//     image:
//       "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300&h=300&fit=crop",
//     supplier: "Hansen Precision Tools Co.",
//     supplierHref: "/suppliers/hansen-precision-tools",
//     unitPrice: 18500,
//     moq: 1,
//     quantity: 1,
//   },
//   {
//     id: "itm-002",
//     name: "Disposable Nitrile Examination Gloves, Powder-Free, Box of 100",
//     image:
//       "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300&h=300&fit=crop",
//     supplier: "MedLine Global Supplies",
//     supplierHref: "/suppliers/medline-global-supplies",
//     unitPrice: 4.2,
//     moq: 500,
//     quantity: 1000,
//   },
//   {
//     id: "itm-003",
//     name: "Wireless Bluetooth Earbuds with Charging Case, OEM",
//     image:
//       "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
//     supplier: "Shenzhen Ace Electronics Ltd.",
//     supplierHref: "/suppliers/ace-electronics",
//     unitPrice: 6.8,
//     moq: 200,
//     quantity: 500,
//   },
// ];

const TAX_RATE = 0.075;
const FREE_SHIPPING_THRESHOLD = 500;
const FLAT_SHIPPING = 45;

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  // Simulates fetching the cart. Swap for real data loading.
  useEffect(() => {
    async function fetchCart() {
      try {
        const user = getStoredUser();

        console.log("CART PAGE USER:", user);

        if (!user) {
          router.push("/login");
          return;
        }

        const response = await apiRequest(`/cart/${user.id}`);

        console.log("BACKEND CART:", response);

        const backendItems = response.items || [];

        const formattedItems: CartItem[] = backendItems.map(
          (item: any) => ({
            id: String(item.id),

            name: item.product.name,

            image:
              item.product.image ||
              "https://picsum.photos/300",

            supplier:
              item.product.vendor?.companyName ||
              "Unknown Supplier",

            supplierHref:
              item.product.vendor?.id
                ? `/suppliers/${item.product.vendor.id}`
                : "#",

            unitPrice:
              Number(item.product.price) || 0,

            moq:
              Number(item.product.moq) || 1,

            quantity:
              item.quantity,
          })
        );


        setItems(formattedItems);

      } catch (error) {

        console.error(
          "Cart loading failed:",
          error
        );

      } finally {

        setIsLoading(false);

      }
    }


    fetchCart();

  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const shipping = useMemo(
    () => (items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING),
    [items.length, subtotal]
  );

  const handleQuantityChange = async (
    id: string,
    quantity: number
  ) => {
    try {
      await apiRequest(`/cart/item/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity,
        }),
      });


      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
              ...item,
              quantity,
            }
            : item
        )
      );

    } catch (error) {
      console.error(
        "Quantity update failed:",
        error
      );
    }
  };

  const handleRemove = async (id: string) => {
    try {

      await apiRequest(`/cart/item/${id}`, {
        method: "DELETE",
      });

      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (error) {

      console.error(
        "Remove cart item failed:",
        error
      );

    }
  };

  const handleCheckout = () => {

    const user = getStoredUser();

    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="bg-bone min-h-screen">
      <section className="bg-paper border-b border-line">
        <div className="container-x py-10 sm:py-14 md:py-16">
          <Reveal>
            <Eyebrow>Order Review</Eyebrow>
            <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tightest text-[clamp(2rem,7vw,3rem)] sm:text-5xl">
              Shopping Cart
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="container-x py-10 sm:py-14 md:py-16">
        {isLoading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="border border-line divide-y divide-line bg-paper">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      isRemoving={removingId === item.id}
                    />
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.1}>
                <CartSummary
                  itemCount={items.length}
                  subtotal={subtotal}
                  shipping={shipping}
                  taxRate={TAX_RATE}
                  onCheckout={handleCheckout}
                />
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}