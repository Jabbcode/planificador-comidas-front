import { Plus } from 'lucide-react'

export default function FabAdd() {
  return (
    <button
      aria-label="Añadir"
      className="fixed right-5 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-elevated transition-transform active:scale-95 hover:brightness-110"
    >
      <Plus strokeWidth={2.5} size={24} />
    </button>
  )
}
