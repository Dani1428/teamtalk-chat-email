import { useEffect, useCallback } from 'react';

interface KeyboardShortcutHandlers {
  onCompose?: () => void;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onToggleRead?: () => void;
  onToggleStar?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onShowShortcuts?: () => void;
  onNextEmail?: () => void;
  onPreviousEmail?: () => void;
  onOpenEmail?: () => void;
  onBackToList?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ne pas déclencher les raccourcis si on est en train d'écrire
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    switch (e.key.toLowerCase()) {
      case 'c':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onCompose?.();
        }
        break;
      case 'r':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onReply?.();
        }
        break;
      case 'a':
        if (!isCtrlOrCmd && e.shiftKey) {
          e.preventDefault();
          handlers.onReplyAll?.();
        } else if (isCtrlOrCmd) {
          e.preventDefault();
          handlers.onSelectAll?.();
        }
        break;
      case 'f':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onForward?.();
        }
        break;
      case '#':
      case 'delete':
      case 'backspace':
        e.preventDefault();
        handlers.onDelete?.();
        break;
      case 'e':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onArchive?.();
        }
        break;
      case 'm':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onToggleRead?.();
        }
        break;
      case 's':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onToggleStar?.();
        }
        break;
      case 'escape':
        e.preventDefault();
        handlers.onBackToList?.();
        break;
      case 'j':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onNextEmail?.();
        }
        break;
      case 'k':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onPreviousEmail?.();
        }
        break;
      case 'o':
      case 'enter':
        if (!isCtrlOrCmd) {
          e.preventDefault();
          handlers.onOpenEmail?.();
        }
        break;
      case '?':
        e.preventDefault();
        handlers.onShowShortcuts?.();
        break;
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
