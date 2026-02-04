<script lang="ts">
    import type { FileEntry } from "$lib/types";
    import { slide } from "svelte/transition";
    import FileList from "./FileList.svelte";
    import { selection } from "$lib/selection.svelte";

    let {
        files,
        onSelect,
        onDoubleSelect,
        level = 0,
    } = $props<{
        files: FileEntry[];
        onSelect: (file: FileEntry) => void;
        onDoubleSelect?: (file: FileEntry) => void;
        level?: number;
    }>();

    // State to track expanded folders (internal to each level as before, but could be globalized)
    let expandedFolders = $state<Set<string>>(new Set());

    function toggleExpand(e: MouseEvent, file: FileEntry) {
        e.stopPropagation();
        if (file.type === "folder") {
            if (expandedFolders.has(file.id)) {
                expandedFolders.delete(file.id);
            } else {
                expandedFolders.add(file.id);
            }
            expandedFolders = new Set(expandedFolders);
        }
    }

    function handleRowClick(e: MouseEvent, file: FileEntry) {
        if ((e.target as HTMLElement).closest(".col-checkbox")) return;

        const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
        selection.toggle(file.id, isMulti);
        onSelect(file);
    }

    function handleRowDoubleClick(e: MouseEvent, file: FileEntry) {
        if ((e.target as HTMLElement).closest(".toggle-btn")) return;
        if (onDoubleSelect) onDoubleSelect(file);
    }

    function toggleCheckbox(e: Event, id: string) {
        e.stopPropagation();
        selection.toggle(id, true);
    }

    function formatSize(bytes: number) {
        if (!bytes || bytes === 0) return "--";
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }

    function formatDate(date: Date) {
        if (!date) return "--";
        return new Intl.DateTimeFormat("default", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }
</script>

<div class="list-container" style:--level={level}>
    {#if level === 0}
        <div class="list-header">
            <div class="col-checkbox">
                <input
                    type="checkbox"
                    checked={files.length > 0 &&
                        files.every((f: FileEntry) =>
                            selection.isSelected(f.id),
                        )}
                    onchange={(e) => {
                        if ((e.target as HTMLInputElement).checked) {
                            selection.selectAll(
                                files.map((f: FileEntry) => f.id),
                            );
                        } else {
                            selection.clear();
                        }
                    }}
                />
            </div>
            <div class="col-icon"></div>
            <div class="col-name">Name</div>
            <div class="col-date">Date Modified</div>
            <div class="col-type">Type</div>
            <div class="col-size">Size</div>
        </div>
    {/if}

    <div class="list-body">
        {#each files as file (file.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="list-row-wrapper"
                class:selected={selection.isSelected(file.id)}
                onclick={(e) => handleRowClick(e, file)}
                ondblclick={(e) => handleRowDoubleClick(e, file)}
            >
                <div class="list-row" style:padding-left="{12 + level * 20}px">
                    <div class="col-checkbox">
                        <input
                            type="checkbox"
                            checked={selection.isSelected(file.id)}
                            onchange={(e) => toggleCheckbox(e, file.id)}
                        />
                    </div>
                    <div class="col-icon">
                        {#if file.type === "folder"}
                            <button
                                class="toggle-btn"
                                class:expanded={expandedFolders.has(file.id)}
                                onclick={(e) => toggleExpand(e, file)}
                            >
                                ▶
                            </button>
                            📂
                        {:else}
                            <span class="spacer"></span>
                            📄
                        {/if}
                    </div>
                    <div class="col-name">{file.name}</div>
                    <div class="col-date">{formatDate(file.modified)}</div>
                    <div class="col-type">
                        {file.extension
                            ? file.extension.toUpperCase()
                            : "Folder"}
                    </div>
                    <div class="col-size">
                        {file.type === "folder" ? "--" : formatSize(file.size)}
                    </div>
                </div>
            </div>

            {#if file.type === "folder" && expandedFolders.has(file.id) && file.children && file.children.length > 0}
                <div
                    class="nested-children"
                    transition:slide={{ duration: 150 }}
                >
                    <FileList
                        files={file.children}
                        {onSelect}
                        {onDoubleSelect}
                        level={level + 1}
                    />
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .list-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 13px;
    }

    .list-header {
        display: grid;
        grid-template-columns: 40px 60px minmax(200px, 2fr) 150px 80px 80px;
        padding: 8px 12px;
        color: var(--text-muted);
        font-weight: 600;
        border-bottom: 1px solid var(--border-color);
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.05em;
    }

    .list-row-wrapper {
        border-bottom: 1px solid var(--border-subtle);
        transition: all 0.2s;
    }

    .list-row-wrapper.selected {
        background: rgba(59, 130, 246, 0.05);
    }

    .list-row {
        display: grid;
        grid-template-columns: 40px 60px minmax(200px, 2fr) 150px 80px 80px;
        padding: 8px 12px 8px 0;
        align-items: center;
        cursor: pointer;
        color: var(--text-secondary);
    }

    .list-row-wrapper:hover {
        background: var(--bg-hover);
    }

    .list-row-wrapper.selected .list-row {
        color: var(--text-primary);
    }

    .col-checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.3;
        transition: opacity 0.2s;
    }

    .list-row-wrapper:hover .col-checkbox,
    .list-row-wrapper.selected .col-checkbox {
        opacity: 1;
    }

    .col-checkbox input {
        width: 16px;
        height: 16px;
        accent-color: var(--accent-blue);
    }

    .col-icon {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .col-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
    }

    .col-size {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    .toggle-btn {
        font-size: 8px;
        color: var(--text-muted);
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
    }

    .toggle-btn.expanded {
        transform: rotate(90deg);
    }

    .spacer {
        width: 16px;
    }
</style>
