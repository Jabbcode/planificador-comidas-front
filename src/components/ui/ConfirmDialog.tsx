import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Eliminar', loading = false, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onCancel}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-headline-md">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            className="flex-1 rounded-full bg-error text-on-error hover:bg-error/90"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
