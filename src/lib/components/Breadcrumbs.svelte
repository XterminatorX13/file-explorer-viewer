<script lang="ts">
    import { fade } from "svelte/transition";

    let { path, onNavigate } = $props<{
        path: string; // Full path like "C:/Users/augus/Desktop"
        onNavigate: (path: string) => void;
    }>();

    let segments = $derived(path.split(/[/\\]/).filter((s) => s !== ""));

    // For Windows, the first segment might be "C:"
    function getPathAt(index: number) {
        const parts = path.split(/[/\\]/).filter((s) => s !== "");
        return parts.slice(0, index + 1).join("/") || "/";
    }
</script>

<nav class="breadcrumbs">
    <button class="crumb home" onclick={() => onNavigate("/")}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
    </button>

    {#each segments as segment, i}
        <span class="separator">/</span>
        <button
            class="crumb"
            class:active={i === segments.length - 1}
            onclick={() => onNavigate(getPathAt(i))}
            in:fade={{ duration: 150, delay: i * 30 }}
        >
            {segment}
        </button>
    {/each}
</nav>

<style>
    .breadcrumbs {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--text-muted);
        font-size: 13px;
        overflow: hidden;
    }

    .crumb {
        all: unset;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .crumb:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .crumb.active {
        color: var(--text-primary);
        font-weight: 600;
        background: var(--bg-active);
    }

    .home {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
    }

    .separator {
        color: var(--border-color);
        font-size: 10px;
        user-select: none;
    }
</style>
