use chrono::Utc;
use reqwest::blocking::Client;
use rusqlite::{params, Connection, Result};
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
    let request = ChatRequest {
        message: message.clone(),
    };

    match client.post(url).json(&request).send() {
        Ok(response) => {
            if let Ok(chat_response) = response.json::<ChatResponse>() {
                save_chat_to_db(&message, &chat_response.response).unwrap();
                Ok(chat_response.response)
            } else {
                Err("Failed to parse response".to_string())
            }
        }
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}

fn initialize_database() -> Result<Connection> {
    let conn = Connection::open("chats.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY,
            message TEXT NOT NULL,
            response TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )",
        [],
    )?;
    Ok(conn)
}

fn save_chat_to_db(message: &str, response: &str) -> Result<()> {
    let conn = initialize_database()?;
    conn.execute(
        "INSERT INTO chats (message, response, timestamp) VALUES (?1, ?2, ?3)",
        params![message, response, Utc::now().to_string()],
    )?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    initialize_database().expect("Failed to initialize database");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![chat_with_ollama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
