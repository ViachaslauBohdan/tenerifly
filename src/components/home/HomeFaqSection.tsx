"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import translationsJson from "@/i18n/main.json";

type FaqCopy = (typeof translationsJson)["en"]["faq"];

type HomeFaqSectionProps = {
  copy: FaqCopy;
};

export function HomeFaqSection({ copy }: HomeFaqSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <section
      id="faq"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {copy.title}
          </h2>
          <p className="text-lg text-gray-600">{copy.subtitle}</p>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedFaq(expandedFaq === "preBook" ? null : "preBook")
              }
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              aria-expanded={expandedFaq === "preBook"}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {copy.preBook.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedFaq === "preBook" ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            {expandedFaq === "preBook" && (
              <div className="px-6 pb-4 bg-gray-50">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {copy.preBook.answer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
