<script lang="ts">
    import type { FileEntry } from "$lib/types";
    import { fade, slide } from "svelte/transition";
    import { PanelRight } from "lucide-svelte";

    let { selectedFile, onClose } = $props<{
        selectedFile: FileEntry | null;
        onClose: () => void;
    }>();

    function formatSize(bytes: number) {
        if (!bytes) return "--";
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
</script>

<aside class="inspector" transition:slide={{ axis: "x", duration: 300 }}>
    {#if selectedFile}
        <header class="inspector-header">
            <h3>Inspector</h3>
            <button class="btn-icon" onclick={onClose} title="Hide Inspector">
                <PanelRight size={18} />
            </button>
        </header>

        <div class="inspector-content">
            <!-- Preview Section -->
            <div class="preview-box">
                <div class="file-icon-large">
                    {#if selectedFile.type === "folder"}📁{:else}📄{/if}
                </div>
                <div class="file-name-main">{selectedFile.name}</div>
            </div>

            <!-- Metadata Section -->
            <section class="meta-section">
                <div class="section-label">METADATA</div>
                <div class="meta-grid">
                    <span class="label">Kind</span>
                    <span class="value"
                        >{selectedFile.type === "folder"
                            ? "Folder"
                            : selectedFile.extension.toUpperCase()}</span
                    >

                    <span class="label">Size</span>
                    <span class="value">{formatSize(selectedFile.size)}</span>

                    <span class="label">Modified</span>
                    <span class="value"
                        >{selectedFile.modified.toLocaleDateString()}</span
                    >

                    <span class="label">Path</span>
                    <span class="value path-value">{selectedFile.path}</span>
                </div>
            </section>

            <!-- Tags Section (Eagle Style) -->
            <section class="tags-section">
                <div class="section-label">TAGS (EAGLE MODE)</div>
                <div class="tags-container">
                    {#each selectedFile.tags as tag}
                        <span class="pill active"
                            >{tag} <button class="remove-tag">×</button></span
                        >
                    {/each}
                    <button class="add-tag-btn">+ Add Tag</button>
                </div>
            </section>
        </div>
    {:else}
        <div class="empty-state">
            <div class="empty-icon-wrapper">
                <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="magnify-icon"
                >
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <div class="icon-glow"></div>
            </div>
            <p>Select a file to view properties</p>
        </div>
    {/if}
</aside>

<style>
    .inspector {
        width: var(--inspector-width, 320px);
        background: var(--bg-secondary);
        border-left: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }

    .inspector-header {
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid var(--border-color);
    }

    .inspector-header h3 {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
    }

    .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: var(--radius-md);
        color: var(--text-muted);
        transition: all var(--transition-fast);
    }

    .btn-icon:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .inspector-content {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .preview-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background: var(--bg-tertiary);
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
    }

    .file-icon-large {
        font-size: 64px;
    }

    .file-name-main {
        font-weight: 600;
        font-size: 15px;
        text-align: center;
        word-break: break-all;
    }

    .section-label {
        font-size: 10px;
        font-weight: 700;
        color: var(--text-muted);
        letter-spacing: 0.1em;
        margin-bottom: 12px;
    }

    .meta-grid {
        display: grid;
        grid-template-columns: 80px 1fr;
        gap: 12px 8px;
        font-size: 12px;
    }

    .meta-grid .label {
        color: var(--text-muted);
    }

    .meta-grid .value {
        color: var(--text-primary);
    }

    .path-value {
        word-break: break-all;
        opacity: 0.7;
        font-family: monospace;
        font-size: 11px;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .add-tag-btn {
        font-size: 11px;
        color: var(--accent-blue);
        background: rgba(59, 130, 246, 0.1);
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .remove-tag {
        margin-left: 4px;
        opacity: 0.5;
    }

    .empty-state {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: var(--text-muted);
        text-align: center;
    }

    .empty-icon-wrapper {
        position: relative;
        margin-bottom: 24px;
        color: var(--text-muted);
        opacity: 0.3;
    }

    .magnify-icon {
        position: relative;
        z-index: 2;
    }

    .icon-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: radial-gradient(
            circle,
            var(--accent-blue) 0%,
            transparent 70%
        );
        opacity: 0.2;
        filter: blur(20px);
        z-index: 1;
    }

    .empty-state p {
        font-size: 13px;
        font-weight: 500;
        max-width: 160px;
        line-height: 1.5;
    }
</style>
