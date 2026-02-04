import { onMount, onDestroy } from 'svelte';

export interface ShortcutHandlers {
    newTab: () => void;
    closeTab: () => void;
    nextTab: () => void;
    prevTab: () => void;
    goBack: () => void;
    goForward: () => void;
    goUp: () => void;
    focusSearch: () => void;
    editPath: () => void;
    refresh: () => void;
    toggleSidebar: () => void;
    toggleInspector: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
    function handleKeydown(e: KeyboardEvent) {
        // Ignore if typing in input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            // Allow Escape to blur
            if (e.key === 'Escape') {
                target.blur();
            }
            return;
        }

        // Ctrl/Cmd combinations
        const mod = e.ctrlKey || e.metaKey;

        if (mod && e.key === 't') {
            e.preventDefault();
            handlers.newTab();
        } else if (mod && e.key === 'w') {
            e.preventDefault();
            handlers.closeTab();
        } else if (mod && e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                handlers.prevTab();
            } else {
                handlers.nextTab();
            }
        } else if (mod && e.key === 'l') {
            e.preventDefault();
            handlers.editPath();
        } else if (mod && e.key === 'f') {
            e.preventDefault();
            handlers.focusSearch();
        } else if (mod && e.key === 'b') {
            e.preventDefault();
            handlers.toggleSidebar();
        } else if (mod && e.key === 'i') {
            e.preventDefault();
            handlers.toggleInspector();
        } else if ((mod && e.key === 'r') || e.key === 'F5') {
            e.preventDefault();
            handlers.refresh();
        }
        // Alt combinations
        else if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            handlers.goBack();
        } else if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            handlers.goForward();
        } else if (e.altKey && e.key === 'ArrowUp') {
            e.preventDefault();
            handlers.goUp();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
}
