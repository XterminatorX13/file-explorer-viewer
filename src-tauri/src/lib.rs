mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_files, 
            list_drives, 
            rename_item, 
            delete_item, 
            create_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
