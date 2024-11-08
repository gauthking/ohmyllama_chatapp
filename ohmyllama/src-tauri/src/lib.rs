use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ChatRequest {
    message: String,
}

#[derive(Serialize, Deserialize)]
struct ChatResponse {
    response: String,
}

#[tauri::command]
fn chat_with_ollama(message: String) -> Result<String, String> {
    let client = Client::builder()
        .timeout(std::time::Duration::from_secs(60))
        .build()
        .unwrap();
    let url = "http://127.0.0.1:8000/api/v1/chat";
    let request = ChatRequest { message };

    match client.post(url).json(&request).send() {
        Ok(response) => {
            if let Ok(chat_response) = response.json::<ChatResponse>() {
                Ok(chat_response.response)
            } else {
                Err("Failed to parse response".to_string())
            }
        }
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![chat_with_ollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
