// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use log::{debug, error, info, warn};

fn main() {
    ohmyllama_lib::run();
    env_logger::init();
}
