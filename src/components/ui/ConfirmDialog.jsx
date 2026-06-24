import { Modal } from './Modal'
import { Button } from './Button'

/** Yes/No confirmation modal, used before destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'אישור פעולה',
  message = 'האם להמשיך?',
  confirmLabel = 'אישור',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-rose-soft/80">{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
