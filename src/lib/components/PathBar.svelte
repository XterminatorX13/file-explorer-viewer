<script lang="ts">
    import { ChevronRight } from "lucide-svelte";

    let { path, onNavigate } = $props<{
        path: string;
        onNavigate: (path: string) => void;
    }>();
    let isEditing = $state(false);
    let editablePath = $state("");
    let inputRef = $state<HTMLInputElement | null>(null);

    // Sync editablePath when path prop changes
    $effect(() => {
        editablePath = path;
    });

    // Parse path into clickable segments
    const segments = $derived(() => {
        const parts = path.split("/").filter(Boolean);
        return parts.map((name: string, index: number) => ({
            name,
            path: "/" + parts.slice(0, index + 1).join("/"),
        }));
    });

    function handleSegmentClick(segmentPath: string) {
        onNavigate(segmentPath);
    }

    function enterEditMode() {
        isEditing = true;
        editablePath = path;
        // Use a timeout to ensure the input is rendered before focusing
        setTimeout(() => {
            inputRef?.focus();
            inputRef?.select();
        }, 0);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            onNavigate(editablePath);
            isEditing = false;
        } else if (e.key === "Escape") {
            isEditing = false;
        }
    }

    // Expose edit mode trigger for keyboard shortcut (Ctrl+L)
    export function triggerEditMode() {
        enterEditMode();
    }
</script>

{#if isEditing}
    <input
        bind:this={inputRef}
        class="path-input"
        type="text"
        bind:value={editablePath}
        onkeydown={handleKeydown}
        onblur={() => (isEditing = false)}
        placeholder="Enter path..."
    />
{:else}
    <div
        class="path-bar"
        role="button"
        tabindex="0"
        onclick={(e) => {
            if (e.target === e.currentTarget) enterEditMode();
        }}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") enterEditMode();
        }}
    >
        <button
            class="path-segment root"
            onclick={() => handleSegmentClick("/")}
            title="Root"
        >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        </button>

        {#each segments() as segment, i}
            <span class="separator">
                <ChevronRight size={12} />
            </span>
            <button
                class="path-segment"
                class:active={i === segments().length - 1}
                onclick={() => handleSegmentClick(segment.path)}
                title={segment.path}
            >
                {segment.name}
            </button>
        {/each}

        <button
            class="edit-btn"
            onclick={enterEditMode}
            title="Edit path (Ctrl+L)"
        >
            <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
            </svg>
        </button>
    </div>
{/if}

<style>
    .path-bar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-md);
        border: 1px solid rgba(255, 255, 255, 0.05);
        flex: 1;
        max-width: 600px;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .path-bar::-webkit-scrollbar {
        display: none;
    }

    .path-segment {
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: calc(var(--radius-md) - 2px);
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        background: transparent;
        transition: all 0.15s;
        white-space: nowrap;
        cursor: pointer;
    }

    .path-segment.root {
        padding: 4px 8px;
        color: var(--accent-blue);
    }

    .path-segment:hover {
        background: rgba(255, 255, 255, 0.08);
        color: var(--text-primary);
    }

    .path-segment.active {
        background: var(--accent-blue);
        color: white;
        font-weight: 600;
    }

    .separator {
        display: flex;
        align-items: center;
        color: var(--text-muted);
        opacity: 0.4;
    }

    .edit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        margin-left: 4px;
        border-radius: 4px;
        color: var(--text-muted);
        opacity: 0;
        transition: all 0.15s;
    }

    .path-bar:hover .edit-btn {
        opacity: 1;
    }

    .edit-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .path-input {
        width: 100%;
        max-width: 600px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--accent-blue);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: 13px;
        font-family: "SF Mono", "Monaco", "Consolas", monospace;
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .path-input::placeholder {
        color: var(--text-muted);
    }
</style>
