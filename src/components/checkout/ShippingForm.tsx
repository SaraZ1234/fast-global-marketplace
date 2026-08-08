"use client";

import FormField from "./FormField";
import { COUNTRIES } from "@/lib/checkoutData";

export interface ShippingValues {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ShippingFormProps {
  values: ShippingValues;
  errors: Partial<Record<keyof ShippingValues, string>>;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
}

export default function ShippingForm({
  values,
  errors,
  onChange,
  onBlur,
}: ShippingFormProps) {
  return (
    <div className="border border-line bg-paper p-6 sm:p-7 md:p-8">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
        Shipping Information
      </h2>
      <p className="mt-1.5 text-sm text-ash">
        Tell us where this order should go. Fields marked with * are required.
      </p>

      <div className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <FormField
          label="Full Name"
          name="fullName"
          value={values.fullName}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.fullName}
          required
          placeholder="Jane Cooper"
          autoComplete="name"
        />
        <FormField
          label="Company"
          name="company"
          value={values.company}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.company}
          placeholder="Cooper Trading Co."
          autoComplete="organization"
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.email}
          required
          placeholder="jane@company.com"
          autoComplete="email"
        />
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.phone}
          required
          placeholder="+1 555 010 2020"
          autoComplete="tel"
        />
        <FormField
          label="Street Address"
          name="address"
          value={values.address}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.address}
          required
          placeholder="400 Harbor Way, Suite 12"
          autoComplete="street-address"
          className="sm:col-span-2"
        />
        <FormField
          label="City"
          name="city"
          value={values.city}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.city}
          required
          placeholder="Rotterdam"
          autoComplete="address-level2"
        />
        <FormField
          label="Country"
          name="country"
          as="select"
          value={values.country}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.country}
          required
          placeholder="Select country"
          options={COUNTRIES}
          autoComplete="country"
        />
        <FormField
          label="Postal Code"
          name="postalCode"
          value={values.postalCode}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.postalCode}
          required
          placeholder="3011 AD"
          autoComplete="postal-code"
          className="sm:col-span-2 sm:max-w-xs"
        />
      </div>
    </div>
  );
}