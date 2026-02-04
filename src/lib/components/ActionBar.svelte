<script lang="ts">
    import { selection } from "$lib/selection.svelte";
    import { fly } from "svelte/transition";
    import {
        Tag,
        FolderInput,
        Star,
        Trash2,
        ChevronRight,
        CheckCircle2,
    } from "lucide-svelte";

    let { onAction } = $props<{
        onAction: (action: string, ids: string[]) => void;
    }>();

    const actions = [
        {
            id: "tag",
            label: "Add Tag",
            component: Tag,
            color: "#3b82f6",
        },
        {
            id: "move",
            label: "Move",
            component: FolderInput,
            color: "#a855f7",
        },
        {
            id: "favorite",
            label: "Favorite",
            component: Star,
            color: "#fbbf24",
        },
        {
            id: "delete",
            label: "Delete",
            component: Trash2,
            color: "#ef4444",
            dangerous: true,
        },
    ];

    function handleAction(id: string) {
        onAction(id, Array.from(selection.selectedIds));
    }
</script>

{#if selection.count > 0}
    <div class="action-bar-wrapper" transition:fly={{ y: 100, duration: 400 }}>
        <div class="action-bar-glow"></div>
        <div class="action-bar">
            <div class="selection-count">
                <span class="count-badge">
                    {#key selection.count}
                        <span in:fly={{ y: -10, duration: 200 }}
                            >{selection.count}</span
                        >
                    {/key}
                </span>
                <span class="count-label"
                    >{selection.count === 1
                        ? "item selected"
                        : "items selected"}</span
                >
                <button class="clear-btn" onclick={() => selection.clear()}
                    >Deselect</button
                >
            </div>

            <div class="divider-v"></div>

            <div class="action-buttons">
                {#each actions as action}
                    {@const Icon = action.component}
                    <button
                        class="action-btn"
                        class:dangerous={action.dangerous}
                        style:--icon-color={action.color}
                        onclick={() => handleAction(action.id)}
                    >
                        <span class="action-icon">
                            <Icon size={18} strokeWidth={2.2} />
                        </span>
                        <span class="action-label">{action.label}</span>
                    </button>
                {/each}
            </div>

            <div class="divider-v"></div>

            <button class="apply-btn" onclick={() => handleAction("apply")}>
                <span class="btn-text">Apply to Disk</span>
                <ChevronRight size={16} strokeWidth={3} />
                <span class="shimmer"></span>
            </button>
        </div>
    </div>
{/if}

<style>
    .action-bar-wrapper {
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .action-bar-glow {
        position: absolute;
        width: 110%;
        height: 110%;
        background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.2) 0%,
            transparent 70%
        );
        filter: blur(20px);
        pointer-events: none;
    }

    .action-bar {
        background: rgba(18, 18, 18, 0.8);
        backdrop-filter: blur(24px) saturate(160%);
        -webkit-backdrop-filter: blur(24px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px 12px;
        border-radius: 99px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: pulse-border 4s infinite;
    }

    @keyframes pulse-border {
        0%,
        100% {
            border-color: rgba(255, 255, 255, 0.1);
        }
        50% {
            border-color: rgba(59, 130, 246, 0.3);
        }
    }

    .selection-count {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-left: 12px;
    }

    .count-badge {
        background: var(--accent-blue);
        color: white;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        overflow: hidden;
        position: relative;
    }

    .count-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        letter-spacing: -0.01em;
    }

    .clear-btn {
        font-size: 11px;
        color: var(--text-muted);
        text-decoration: none;
        margin-left: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .clear-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
    }

    .divider-v {
        width: 1px;
        height: 24px;
        background: rgba(255, 255, 255, 0.15);
    }

    .action-buttons {
        display: flex;
        gap: 6px;
    }

    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        border-radius: 14px;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid transparent;
        color: var(--text-muted);
    }

    .action-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-primary);
        transform: translateY(-2px);
    }

    .action-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--icon-color);
        opacity: 0.9;
    }

    .action-btn:hover .action-icon {
        transform: scale(1.1);
        opacity: 1;
        filter: drop-shadow(0 0 8px var(--icon-color));
    }

    .action-label {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .action-btn.dangerous:hover .action-icon {
        color: var(--accent-red);
    }

    .apply-btn {
        padding: 10px 20px 10px 24px;
        background: var(--accent-blue);
        color: white;
        border-radius: 99px;
        font-size: 13px;
        font-weight: 750;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .apply-btn:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
        background: #4f46e5;
    }

    .apply-btn:active {
        transform: translateY(0) scale(0.98);
    }

    .shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
        );
        animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
</style>
