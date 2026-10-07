"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, UploadCloud } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";
import { apiRequest } from "@/lib/api";
import {
  Marketplace,
  ProductCondition,
  SellerProduct,
} from "@/lib/sellerTypes";
import ImageUploader from "./ImageUploader";

const MARKETPLACES: {
  value: Marketplace;
  label: string;
}[] = [
    {
      value: "INTERNATIONAL",
      label: "International Marketplace",
    },
    {
      value: "PAKISTAN",
      label: "Pakistan Marketplace",
    },
    {
      value: "GULF",
      label: "Gulf Marketplace",
    },
    {
      value: "CHINESE",
      label: "Chinese Marketplace",
    },
  ];

const CONDITIONS: {
  value: ProductCondition;
  label: string;
}[] = [
    {
      value: "new",
      label: "New",
    },
    {
      value: "used-like-new",
      label: "Used — Like New",
    },
    {
      value: "used-good",
      label: "Used — Good",
    },
    {
      value: "refurbished",
      label: "Refurbished",
    },
  ];

type BackendSubCategory = {
  id: number;
  name: string;
  description?: string | null;
  categoryId: number;
};

type BackendCategory = {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  subCategories: BackendSubCategory[];
};

interface ProductFormProps {
  existingProduct?: SellerProduct;
}

