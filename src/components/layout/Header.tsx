import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-surface-container-lowest px-5 shadow-card">
      <button
        aria-label="Menú"
        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <Menu strokeWidth={2} size={22} />
      </button>

      <span className="font-display text-headline-md absolute left-1/2 -translate-x-1/2 text-primary select-none">
        NutriPlan
      </span>

      <div
        aria-hidden
        className="h-9 w-9 rounded-full bg-primary-container flex items-center justify-center"
      >
        <span className="text-label-md text-on-primary-container">N</span>
      </div>
    </header>
  )
}
