import { Button } from "../../components/ui/Button";

type Props = {
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="dialog-backdrop" onClick={onCancel} role="presentation">
      <section className="character-panel panel" onClick={(event) => event.stopPropagation()}>
        <div className="character-panel-header">
          <h3 className="character-panel-title">{title}</h3>
          <button className="close-button" onClick={onCancel} type="button">
            ×
          </button>
        </div>
        <p className="outcome-message" style={{ marginTop: 0, textAlign: "left" }}>
          {message}
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText ?? "Cancelar"}
          </Button>
          <Button onClick={onConfirm}>{confirmText ?? "Confirmar"}</Button>
        </div>
      </section>
    </div>
  );
}