export default function ProductForm({
  existingProduct,
}: ProductFormProps) {
  const router = useRouter();

  const { pushToast } = useSellerStore();

  const isEditing = Boolean(existingProduct);

  // --------------------------------------------------
  // PRODUCT FIELDS
  // --------------------------------------------------

  const [title, setTitle] = useState(
    existingProduct?.title || ""
  );

  const [description, setDescription] = useState(
    existingProduct?.description || ""
  );

  const [price, setPrice] = useState(
    existingProduct?.price?.toString() || ""
  );

  const [currency, setCurrency] = useState(
    existingProduct?.currency || "USD"
  );

  const [condition, setCondition] =
    useState<ProductCondition>(
      existingProduct?.condition || "used-good"
    );

  const [location, setLocation] = useState(
    existingProduct?.location || ""
  );

  const [marketplace, setMarketplace] =
    useState<Marketplace>(
      existingProduct?.marketplace || "PAKISTAN"
    );

  const [images, setImages] = useState<string[]>(
    existingProduct?.images || []
  );

  // --------------------------------------------------
  // BACKEND CATEGORIES
  // --------------------------------------------------

  const [categories, setCategories] =
    useState<BackendCategory[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoryId, setCategoryId] = useState(
    existingProduct?.categoryId || ""
  );

  const [subcategoryId, setSubcategoryId] =
    useState(
      existingProduct?.subcategoryId || ""
    );

  const [isCreatingCategory, setIsCreatingCategory] =
    useState(false);

  const [customCategoryName, setCustomCategoryName] =
    useState("");

  const [creatingCategory, setCreatingCategory] =
    useState(false);

  const [isCreatingSubcategory, setIsCreatingSubcategory] =
    useState(false);

  const [customSubcategoryName, setCustomSubcategoryName] =
    useState("");

  const [creatingSubcategory, setCreatingSubcategory] =
    useState(false);

  // --------------------------------------------------
  // SUBMIT STATE
  // --------------------------------------------------

  const [submitting, setSubmitting] =
    useState<
      "draft" | "publish" | null
    >(null);

  // --------------------------------------------------
  // LOAD REAL CATEGORIES
  // --------------------------------------------------

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const data = await apiRequest(
          `/category?marketplace=${marketplace.toUpperCase()}`
        );

        console.log(
          "REAL CATEGORIES:",
          data
        );

        setCategories(data);

        const existingCategory = data.find(
          (category: BackendCategory) =>
            String(category.id) === String(existingProduct?.categoryId)
        );

        if (existingCategory) {
          setCategoryId(String(existingCategory.id));
        } else if (data.length > 0) {
          setCategoryId(String(data[0].id));
        } else {
          setCategoryId("");
        }
      } catch (error) {
        console.error(
          "FAILED TO LOAD CATEGORIES:",
          error
        );

        pushToast(
          "error",
          "Failed to load categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, [marketplace, existingProduct, pushToast]);

  // --------------------------------------------------
  // GET SUBCATEGORIES
  // --------------------------------------------------

  const subcategories = useMemo(() => {
    const selectedCategory =
      categories.find(
        (category) =>
          String(category.id) ===
          categoryId
      );

    return (
      selectedCategory?.subCategories || []
    );
  }, [categories, categoryId]);

  // --------------------------------------------------
  // SET SUBCATEGORY
  // --------------------------------------------------

  useEffect(() => {
    if (!subcategories.length) {
      setSubcategoryId("");
      return;
    }

    if (existingProduct?.subcategoryId) {
      const exists =
        subcategories.some(
          (subcategory) =>
            String(subcategory.id) ===
            existingProduct.subcategoryId
        );

      if (exists) {
        setSubcategoryId(
          existingProduct.subcategoryId
        );
        return;
      }
    }

    setSubcategoryId(
      String(subcategories[0].id)
    );
  }, [
    subcategories,
    existingProduct,
  ]);

  // --------------------------------------------------
  // FORM VALIDATION
  // --------------------------------------------------

  const isValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    price.trim().length > 0 &&
    Number(price) > 0 &&
    images.length > 0 &&
    categoryId.trim().length > 0 &&
    subcategoryId.trim().length > 0;

  // --------------------------------------------------
  // CREATE CUSTOM CATEGORY
  // --------------------------------------------------

  const handleCreateCategory = async () => {
    const name = customCategoryName.trim();

    if (!name) return;

    setCreatingCategory(true);

    try {
      const created = await apiRequest(
        "/category",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            marketplace,
            isCustom: true,
          }),
        }
      );

      const newCategory: BackendCategory = {
        ...created,
        subCategories:
          created.subCategories ?? [],
      };

      setCategories((prev) => [
        ...prev,
        newCategory,
      ]);

      setCategoryId(String(newCategory.id));
      setSubcategoryId("");
      setCustomCategoryName("");
      setIsCreatingCategory(false);

      pushToast(
        "success",
        "Custom category created successfully."
      );
    } catch (error) {
      console.error(
        "FAILED TO CREATE CATEGORY:",
        error
      );

      pushToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create category."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateSubcategory = async () => {
    const name = customSubcategoryName.trim();

    if (!name || !categoryId) return;

    setCreatingSubcategory(true);

    try {
      const created = await apiRequest(
        "/subcategories",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            categoryId: Number(categoryId),
          }),
        }
      );

      setCategories((prev) =>
        prev.map((category) =>
          String(category.id) === String(categoryId)
            ? {
              ...category,
              subCategories: [
                ...category.subCategories,
                created,
              ],
            }
            : category
        )
      );

      setSubcategoryId(String(created.id));
      setCustomSubcategoryName("");
      setIsCreatingSubcategory(false);

      pushToast(
        "success",
        "Custom subcategory created successfully."
      );
    } catch (error) {
      console.error(
        "FAILED TO CREATE SUBCATEGORY:",
        error
      );

      pushToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create subcategory."
      );
    } finally {
      setCreatingSubcategory(false);
    }
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (
    status: "draft" | "active"
  ) => {
    console.log(
      "BUTTON CLICKED:",
      status
    );

    if (!isValid) {
      console.log(
        "FORM IS NOT VALID:",
        {
          title,
          description,
          price,
          categoryId,
          subcategoryId,
          imagesCount:
            images.length,
        }
      );

      pushToast(
        "error",
        "Fill in the title, description, price, category, subcategory and at least one image."
      );

      return;
    }

    const numericCategoryId =
      Number(categoryId);

    const numericSubCategoryId =
      Number(subcategoryId);

    // --------------------------------------------------
    // VALIDATE CATEGORY ID
    // --------------------------------------------------

    if (
      !Number.isInteger(
        numericCategoryId
      )
    ) {
      console.log(
        "INVALID CATEGORY ID:",
        categoryId
      );

      pushToast(
        "error",
        "Please select a valid category."
      );

      return;
    }

    // --------------------------------------------------
    // VALIDATE SUBCATEGORY ID
    // --------------------------------------------------

    if (
      !Number.isInteger(
        numericSubCategoryId
      )
    ) {
      console.log(
        "INVALID SUBCATEGORY ID:",
        subcategoryId
      );

      pushToast(
        "error",
        "Please select a valid subcategory."
      );

      return;
    }

    setSubmitting(
      status === "draft"
        ? "draft"
        : "publish"
    );

    try {
      // ==================================================
      // EDIT EXISTING PRODUCT
      // ==================================================

      if (
        isEditing &&
        existingProduct
      ) {
        const updatePayload = {
          name: title.trim(),
          description: description.trim(),
          price: Number(price),
          currency,
          stock: 1,
          image: images[0],
          categoryId: numericCategoryId,
          subCategoryId: numericSubCategoryId,
          marketplace,
        };

        console.log(
          "UPDATING PRODUCT:",
          existingProduct.id,
          updatePayload
        );

        const updated =
          await apiRequest(
            `/product/${existingProduct.id}`,
            {
              method: "PATCH",
              body: JSON.stringify(
                updatePayload
              ),
            }
          );

        console.log(
          "PRODUCT UPDATED:",
          updated
        );

        pushToast(
          "success",
          status === "draft"
            ? "Product updated successfully."
            : "Listing updated successfully."
        );

        router.push(
          "/seller/products"
        );

        return;
      }

      // ==================================================
      // CREATE NEW PRODUCT
      // ==================================================

      const payload = {
        name: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency,
        stock: 1,
        image: images[0],
        categoryId: numericCategoryId,
        subCategoryId: numericSubCategoryId,
        marketplace,
      };

      console.log(
        "CREATING PRODUCT:",
        payload
      );

      const created =
        await apiRequest(
          "/product",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );

      console.log(
        "PRODUCT CREATED:",
        created
      );

      pushToast(
        "success",
        status === "draft"
          ? "Product saved successfully."
          : "Product submitted successfully."
      );

      router.push(
        "/seller/products"
      );
    } catch (error) {
      console.error(
        "PRODUCT SAVE ERROR:",
        error
      );

      pushToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to save product."
      );
    } finally {
      setSubmitting(null);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">

        {/* IMAGES */}
        <section className="border border-line bg-paper p-5">
          <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <UploadCloud size={16} />
            Product Images
          </h2>

          <ImageUploader
            images={images}
            onChange={setImages}
          />
        </section>

        {/* PRODUCT DETAILS */}
        <section className="border border-line bg-paper p-5 space-y-4">

          <h2 className="font-display font-semibold text-base">
            Product Details
          </h2>

          {/* TITLE */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="e.g. Used iPhone 13 Pro — Excellent Condition"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Describe the item's condition, specs, and anything a buyer should know."
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink resize-none"
            />
          </div>

          {/* PRICE + CONDITION */}
          <div className="grid grid-cols-2 gap-4">

            {/* PRICE */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Price
              </label>

              <div className="flex mt-1.5">

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                  className="px-2 py-2.5 bg-bone border border-line border-r-0 text-sm focus:outline-none focus:border-ink"
                >
                  <option value="USD">
                    USD
                  </option>

                  <option value="PKR">
                    PKR
                  </option>

                  <option value="AED">
                    AED
                  </option>
                </select>

                <input
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      )
                    )
                  }
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* CONDITION */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Condition
              </label>

              <select
                value={condition}
                onChange={(e) =>
                  setCondition(
                    e.target.value as ProductCondition
                  )
                }
                className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
              >
                {CONDITIONS.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          {/* LOCATION */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Location
            </label>

            <input
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="City, Country"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
            />
          </div>

        </section>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">

        {/* PLACEMENT */}
        <section className="border border-line bg-paper p-5">

          <h2 className="font-display font-semibold text-base mb-4">
            Placement
          </h2>

          {/* MARKETPLACE */}
          <div className="mb-4">
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Marketplace
            </label>

            <select
              value={marketplace}
              onChange={(e) =>
                setMarketplace(
                  e.target.value as Marketplace
                )
              }
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
            >
              {MARKETPLACES.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* CATEGORY */}
          <div className="mb-4">
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(
                  e.target.value
                );

                setSubcategoryId("");
              }}
              disabled={
                categoriesLoading ||
                categories.length === 0
              }
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-50"
            >
              {categoriesLoading ? (
                <option value="">
                  Loading categories...
                </option>
              ) : categories.length ===
                0 ? (
                <option value="">
                  No categories available
                </option>
              ) : (
                categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )
              )}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCreatingCategory(true);
              setCustomCategoryName("");
            }}
            className="w-full mt-2 py-2.5 border border-line bg-bone text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors"
          >
            + Add Custom Category
          </button>

          {isCreatingCategory && (
            <div className="mt-3 space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Custom Category Name
              </label>

              <input
                value={customCategoryName}
                onChange={(e) =>
                  setCustomCategoryName(e.target.value)
                }
                placeholder="e.g. Gaming Accessories"
                className="w-full px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
              />

              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={
                  !customCategoryName.trim() ||
                  creatingCategory
                }
                className="w-full py-2.5 bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ash transition-colors disabled:opacity-50"
              >
                {creatingCategory
                  ? "Creating..."
                  : "Create Category"}
              </button>
            </div>
          )}

          {/* SUBCATEGORY */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Subcategory
            </label>

            <select
              value={subcategoryId}
              onChange={(e) =>
                setSubcategoryId(
                  e.target.value
                )
              }
              disabled={
                categoriesLoading ||
                subcategories.length === 0
              }
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-50"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading subcategories..."
                  : subcategories.length ===
                    0
                    ? "No subcategories available"
                    : "Select subcategory"}
              </option>

              {subcategories.map(
                (subcategory) => (
                  <option
                    key={subcategory.id}
                    value={subcategory.id}
                  >
                    {subcategory.name}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={() => {
                setIsCreatingSubcategory(true);
                setCustomSubcategoryName("");
              }}
              disabled={!categoryId}
              className="w-full mt-2 py-2.5 border border-line bg-bone text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors disabled:opacity-50"
            >
              + Add Custom Subcategory
            </button>

            {isCreatingSubcategory && (
              <div className="mt-3 space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-ash">
                  Custom Subcategory Name
                </label>

                <input
                  value={customSubcategoryName}
                  onChange={(e) =>
                    setCustomSubcategoryName(e.target.value)
                  }
                  placeholder="e.g. Gaming Keyboards"
                  className="w-full px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
                />

                <button
                  type="button"
                  onClick={handleCreateSubcategory}
                  disabled={
                    !customSubcategoryName.trim() ||
                    creatingSubcategory ||
                    !categoryId
                  }
                  className="w-full py-2.5 bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ash transition-colors disabled:opacity-50"
                >
                  {creatingSubcategory
                    ? "Creating..."
                    : "Create Subcategory"}
                </button>
              </div>
            )}
          </div>

        </section>

        {/* ACTIONS */}
        <section className="border border-line bg-paper p-5 space-y-3">

          <button
            type="button"
            onClick={() =>
              handleSubmit("active")
            }
            disabled={
              submitting !== null ||
              categoriesLoading
            }
            className="w-full py-3 bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ash transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={14} />

            {submitting === "publish"
              ? "Publishing..."
              : isEditing
                ? "Update & Publish"
                : "Publish Product"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleSubmit("draft")
            }
            disabled={
              submitting !== null ||
              categoriesLoading
            }
            className="w-full py-3 bg-bone border border-line text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors disabled:opacity-50"
          >
            {submitting === "draft"
              ? "Saving..."
              : "Save as Draft"}
          </button>

        </section>

      </div>
    </div>
  );
}