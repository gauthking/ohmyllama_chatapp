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

#[derive(Serialize, Deserialize)]
struct ChatMessage {
    senderMsg: String,
    AiRes: String,
}

#[derive(Serialize, Deserialize)]
struct Chat {
    chatId: i32,
    chatTitle: String,
    createdAt: String,
    messages: Option<Vec<ChatMessage>>,
}

#[tauri::command]
fn delete_chat(chatId: i32) -> Result<String, String> {
    println!("Attempting to delete chat with id: {}", chatId);
    match initialize_database() {
        Ok(conn) => {
            //  delete associated messages
            conn.execute("DELETE FROM messages WHERE chat_id = ?1", params![chatId])
                .map_err(|e| format!("Failed to delete messages: {}", e))?;

            //  delete the chat
            let rows_affected = conn
                .execute("DELETE FROM chats WHERE id = ?1", params![chatId])
                .map_err(|e| format!("Failed to delete chat: {}", e))?;

            if rows_affected > 0 {
                Ok("Chat deleted successfully!".to_string())
            } else {
                Err("Chat not found".to_string())
            }
        }
        Err(err) => Err(format!("Failed to connect to database: {}", err)),
    }
}

#[tauri::command]
fn chat_with_ollama(message: String, chat_id: Option<i32>) -> Result<String, String> {
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
                let chat_title = format!("Chat {}", chat_id.unwrap_or(0));
                save_chat_to_db(chat_id.unwrap_or(0), Some(message), &chat_response.response)
                    .map_err(|e| e.to_string())?;
                Ok(chat_response.response)
            } else {
                Err("Failed to parse response".to_string())
            }
        }
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}

#[tauri::command]
fn create_new_chat(title: String) -> Result<i32, String> {
    let chat_id = save_chat_to_db(0, Some("".to_string()), "No response yet").unwrap();

    Ok(chat_id)
}

#[tauri::command]
fn fetch_chat_history() -> Result<Vec<Chat>, String> {
    let conn = initialize_database().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, chat_title, created_at FROM chats")
        .map_err(|e| e.to_string())?;

    let chat_iter = stmt
        .query_map([], |row| {
            let chat_id: i32 = row.get(0)?;
            Ok(Chat {
                chatId: chat_id,
                chatTitle: row.get(1)?,
                createdAt: row.get(2)?,
                messages: Some(fetch_chat_messages(chat_id)),
            })
        })
        .map_err(|e| e.to_string())?;

    let mut chats = Vec::new();
    for chat in chat_iter {
        chats.push(chat.map_err(|e| e.to_string())?);
    }
    Ok(chats)
}

fn initialize_database() -> Result<Connection> {
    let conn = Connection::open("chats.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY,
            chat_title TEXT NOT NULL,
            created_at TEXT NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            chat_id INTEGER,
            sender_msg TEXT NOT NULL,
            ai_res TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
        )",
        [],
    )?;
    Ok(conn)
}

fn save_chat_to_db(chat_id: i32, sender_msg: Option<String>, response: &str) -> Result<i32> {
    let conn = initialize_database()?;
    let timestamp = Utc::now().to_string();

    let new_chat_id = if chat_id == 0 {
        // crete a new chat if chat_id is 0 (new chat)
        let new_chat_title = "New Chat".to_string();
        conn.execute(
            "INSERT INTO chats (chat_title, created_at) VALUES (?1, ?2)",
            params![new_chat_title, timestamp],
        )?;
        conn.last_insert_rowid() as i32
    } else {
        chat_id
    };

    conn.execute(
        "INSERT INTO messages (chat_id, sender_msg, ai_res, timestamp) VALUES (?1, ?2, ?3, ?4)",
        params![new_chat_id, sender_msg, response, timestamp],
    )?;

    Ok(new_chat_id)
}

fn fetch_chat_messages(chat_id: i32) -> Vec<ChatMessage> {
    let conn = initialize_database().expect("Failed to initialize DB");
    let mut stmt = conn
        .prepare("SELECT sender_msg, ai_res FROM messages WHERE chat_id = ?1 ORDER BY id ASC")
        .unwrap();

    let message_iter = stmt
        .query_map([chat_id], |row| {
            Ok(ChatMessage {
                senderMsg: row.get(0)?,
                AiRes: row.get(1)?,
            })
        })
        .unwrap();

    message_iter.map(|msg| msg.unwrap()).collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    initialize_database().expect("Failed to initialize database");
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            chat_with_ollama,
            create_new_chat,
            fetch_chat_history,
            delete_chat
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
