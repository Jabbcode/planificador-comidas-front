'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import ShoppingItem from './ShoppingItem'
import type { DisplayCategory } from '../utils/aggregate'

interface Props {
  category: DisplayCategory
  checked: Set<string>
  onToggle: (ingredientId: string) => void
}

export default function ShoppingCategory({ category, checked, onToggle }: Props) {
  const [open, setOpen] = useState(true)
  const checkedCount = category.items.filter(i => checked.has(i.ingredientId)).length

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-2 px-4 py-3"
      >
        <span className="text-base">{category.emoji}</span>
        <span className="flex-1 text-left text-label-lg font-semibold text-on-surface">
          {category.label}
        </span>
        <span className="text-label-sm text-on-surface-variant">
          {checkedCount}/{category.items.length}
        </span>
        <ChevronDown
          size={16}
          className={cn('text-on-surface-variant transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="divide-y divide-outline-variant">
          {category.items.map(item => (
            <ShoppingItem
              key={item.ingredientId}
              item={item}
              checked={checked.has(item.ingredientId)}
              onToggle={() => onToggle(item.ingredientId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
