import { cn } from '@/lib/utils'
import type { ShoppingItem as ShoppingItemType } from '../types'

interface Props {
  item: ShoppingItemType
  checked: boolean
  onToggle: () => void
}

export default function ShoppingItem({ item, checked, onToggle }: Props) {
  const qty = item.totalQuantity !== null
    ? `${item.totalQuantity}${item.unit ? ` ${item.unit}` : ''}`
    : item.unit ?? ''

  return (
    <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
      />
      <span className={cn('flex-1 text-body-md text-on-surface', checked && 'text-on-surface-variant line-through')}>
        {item.name}
      </span>
      {qty && (
        <span className={cn('text-body-sm text-on-surface-variant', checked && 'line-through')}>
          {qty}
        </span>
      )}
    </label>
  )
}
