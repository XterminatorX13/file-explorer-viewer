use serde::{Serialize, Deserialize};
use std::fs;
use std::time::UNIX_EPOCH;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FileEntry {
    pub id: String,
    pub name: String,
    pub path: String,
    pub extension: String,
    pub size: u64,
    pub modified: String,
    #[serde(rename = "type")]
    pub kind: String, // "file", "folder", or "disk"
    pub tags: Vec<String>,
    pub children: Option<Vec<FileEntry>>,
}

#[tauri::command]
pub fn list_files(path: String, recursive: bool) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();
    
    let target_path = std::path::Path::new(&path);
    if !target_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if !recursive {
        let read_dir = fs::read_dir(target_path).map_err(|e| e.to_string())?;
        for entry in read_dir {
            let entry = entry.map_err(|e| e.to_string())?;
            let metadata = entry.metadata().map_err(|e| e.to_string())?;
            
            let name = entry.file_name().to_string_lossy().into_owned();
            let kind = if metadata.is_dir() { "folder" } else { "file" };
            let extension = entry.path().extension()
                .map(|s| s.to_string_lossy().into_owned())
                .unwrap_or_default();
            
            let modified = metadata.modified().unwrap_or(UNIX_EPOCH);
            let datetime: DateTime<Utc> = modified.into();
            
            entries.push(FileEntry {
                id: entry.path().to_string_lossy().into_owned(),
                name,
                path: entry.path().to_string_lossy().into_owned(),
                extension,
                size: metadata.len(),
                modified: datetime.to_rfc3339(),
                kind: kind.to_string(),
                tags: Vec::new(),
                children: None,
            });
        }
    }
    Ok(entries)
}

#[tauri::command]
pub fn rename_item(path: String, new_name: String) -> Result<String, String> {
    let old_path = std::path::Path::new(&path);
    let parent = old_path.parent().ok_or("Invalid path")?;
    let new_path = parent.join(&new_name);

    if new_path.exists() {
        return Err("Destination already exists".to_string());
    }

    std::fs::rename(&old_path, &new_path).map_err(|e| e.to_string())?;
    Ok(new_path.to_string_lossy().into_owned())
}

#[tauri::command]
pub fn delete_item(path: String) -> Result<(), String> {
    trash::delete(&path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn create_folder(path: String) -> Result<String, String> {
    let target = std::path::Path::new(&path);
    if target.exists() {
         return Err("Folder already exists".to_string());
    }
    std::fs::create_dir_all(target).map_err(|e| e.to_string())?;
    Ok(path)
}

#[tauri::command]
pub fn list_drives() -> Result<Vec<FileEntry>, String> {
    let mut drives = Vec::new();
    
    // Force add C: for debugging
    drives.push(FileEntry {
        id: "C:\\".to_string(),
        name: "Local Disk (C:)".to_string(),
        path: "C:\\".to_string(),
        extension: "".to_string(),
        size: 0,
        modified: Utc::now().to_rfc3339(),
        kind: "disk".to_string(),
        tags: Vec::new(),
        children: None,
    });

    for c in b'D'..=b'Z' {
        let drive_letter = c as char;
        let path = format!("{}:\\", drive_letter);
        if std::path::Path::new(&path).exists() {
            drives.push(FileEntry {
                id: path.clone(),
                name: format!("Local Disk ({}:)", drive_letter),
                path: path.clone(),
                extension: "".to_string(),
                size: 0,
                modified: Utc::now().to_rfc3339(),
                kind: "disk".to_string(),
                tags: Vec::new(),
                children: None,
            });
        }
    }

    Ok(drives)
}
