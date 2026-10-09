"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

type FaqItem = { q: string; a: string };

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible defaultValue="q-0" className="border-t border-line">
      {items.map((item, index) => (
        <AccordionPrimitive.Item key={item.q} value={`q-${index}`} className="border-b border-line">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              data-testid="faq-trigger"
              className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight md:py-7 md:text-2xl"
            >
              <span className="flex items-baseline gap-4">
                <span className="label w-6 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                {item.q}
              </span>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-[background-color,color,transform] duration-500 group-hover:bg-foreground group-hover:text-background group-data-[state=open]:rotate-45">
                <Plus className="size-4" aria-hidden />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="max-w-2xl pb-7 pl-10 text-muted-foreground md:text-lg">{item.a}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
