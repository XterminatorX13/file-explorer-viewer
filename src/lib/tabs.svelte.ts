import type { FileEntry, Tab } from "./types";
import { listFiles } from "./api";
import { selection } from "./selection.svelte";
import { MOCK_SYSTEM_FOLDERS, getMockFiles } from "./mocks";

export class TabState {
    tabs = $state<Tab[]>([
        {
            id: "tab-1",
            name: "This PC",
            folder: {
                id: "root",
                name: "This PC",
                path: "",
                extension: "",
                size: 0,
                modified: new Date(),
                type: "folder",
                tags: [],
                children: [],
                specialType: "home"
            },
            explorerFiles: MOCK_SYSTEM_FOLDERS,
            viewMode: "grid",
            history: [],
            historyIndex: 0,
        },
    ]);

    activeTabId = $state<string>("tab-1");
    isLoading = $state(false);
    errorMsg = $state<string | null>(null);

    activeTab = $derived(
        this.tabs.find((t) => t.id === this.activeTabId) || this.tabs[0]
    );

    async loadFolder(item: FileEntry, fromHistory = false) {
        if (item.type !== "folder") return;
        this.isLoading = true;
        this.errorMsg = null;
        selection.clear();

        try {
            const tab = this.activeTab;
            let files: FileEntry[] | null = await getMockFiles(item.id);

            if (!files) {
                // Try real backend if path exists
                if (item.path) {
                    files = await listFiles(item.path);
                } else {
                    files = [];
                }
            }

            tab.explorerFiles = files;
            tab.folder = item;
            tab.name = item.name;

            if (!fromHistory) {
                // Cut off future history if we're at a branch
                tab.history = tab.history.slice(0, tab.historyIndex + 1);
                tab.history.push(item);
                tab.historyIndex = tab.history.length - 1;
            }
        } catch (e: any) {
            this.errorMsg = `Failed to open folder: ${e.toString()}`;
            console.error(e);
        } finally {
            this.isLoading = false;
        }
    }

    goBack() {
        const tab = this.activeTab;
        if (tab.historyIndex > 0) {
            tab.historyIndex--;
            this.loadFolder(tab.history[tab.historyIndex], true);
        }
    }

    goForward() {
        const tab = this.activeTab;
        if (tab.historyIndex < tab.history.length - 1) {
            tab.historyIndex++;
            this.loadFolder(tab.history[tab.historyIndex], true);
        }
    }

    goUp() {
        const tab = this.activeTab;
        const currentPath = tab.folder.path;
        if (!currentPath || currentPath === "/") return;

        // Simple parent path resolution
        const parts = currentPath.split(/[\\/]/).filter(Boolean);
        if (parts.length === 0) return;

        parts.pop();
        const parentPath = parts.length === 0 ? "" : parts.join("\\") + "\\";
        const parentName = parts[parts.length - 1] || "Local Disk";

        this.loadFolder({
            ...tab.folder,
            id: parentPath || "root",
            name: parentName,
            path: parentPath,
        });
    }

    createTab() {
        const newId = `tab-${Date.now()}`;
        this.tabs.push({
            ...this.tabs[0],
            id: newId,
            name: "New Tab",
            history: [],
            historyIndex: -1
        });
        this.activeTabId = newId;
    }

    closeTab(id: string) {
        if (this.tabs.length <= 1) return;
        const index = this.tabs.findIndex(t => t.id === id);
        this.tabs = this.tabs.filter(t => t.id !== id);
        if (this.activeTabId === id) {
            this.activeTabId = this.tabs[Math.max(0, index - 1)].id;
        }
    }
}

export const tabState = new TabState();
