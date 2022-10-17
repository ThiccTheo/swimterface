mod app;
mod profile;
mod splash_screen;
mod state;
mod user_selection;

use app::App;
use ggez::{
    conf::{/*FullscreenType, */ WindowMode, WindowSetup},
    event::run,
    ContextBuilder,
};
use splash_screen::SplashScreen;
use state::Action;
use std::path::PathBuf;

fn main() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let mut resource_path = root.clone();
    resource_path.push("assets\\images");

    let context_builder =
        ContextBuilder::new("Swimterface", "Theo Lee").add_resource_path(resource_path);

    let window_setup = WindowSetup::default()
        .title("Swimterface")
        .icon("\\transparent_logo.png")
        .vsync(true);

    let window_mode = WindowMode::default().dimensions(1280.0, 720.0);
    //.fullscreen_type(FullscreenType::True);

    let (context, event_loop) = context_builder
        .window_setup(window_setup)
        .window_mode(window_mode)
        .build()
        .expect("Could not start application!");

    let mut app = App::new();
    app.add_action(Action::Create(Box::new(SplashScreen::new(&context))));

    run(context, event_loop, app);
}
