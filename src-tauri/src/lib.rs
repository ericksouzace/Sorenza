use serde::Serialize;
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CodespaceSummary {
    name: String,
    repository: String,
    state: String,
}

fn validate_codespace_name(name: &str) -> Result<(), String> {
    if name.is_empty() || name.len() > 128 {
        return Err("Invalid codespace name.".to_string());
    }
    if !name
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
    {
        return Err("Codespace name contains unsupported characters.".to_string());
    }
    Ok(())
}

#[tauri::command]
fn list_codespaces() -> Result<Vec<CodespaceSummary>, String> {
    let output = Command::new("gh")
        .args(["codespace", "list", "--json", "name,repository,state", "--limit", "30"])
        .output()
        .map_err(|_| "GitHub CLI is not installed or could not be executed.".to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).trim().to_string());
    }

    let values: Vec<serde_json::Value> = serde_json::from_slice(&output.stdout)
        .map_err(|_| "GitHub CLI returned an unexpected response.".to_string())?;

    Ok(values
        .into_iter()
        .filter_map(|value| {
            let name = value.get("name")?.as_str()?.to_string();
            let state = value
                .get("state")
                .and_then(serde_json::Value::as_str)
                .unwrap_or("Unknown")
                .to_string();
            let repository = value
                .get("repository")
                .and_then(|repository| {
                    repository
                        .get("fullName")
                        .and_then(serde_json::Value::as_str)
                        .or_else(|| repository.as_str())
                })
                .unwrap_or("Unknown repository")
                .to_string();
            Some(CodespaceSummary {
                name,
                repository,
                state,
            })
        })
        .collect())
}

#[tauri::command]
fn open_codespace_in_vscode(name: String) -> Result<(), String> {
    validate_codespace_name(&name)?;
    let status = Command::new("gh")
        .args(["codespace", "code", "-c", &name])
        .status()
        .map_err(|_| "Could not launch GitHub CLI.".to_string())?;
    if !status.success() {
        return Err("GitHub CLI could not open the selected codespace.".to_string());
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            let salt_path = app
                .path()
                .app_local_data_dir()
                .map_err(|error| error.to_string())?
                .join("stronghold-salt.txt");
            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![list_codespaces, open_codespace_in_vscode])
        .run(tauri::generate_context!())
        .expect("error while running Sorenza");
}

#[cfg(test)]
mod tests {
    use super::validate_codespace_name;

    #[test]
    fn accepts_safe_codespace_names() {
        assert!(validate_codespace_name("pijama-de-rica-123").is_ok());
    }

    #[test]
    fn rejects_shell_metacharacters() {
        assert!(validate_codespace_name("safe;rm-rf").is_err());
        assert!(validate_codespace_name("$(whoami)").is_err());
    }
}
