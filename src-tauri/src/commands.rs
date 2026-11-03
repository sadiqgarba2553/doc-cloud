use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub publisher: String,
    pub os: String,
    pub arch: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DocumentMetadataRecord {
    pub id: String,
    pub title: String,
    pub path: Option<String>,
    pub word_count: usize,
    pub character_count: usize,
    pub page_count: usize,
    pub created_at: String,
    pub updated_at: String,
    pub pinned: bool,
}

#[command]
pub fn get_app_info() -> AppInfo {
    AppInfo {
        name: "Doc Cloud".to_string(),
        version: "1.0.0".to_string(),
        publisher: "BlueCloud AI Technologies".to_string(),
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}

#[command]
pub fn read_file_content(path: String) -> Result<String, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    fs::read_to_string(p).map_err(|e| format!("Failed to read file: {}", e))
}

#[command]
pub fn write_file_atomic(path: String, content: String) -> Result<(), String> {
    write_atomic_bytes(&path, content.as_bytes())
}

#[command]
pub fn read_binary_file(path: String) -> Result<Vec<u8>, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    let mut file = File::open(p).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("Failed to read binary data: {}", e))?;
    Ok(buffer)
}

#[command]
pub fn write_binary_file_atomic(path: String, data: Vec<u8>) -> Result<(), String> {
    write_atomic_bytes(&path, &data)
}


fn write_atomic_bytes(path: &str, data: &[u8]) -> Result<(), String> {
    let destination = Path::new(path);
    let parent = destination.parent().filter(|p| !p.as_os_str().is_empty()).unwrap_or(Path::new("."));
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    let mut temporary = tempfile::NamedTempFile::new_in(parent).map_err(|e| e.to_string())?;
    temporary.write_all(data).map_err(|e| e.to_string())?;
    temporary.as_file().sync_all().map_err(|e| e.to_string())?;
    temporary.persist(destination).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn atomic_save_replaces_existing_file_and_preserves_unicode() {
        let directory = tempfile::tempdir().unwrap();
        let target = directory.path().join("document.dcloud");
        let path = target.to_str().unwrap().to_owned();
        write_file_atomic(path.clone(), "First draft".into()).unwrap();
        write_file_atomic(path.clone(), "Revised 世界".into()).unwrap();
        assert_eq!(read_file_content(path).unwrap(), "Revised 世界");
        assert_eq!(fs::read_dir(directory.path()).unwrap().count(), 1);
    }

    #[test]
    fn binary_save_round_trips_and_creates_parent_directories() {
        let directory = tempfile::tempdir().unwrap();
        let target = directory.path().join("nested/document.dcloud");
        let path = target.to_str().unwrap().to_owned();
        let data = vec![0, 1, 255, 42];
        write_binary_file_atomic(path.clone(), data.clone()).unwrap();
        assert_eq!(read_binary_file(path).unwrap(), data);
    }
}
