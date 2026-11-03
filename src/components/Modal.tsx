import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return <dialog ref={ref} className="cloud-dialog" onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="dialog-heading"><h2>{title}</h2><button aria-label="Close dialog" className="icon-button" onClick={onClose}><X size={18} /></button></div>
    <div className="dialog-content">{children}</div>
  </dialog>;
}
