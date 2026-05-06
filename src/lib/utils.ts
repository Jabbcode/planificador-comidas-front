import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-headline-xl",
        "text-headline-lg",
        "text-headline-md",
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-label-md",
        "text-label-sm",
        "text-label-xs",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
