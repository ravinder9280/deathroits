"use client";

import { cn } from "@monorepo/utils/styles";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    className={cn("rounded-2xl", className)}
    ref={ref}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "flex flex-1 items-center cursor-pointer   text-black bg-white justify-between py-[18px] md:py-[22px] md:px-[28px] px-5 text-[15px] md:text-[17px] font-[600] transition-all  text-left [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-primary-dark transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    className="overflow-hidden bg-white text-sm text-muted-foreground pt-0 md:pt-0 py-[18px] md:py-[22px] md:px-[28px] px-5  data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ref={ref}
    {...props}
  >
    <div className={cn(" pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
