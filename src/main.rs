mod splash_screen;

use ggez::{
    conf::{FullscreenType, WindowMode, WindowSetup},
    event::run,
    ContextBuilder,
};
use splash_screen::SplashScreen;
use std::{
    io::{stdin, stdout, Write},
    path::PathBuf,
    process::Command,
};

fn main() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let command = "python3";

    let mut script = root.clone();
    script.push("src\\main.py");

    let mut swimmer_id = String::new();
    print!("Enter your swimmer id: ");

    stdout().flush().expect("Failed to flush stream buffer!");

    stdin()
        .read_line(&mut swimmer_id)
        .expect("Could not read input!");

    Command::new(command)
        .args([script.to_str().unwrap(), swimmer_id.trim()])
        .status()
        .expect("{cmd} command failed to start!");

    let mut resource_path = root.clone();
    resource_path.push("assets");

    let context_builder =
        ContextBuilder::new("Swimterface", "Theo Lee").add_resource_path(resource_path);

    let window_setup = WindowSetup::default()
        .title("Swimterface")
        .icon("\\logo.png")
        .vsync(true);

    let window_mode = WindowMode::default()
        .dimensions(1280.0, 720.0);
        //.fullscreen_type(FullscreenType::True);

    let (mut context, event_loop) = context_builder
        .window_setup(window_setup)
        .window_mode(window_mode)
        .build()
        .expect("Could not start application!");

    let splash_screen = SplashScreen::new(&mut context);
    run(context, event_loop, splash_screen);
}
