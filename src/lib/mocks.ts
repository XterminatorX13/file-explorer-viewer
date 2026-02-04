import type { FileEntry } from "./types";

export const MOCK_SYSTEM_FOLDERS: FileEntry[] = [
    {
        id: "docs",
        name: "Documents",
        path: "C:/Users/User/Documents",
        type: "folder",
        specialType: "documents",
        size: 0,
        modified: new Date(),
        extension: "",
        tags: []
    },
    {
        id: "downloads",
        name: "Downloads",
        path: "C:/Users/User/Downloads",
        type: "folder",
        specialType: "downloads",
        size: 0,
        modified: new Date(),
        extension: "",
        tags: []
    },
    {
        id: "pics",
        name: "Pictures",
        path: "C:/Users/User/Pictures",
        type: "folder",
        specialType: "pictures",
        size: 0,
        modified: new Date(),
        extension: "",
        tags: []
    },
    {
        id: "vid",
        name: "Videos",
        path: "C:/Users/User/Videos",
        type: "folder",
        specialType: "videos",
        size: 0,
        modified: new Date(),
        extension: "",
        tags: []
    },
    {
        id: "file1",
        name: "Project_Proposal.pdf",
        path: "C:/file1.pdf",
        type: "file",
        size: 2450000,
        modified: new Date(),
        extension: "pdf",
        tags: ["Work"]
    },
    {
        id: "file2",
        name: "System_Config.yaml",
        path: "C:/file2.yaml",
        type: "file",
        size: 1200,
        modified: new Date(),
        extension: "yaml",
        tags: ["System"]
    },
];

export const MOCK_FOLDER_CONTENTS: Record<string, FileEntry[]> = {
    "docs": [
        { id: "work", name: "Work", path: "C:/Docs/Work", type: "folder", size: 0, modified: new Date(), extension: "", tags: [] },
        { id: "personal", name: "Personal", path: "C:/Docs/Personal", type: "folder", size: 0, modified: new Date(), extension: "", tags: [] },
        { id: "resume", name: "Resume_2024.docx", path: "C:/Docs/resume.docx", type: "file", size: 45000, modified: new Date(), extension: "docx", tags: ["Important"] },
    ],
    "downloads": [
        { id: "nexus", name: "nexus_explorer_setup.exe", path: "C:/Down/nexus.exe", type: "file", size: 85000000, modified: new Date(), extension: "exe", tags: ["Software"] },
        { id: "zip", name: "assets_bundle.zip", path: "C:/Down/bundle.zip", type: "file", size: 120000000, modified: new Date(), extension: "zip", tags: [] },
    ],
    "work": [
        { id: "proj1", name: "Project Nexus", path: "C:/Docs/Work/Nexus", type: "folder", size: 0, modified: new Date(), extension: "", tags: ["Active"] },
        { id: "fin", name: "Financials_Q4.xlsx", path: "C:/Docs/Work/fin.xlsx", type: "file", size: 15600, modified: new Date(), extension: "xlsx", tags: ["Private"] },
    ]
};

export async function getMockFiles(id: string): Promise<FileEntry[] | null> {
    return MOCK_FOLDER_CONTENTS[id] || null;
}
