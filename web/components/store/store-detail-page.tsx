"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ChevronRight, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { storeProducts } from "@/components/site-data";
import { useDemoCartCount } from "@/components/store/demo-store";
import { StoreFooter, StoreSiteNav } from "@/components/store/store-shell";

export function StoreDetailPage({ id }: { id: string }) {
  const product = useMemo(() => storeProducts.find((item) => item.id === id), [id]);
  const { add } = useDemoCartCount();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"description" | "reviews" | "shipping">(
    "description",
  );
  const [imageIndex, setImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4a148c] via-[#6a1b9a] to-[#1a237e] text-white">
        <StoreSiteNav />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <p className="mt-4 text-white/70">请返回独立站首页重新选择商品。</p>
          <Link href="/store" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-[#1a1a1a]">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4a148c] via-[#6a1b9a] to-[#1a237e]">
      <StoreSiteNav />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center gap-2 text-sm text-purple-200">
          <Link href="/store" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/store#catalog" className="transition hover:text-white">
            Catalog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid gap-12 rounded-2xl bg-white p-8 shadow-2xl md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
              <Image
                src={product.detailImages[imageIndex]}
                alt={product.name}
                width={700}
                height={700}
                priority={imageIndex === 0}
                unoptimized
                className="h-96 w-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-2">
              {product.detailImages.map((image, index) => (
                <button
                  key={`${product.id}-${image}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    imageIndex === index ? "border-purple-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-serif text-gray-800">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: product.rating }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-[#ffd700] text-[#ffd700]" />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews})</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-4xl font-bold text-[#ffd700]">${product.price}</span>
              <span className="text-xl text-gray-400 line-through">${product.compareAt}</span>
            </div>

            <div className="mt-6 rounded-lg bg-purple-50 p-4">
              <p className="font-medium text-purple-900">Key Benefits:</p>
              <ul className="mt-2 space-y-1 text-purple-800">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700">Quantity:</label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-xl font-semibold text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                add(quantity);
                toast.success(`已加入 ${quantity} 件 ${product.name}。`);
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-4 font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toast.success("PayPal 支付入口已接好，当前为演示态。")}
              className="mt-3 w-full rounded-lg bg-[#FFC439] py-3 font-semibold text-gray-900 transition hover:bg-[#FFD766]"
            >
              PayPal
            </button>
            <button
              type="button"
              onClick={() => toast.success("Stripe 支付入口已接好，当前为演示态。")}
              className="mt-2 w-full rounded-lg bg-[#635BFF] py-3 font-semibold text-white transition hover:bg-[#7A73FF]"
            >
              Stripe
            </button>

            <div className="mt-6 space-y-2 text-gray-700">
              {["Free shipping", "Handcrafted", "Energy cleansed"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex gap-8 border-b border-gray-200">
            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: "Reviews" },
              { key: "shipping", label: "Shipping" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                className={`pb-3 font-semibold transition ${
                  selectedTab === tab.key
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectedTab === "description" ? (
            <div className="space-y-4 text-gray-700">
              <p>{product.description}</p>
              {product.longDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {selectedTab === "reviews" ? (
            <div className="space-y-4 text-gray-700">
              <p>“This bracelet has become my anxiety anchor.”</p>
              <p>“Gift-ready packaging and premium finishing made it feel immediately special.”</p>
              <p>“The stone quality is beautiful and the fit is very comfortable.”</p>
            </div>
          ) : null}

          {selectedTab === "shipping" ? (
            <div className="space-y-4 text-gray-700">
              <p>Free shipping on orders over $50. Standard delivery takes 3-5 business days.</p>
              <p>International shipping is supported, with tracked parcels and gift-ready packaging.</p>
            </div>
          ) : null}
        </div>
      </div>

      <StoreFooter />
    </div>
  );
}
