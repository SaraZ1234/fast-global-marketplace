"use client";

import { useMemo, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/UI";
import ShippingForm, { ShippingValues } from "@/components/checkout/ShippingForm";
import PaymentMethodSelector, {
  PaymentMethodId,
} from "@/components/checkout/PaymentMethodSelector";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { OrderItem } from "@/components/checkout/OrderSummaryItem";


import { getStoredUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
// UI-only seed data. Replace with the real cart contents from context / API.
// const ORDER_ITEMS: OrderItem[] = [
//   {
//     id: "itm-001",
//     name: "CNC Vertical Machining Center, 3-Axis, 800x400mm Table",
//     image:
//       "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=200&h=200&fit=crop",
//     supplier: "Hansen Precision Tools Co.",
//     unitPrice: 18500,
//     quantity: 1,
//   },
//   {
//     id: "itm-002",
//     name: "Disposable Nitrile Examination Gloves, Powder-Free, Box of 100",
//     image:
//       "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=200&h=200&fit=crop",
//     supplier: "MedLine Global Supplies",
//     unitPrice: 4.2,
//     quantity: 1000,
//   },
//   {
//     id: "itm-003",
//     name: "Wireless Bluetooth Earbuds with Charging Case, OEM",
//     image:
//       "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
//     supplier: "Shenzhen Ace Electronics Ltd.",
//     unitPrice: 6.8,
//     quantity: 500,
//   },
// ];

const TAX_RATE = 0.075;
const FREE_SHIPPING_THRESHOLD = 500;
const FLAT_SHIPPING = 45;

const EMPTY_VALUES: ShippingValues = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
};

type Errors = Partial<Record<keyof ShippingValues, string>>;

function validateField(name: keyof ShippingValues, value: string): string {
  const required = ["fullName", "email", "phone", "address", "city", "country", "postalCode"];

  if (required.includes(name) && !value.trim()) {
    return "This field is required.";
  }
  if (name === "email" && value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) return "Enter a valid email address.";
  }
  if (name === "phone" && value.trim()) {
    const phonePattern = /^[+()0-9\s-]{7,}$/;
    if (!phonePattern.test(value.trim())) return "Enter a valid phone number.";
  }
  return "";
}

export default function CheckoutPage() {

  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState<ShippingValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [paymentError, setPaymentError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const user = getStoredUser();

        if (!user) {
          router.push("/login?redirect=/checkout");
          return;
        }

        const response = await apiRequest(`/cart/${user.id}`);
        console.log("CHECKOUT CART:", response);

        const formattedItems: OrderItem[] =
          response.items?.map((item: any) => ({
            id: String(item.id),
            name: item.product.name,

            image:
              item.product.image ||
              "https://picsum.photos/200",

            supplier:
              item.product.vendor?.companyName ||
              "Unknown Supplier",

            unitPrice:
              Number(item.product.price) || 0,

            quantity:
              item.quantity,
          })) || [];

        setItems(formattedItems);

      } catch (error) {
        console.error("Checkout cart failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0
      ),
    [items]
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // clear the error as soon as the person starts fixing it
    if (errors[name as keyof ShippingValues]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: string) => {
    const key = name as keyof ShippingValues;
    const message = validateField(key, values[key]);
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handlePlaceOrder = async () => {
    const nextErrors: Errors = {};
    (Object.keys(values) as (keyof ShippingValues)[]).forEach((key) => {
      const message = validateField(key, values[key]);
      if (message) nextErrors[key] = message;
    });

    const hasPaymentError = !paymentMethod;
    setPaymentError(hasPaymentError ? "Choose a payment method to continue." : "");
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || hasPaymentError) {
      // move focus to the first field that needs attention
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {

      const user = getStoredUser();

      if (!user) {
        router.push("/login?redirect=/checkout");
        return;
      }


      const response = await apiRequest("/order/checkout", {
        method: "POST",
        body: JSON.stringify({

          userId: user.id,

          paymentMethod: paymentMethod,

        }),
      });


      console.log(
        "ORDER CREATED:",
        response
      );


      setOrderId(
        String(response.order.id)
      );


    }
    catch (error) {

      console.error(
        "ORDER FAILED:",
        error
      );

    }
    finally {

      setIsSubmitting(false);

    }

  };

  return (
    <div className="bg-bone min-h-screen">
      <section className="bg-paper border-b border-line">
        <div className="container-x py-10 sm:py-14 md:py-16">
          <Reveal>
            <Eyebrow>Secure Checkout</Eyebrow>
            <h1 className="mt-4 font-display font-bold leading-[0.95] tracking-tightest text-[clamp(2rem,7vw,3rem)] sm:text-5xl">
              Checkout
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="container-x py-10 sm:py-14 md:py-16">
        {isLoading ? (
          <div className="p-10 text-center">
            Loading checkout...
          </div>
        ) : orderId ? (
          <OrderConfirmation orderId={orderId} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-8 space-y-8 sm:space-y-10">
              <Reveal>
                <ShippingForm
                  values={values}
                  errors={errors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Reveal>
              <Reveal delay={0.05}>
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={(id) => {
                    setPaymentMethod(id);
                    setPaymentError("");
                  }}
                  error={paymentError}
                />
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.1}>
                <CheckoutSummary
                  items={items}
                  subtotal={subtotal}
                  shipping={shipping}
                  taxRate={TAX_RATE}
                  isSubmitting={isSubmitting}
                  onPlaceOrder={handlePlaceOrder}
                />
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
