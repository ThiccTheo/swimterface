use std::{fs::read_to_string, path::PathBuf};

use crate::{app::App, state::Action};
use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Text},
    input::keyboard::KeyCode,
    mint::Point2,
    Context,
};

pub struct MenLcm {
    is_active: bool,
    data: String,
}

impl MenLcm {
    pub fn new() -> Self {
        let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let mut src = root.clone();
        src.push("assets\\data\\men_lcm_formatted.txt");

        Self {
            is_active: true,
            data: read_to_string(src).expect("Failed to read file!"),
        }
    }
}

impl EventHandler<Action> for MenLcm {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.keyboard.is_key_just_pressed(KeyCode::Space) {
            self.is_active = false;
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text = Text::new("Men LCM Time Standards:\n\n");
        text.add(self.data.clone());
        text.set_scale(14.7);
        text.set_bounds(Point2 {
            x: context.gfx.size().0,
            y: context.gfx.size().1,
        });

        canvas.draw(&text, DrawParam::default().color(Color::BLACK));

        canvas.finish(context).expect("Failed to render!");

        if !self.is_active {
            Err(Action::Destroy)
        } else {
            Ok(())
        }
    }
}
