<script lang="ts">
    import { slide } from "svelte/transition";
    import {
        LayoutGrid,
        List,
        Columns,
        Eye,
        EyeOff,
        FileCode,
        AlignLeft,
        Settings2,
        ArrowUp,
        ArrowDown,
        GalleryVertical,
    } from "lucide-svelte";

    let {
        viewMode,
        iconSize,
        showHidden,
        onChangeView,
        onChangeSize,
        onToggleHidden,
        sortBy,
        sortDirection,
        onSortChange,
    } = $props<{
        viewMode: "grid" | "list" | "columns" | "masonry";
        iconSize: number;
        showHidden: boolean;
        sortBy: "name" | "date" | "size" | "type";
        sortDirection: "asc" | "desc";
        onChangeView: (mode: "grid" | "list" | "columns" | "masonry") => void;
        onChangeSize: (size: number) => void;
        onToggleHidden: () => void;
        onSortChange: (
            by: "name" | "date" | "size" | "type",
            dir: "asc" | "desc",
        ) => void;
    }>();

    let isOpen = $state(false);

    function toggleOpen() {
        isOpen = !isOpen;
    }

    function close() {
        isOpen = false;
    }

    // Click outside to close (simplified for now)
    function handleOutsideClick(node: HTMLElement) {
        const handleClick = (e: MouseEvent) => {
            if (!node.contains(e.target as Node) && isOpen) {
                close();
            }
        };
        document.addEventListener("click", handleClick, true);
        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            },
        };
    }
</script>

<div class="view-options-container" use:handleOutsideClick>
    <button
        class="trigger-btn"
        class:active={isOpen}
        onclick={toggleOpen}
        title="View Options"
    >
        <span class="view-icon">
            {#if viewMode === "grid"}
                <LayoutGrid size={16} />
            {:else if viewMode === "list"}
                <List size={16} />
            {:else if viewMode === "columns"}
                <Columns size={16} />
            {:else}
                <GalleryVertical size={16} />
            {/if}
        </span>
        <span class="chevron">▼</span>
    </button>

    {#if isOpen}
        <div class="popover" transition:slide={{ duration: 200, axis: "y" }}>
            <div class="section">
                <div class="section-title">Layout</div>
                <div class="layout-toggles">
                    <button
                        class="layout-btn"
                        class:active={viewMode === "grid"}
                        onclick={() => onChangeView("grid")}
                    >
                        <LayoutGrid size={18} />
                        <span>Grid</span>
                    </button>
                    <button
                        class="layout-btn"
                        class:active={viewMode === "list"}
                        onclick={() => onChangeView("list")}
                    >
                        <List size={18} />
                        <span>List</span>
                    </button>
                    <button
                        class="layout-btn"
                        class:active={viewMode === "columns"}
                        onclick={() => onChangeView("columns")}
                    >
                        <Columns size={18} />
                        <span>Columns</span>
                    </button>
                    <button
                        class="layout-btn"
                        class:active={viewMode === "masonry"}
                        onclick={() => onChangeView("masonry")}
                    >
                        <GalleryVertical size={18} />
                        <span>Masonry</span>
                    </button>
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">Sort By</div>
                <div class="sort-grid">
                    {#each ["name", "date", "size", "type"] as option}
                        <button
                            class="sort-btn"
                            class:active={sortBy === option}
                            onclick={() => {
                                if (sortBy === option) {
                                    onSortChange(
                                        option as any,
                                        sortDirection === "asc"
                                            ? "desc"
                                            : "asc",
                                    );
                                } else {
                                    onSortChange(option as any, "asc");
                                }
                            }}
                        >
                            <span class="sort-label">{option}</span>
                            {#if sortBy === option}
                                <span class="sort-arrow">
                                    {#if sortDirection === "asc"}<ArrowUp
                                            size={10}
                                        />{:else}<ArrowDown size={10} />{/if}
                                </span>
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">Size</div>
                <div class="slider-container">
                    <span class="size-icon small"><List size={14} /></span>
                    <input
                        type="range"
                        min="40"
                        max="200"
                        value={iconSize}
                        oninput={(e) =>
                            onChangeSize(Number(e.currentTarget.value))}
                        class="density-slider"
                    />
                    <span class="size-icon large"><LayoutGrid size={20} /></span
                    >
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <button class="option-row" onclick={onToggleHidden}>
                    <div class="option-icon">
                        {#if showHidden}
                            <Eye size={16} />
                        {:else}
                            <EyeOff size={16} />
                        {/if}
                    </div>
                    <span class="option-label">Hidden Items</span>
                    <div class="toggle-switch" class:checked={showHidden}>
                        <div class="toggle-knob"></div>
                    </div>
                </button>

                <button class="option-row" disabled>
                    <div class="option-icon"><FileCode size={16} /></div>
                    <span class="option-label">Extensions</span>
                    <div class="toggle-switch checked">
                        <div class="toggle-knob"></div>
                    </div>
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .view-options-container {
        position: relative;
        z-index: 50;
    }

    .trigger-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: 13px;
        transition: all 0.2s;
    }

    .trigger-btn:hover,
    .trigger-btn.active {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .chevron {
        font-size: 8px;
        opacity: 0.7;
    }

    .popover {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        width: 260px;
        background: #1e1e1e;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        backdrop-filter: blur(20px);
    }

    .section {
        padding: 4px;
    }

    .section-title {
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
        padding-left: 4px;
    }

    .layout-toggles {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        background: rgba(0, 0, 0, 0.2);
        padding: 4px;
        border-radius: 8px;
    }

    .layout-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border-radius: 6px;
        color: var(--text-muted);
        font-size: 11px;
        transition: all 0.2s;
    }

    .layout-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
    }

    .layout-btn.active {
        background: var(--bg-active);
        color: var(--accent-blue);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider-container {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 8px;
        height: 32px;
    }

    .size-icon {
        color: var(--text-muted);
    }

    .density-slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        background: var(--bg-active);
        border-radius: 2px;
        outline: none;
    }

    .density-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--accent-blue);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .divider {
        height: 1px;
        background: var(--border-color);
        margin: 0 4px;
        opacity: 0.5;
    }

    .option-row {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 8px;
        border-radius: 6px;
        gap: 10px;
        font-size: 13px;
        color: var(--text-primary);
        text-align: left;
    }

    .option-row:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.05);
    }

    .option-row:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .option-icon {
        color: var(--text-muted);
        display: flex;
    }

    .option-label {
        flex: 1;
    }

    .toggle-switch {
        width: 32px;
        height: 18px;
        background: var(--bg-active);
        border-radius: 9px;
        position: relative;
        transition: all 0.2s;
    }

    .toggle-switch.checked {
        background: var(--accent-blue);
    }

    .toggle-knob {
        position: absolute;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        top: 2px;
        left: 2px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .toggle-switch.checked .toggle-knob {
        transform: translateX(14px);
    }

    .sort-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        background: rgba(0, 0, 0, 0.2);
        padding: 4px;
        border-radius: 8px;
    }

    .sort-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px;
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 11px;
        text-transform: capitalize;
        transition: all 0.2s;
    }

    .sort-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
    }

    .sort-btn.active {
        background: var(--bg-active);
        color: var(--accent-blue);
    }
</style>
