<script lang="ts">
    import { listFiles } from "$lib/api";
    import type { FileEntry } from "$lib/types";
    import { Folder, FileText, ChevronRight } from "lucide-svelte";
    import { onMount } from "svelte";
    import SidebarItem from "./SidebarItem.svelte"; // Reusing for icons logic if needed, or inline

    let {
        path,
        onNavigate,
        initialFiles = [],
    } = $props<{
        path: string;
        onNavigate: (path: string) => void;
        initialFiles?: FileEntry[];
    }>();

    type ColumnData = {
        path: string;
        files: FileEntry[];
        selectedId: string | null;
    };

    let columns = $state<ColumnData[]>([]);
    let columnWidths = $state<number[]>([]);
    let isLoading = $state(false);

    let resizingIndex = $state<number | null>(null);
    let startX = $state(0);
    let startWidth = $state(0);

    function startResizing(index: number, event: MouseEvent) {
        resizingIndex = index;
        startX = event.clientX;
        startWidth = columnWidths[index] || 220;
        event.preventDefault();
    }

    $effect(() => {
        if (resizingIndex !== null) {
            const handleMouseMove = (e: MouseEvent) => {
                if (resizingIndex !== null) {
                    const delta = e.clientX - startX;
                    const newWidth = Math.max(
                        150,
                        Math.min(600, startWidth + delta),
                    );
                    columnWidths[resizingIndex] = newWidth;
                }
            };

            const handleMouseUp = () => {
                resizingIndex = null;
            };

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    });

    // Effect to update columns when path changes
    $effect(() => {
        loadColumns(path);
    });

    async function loadColumns(currentPath: string) {
        isLoading = true;

        // 1. Calculate ancestral paths
        // e.g. "C:/Users/Augus" -> ["C:/", "C:/Users", "C:/Users/Augus"]
        // Handling Windows roots is tricky, simplistic approach for now:
        const normalized = currentPath.replace(/\\/g, "/");
        const parts = normalized.split("/").filter((p) => p);

        const paths: string[] = [];
        let accumulator = "";

        // Handle root specially
        if (normalized.startsWith("/")) {
            // Unix style
            accumulator = "/";
            paths.push("/");
        } else if (parts[0].includes(":")) {
            // Windows Drive: combine first part as root
            accumulator = parts[0] + "/"; // Ensure trailing slash for root
            paths.push(accumulator);
            parts.shift(); // Remove drive from iteration
        }

        for (const part of parts) {
            accumulator = accumulator.endsWith("/")
                ? accumulator + part
                : accumulator + "/" + part;
            paths.push(accumulator);
        }

        // If currentPath is exactly root (e.g. C:/), setup is done

        // If currentPath is exactly root (e.g. C:/), setup is done

        // 2. Fetch data for all columns
        const colPromises = paths.map(async (p, index) => {
            try {
                let files: FileEntry[] = [];

                // Optimized: Use initialFiles for the last column if paths match
                // (This saves a fetch and ensures data visibility if backend is blocked)
                const isLastColumn = index === paths.length - 1;
                const pathMatchesInitial =
                    p === normalized || p.replace(/\\/g, "/") === normalized;

                if (
                    isLastColumn &&
                    initialFiles.length > 0 &&
                    pathMatchesInitial
                ) {
                    files = initialFiles;
                } else {
                    files = await listFiles(p);
                }

                // mock fallback if empty and we are deep in tree (likely dev mode)
                if (files.length === 0 && p.includes("mock")) {
                    // Logic to inject mock children if needed,
                    // or just accept empty for now.
                }

                // Determine selected ID based on next path segment
                let selectedId: string | null = null;
                if (index < paths.length - 1) {
                    const nextPath = paths[index + 1];
                    // Find the folder that matches the next path
                    // On Windows, paths might differ by slash, so compare carefully
                    // Usually listFiles returns full paths in `path` property
                    const match = files.find((f) => {
                        // Simple normalization for comparison
                        return (
                            f.path.replace(/\\/g, "/") ===
                            nextPath.replace(/\\/g, "/")
                        );
                    });
                    // Backup check by name if path logic fails
                    if (!match) {
                        const nextName = nextPath.split("/").pop();
                        const matchByName = files.find(
                            (f) => f.name === nextName,
                        );
                        if (matchByName) selectedId = matchByName.id;
                    } else {
                        selectedId = match.id;
                    }
                }

                return {
                    path: p,
                    files,
                    selectedId,
                };
            } catch (e) {
                console.error(`Failed to load column for ${p}`, e);
                return { path: p, files: [], selectedId: null };
            }
        });

        columns = await Promise.all(colPromises);

        // Ensure columnWidths matches columns length
        if (columnWidths.length < columns.length) {
            const newWidths = [...columnWidths];
            for (let i = columnWidths.length; i < columns.length; i++) {
                newWidths[i] = 220;
            }
            columnWidths = newWidths;
        }

        isLoading = false;

        // Scroll to end
        setTimeout(() => {
            const container = document.querySelector(".column-view-container");
            if (container) container.scrollLeft = container.scrollWidth;
        }, 10);
    }

    function handleItemClick(colIndex: number, item: FileEntry) {
        if (item.type === "folder") {
            onNavigate(item.path);
        } else {
            // Logic for file selection (preview) could go here
            // For now, selecting a file doesn't change path in this implementation
            // unless we want "preview" mode.
            // Let's just update the selectedId of this column visually
            const newCols = [...columns];
            newCols[colIndex].selectedId = item.id;
            columns = newCols;
        }
    }
</script>

<div class="column-view-container">
    {#each columns as col, i}
        <div
            class="column"
            style="width: {columnWidths[i] || 220}px; min-width: {columnWidths[
                i
            ] || 220}px; max-width: {columnWidths[i] || 220}px;"
        >
            <div class="column-header">
                {col.files.length} items
            </div>
            <div class="column-list">
                {#each col.files as file}
                    <button
                        class="column-item"
                        class:selected={col.selectedId === file.id}
                        class:is-folder={file.type === "folder"}
                        onclick={() => handleItemClick(i, file)}
                    >
                        <span class="icon">
                            {#if file.type === "folder"}
                                <Folder
                                    size={14}
                                    fill={col.selectedId === file.id
                                        ? "currentColor"
                                        : "none"}
                                />
                            {:else}
                                <FileText size={14} />
                            {/if}
                        </span>
                        <span class="name">{file.name}</span>
                        {#if file.type === "folder"}
                            <span class="arrow"><ChevronRight size={12} /></span
                            >
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
        {#if i < columns.length - 1}
            <button
                class="resize-handle"
                class:active={resizingIndex === i}
                onmousedown={(e) => startResizing(i, e)}
                aria-label="Resize column"
            ></button>
        {/if}
    {/each}
</div>

<style>
    .column-view-container {
        flex: 1;
        display: flex;
        overflow-x: auto;
        background: var(--bg-primary);
        height: 100%;
        gap: 1px; /* Divider look */
    }

    .column {
        display: flex;
        flex-direction: column;
        background: var(--bg-secondary);
        position: relative;
    }

    .resize-handle {
        width: 4px;
        margin: 0 -2px;
        cursor: col-resize;
        z-index: 10;
        transition: background 0.2s;
        border-right: 1px solid var(--border-color);
        background: transparent;
        padding: 0;
    }

    .resize-handle:hover,
    .resize-handle.active {
        background: var(--accent-blue);
        opacity: 0.5;
    }

    .column:last-child {
        background: var(--bg-primary); /* Highlight active directory */
        flex: 1; /* Last column takes remaining space? Optional */
        max-width: none;
    }

    .column-header {
        padding: 8px 12px;
        font-size: 11px;
        color: var(--text-muted);
        border-bottom: 1px solid var(--border-subtle);
        background: rgba(0, 0, 0, 0.1);
        text-align: right;
    }

    .column-list {
        flex: 1;
        overflow-y: auto;
        padding: 4px;
    }

    .column-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 6px 8px;
        border-radius: 4px;
        text-align: left;
        color: var(--text-primary);
        font-size: 13px;
        gap: 8px;
        transition: all 0.1s;
    }

    .column-item:hover {
        background: var(--bg-hover);
    }

    .column-item.selected {
        background: var(--accent-blue);
        color: white;
    }

    .icon {
        display: flex;
        opacity: 0.7;
    }

    .column-item.selected .icon {
        opacity: 1;
    }

    .name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .arrow {
        opacity: 0.5;
        display: flex;
    }

    .column-item.selected .arrow {
        opacity: 1;
    }
</style>
