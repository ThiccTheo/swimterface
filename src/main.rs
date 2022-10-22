mod app;
mod profile;
mod splash_screen;
mod state;
mod user_selection;

use app::App;
use ggez::{
    conf::{/*FullscreenType, */ WindowMode, WindowSetup},
    event::run,
    ContextBuilder, graphics::FontData,
};
use splash_screen::SplashScreen;
use state::Action;
use std::path::PathBuf;

fn main() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let mut resource_path = root.clone();
    resource_path.push("assets");

    let context_builder =
        ContextBuilder::new("Swimterface", "Theo Lee").add_resource_path(resource_path);

    let window_setup = WindowSetup::default()
        .title("Swimterface")
        .icon("\\images\\transparent_logo.png")
        .vsync(true);

    let window_mode = WindowMode::default().dimensions(1280.0, 720.0);
    //.fullscreen_type(FullscreenType::True);

    let (mut context, event_loop) = context_builder
        .window_setup(window_setup)
        .window_mode(window_mode)
        .build()
        .expect("Could not start application!");

    context.gfx.add_font("comfortaa_regular", FontData::from_path(&context, "\\fonts\\comfortaa_regular.ttf").unwrap());
    let mut app = App::new();
    app.add_action(Action::Create(Box::new(SplashScreen::new(&context))));

    run(context, event_loop, app);
}
