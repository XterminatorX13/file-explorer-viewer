import { invoke } from "@tauri-apps/api/core";
import type { FileEntry } from "./types";

// List drives (Root level)
export async function listDrives(): Promise<FileEntry[]> {
    const drives = await invoke<any[]>("list_drives");
    return drives.map((entry) => ({
        ...entry,
        modified: new Date(entry.modified),
        kind: "disk", // Ensure kind is disk
    }));
}

/**
 * Lists files in a given directory.
 */
export async function listFiles(path: string, recursive: boolean = false): Promise<FileEntry[]> {
    try {
        const rawEntries = await invoke<any[]>("list_files", { path, recursive });

        // Map Rust FileEntry to Svelte FileEntry
        return rawEntries.map(entry => ({
            ...entry,
            modified: new Date(entry.modified),
            // 'type' is mapped via #[serde(rename = "type")] in Rust
        }));
    } catch (error) {
        console.error("Failed to list files:", error);
        throw error;
    }
}
