#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_app_info,
            commands::read_file_content,
            commands::write_file_atomic,
            commands::read_binary_file,
            commands::write_binary_file_atomic
        ])
        .run(tauri::generate_context!())
        .expect("error while running Doc Cloud application");
}
