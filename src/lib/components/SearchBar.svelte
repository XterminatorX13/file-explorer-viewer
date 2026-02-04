<script lang="ts">
    import { fade } from "svelte/transition";

    let {
        value = $bindable(""),
        placeholder = "Search files, tags or content...",
    } = $props<{
        value?: string;
        placeholder?: string;
    }>();

    let isFocused = $state(false);
</script>

<div class="search-container" class:focused={isFocused}>
    <div class="search-icon">
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    </div>
    <input
        type="text"
        bind:value
        {placeholder}
        onfocus={() => (isFocused = true)}
        onblur={() => (isFocused = false)}
    />
    {#if value}
        <button
            class="clear-btn"
            onclick={() => (value = "")}
            transition:fade={{ duration: 100 }}
        >
            ✕
        </button>
    {/if}
    <div class="search-shortcut">Ctrl+K</div>
</div>

<style>
    .search-container {
        display: flex;
        align-items: center;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 99px;
        padding: 0 16px;
        height: 38px;
        width: 100%;
        max-width: 420px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }

    .search-container.focused {
        border-color: var(--accent-blue);
        background: var(--bg-active);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        max-width: 440px;
    }

    .search-icon {
        color: var(--text-muted);
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    .focused .search-icon {
        color: var(--accent-blue);
    }

    input {
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 13px;
        width: 100%;
        height: 100%;
        outline: none;
    }

    input::placeholder {
        color: var(--text-muted);
    }

    .clear-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 12px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .clear-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .search-shortcut {
        font-size: 10px;
        color: var(--text-muted);
        background: var(--bg-secondary);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        margin-left: 8px;
        user-select: none;
        pointer-events: none;
    }

    .focused .search-shortcut {
        display: none;
    }
</style>
