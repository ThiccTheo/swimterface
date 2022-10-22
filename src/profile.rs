use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Text},
    Context,
};

use crate::{app::App, state::Action};

pub struct Profile {
    src: String,
    name: String,
}

impl Profile {
    pub fn new(mut src: String) -> Self {
        if let Some(index) = src.find('_') {
            let (first_name, last_name) = src.split_at_mut(index);
            let mut full_name = String::new();

            first_name.get_mut(0..1).unwrap().make_ascii_uppercase();
            last_name.get_mut(0..2).unwrap().make_ascii_uppercase();

            full_name += first_name;
            full_name.push(' ');
            full_name += last_name.replace("_", "").as_str();

            Self {
                src,
                name: full_name.replace(".txt", "").trim().to_string(),
            }
        } else {
            panic!();
        }
    }
}

impl EventHandler<Action> for Profile {
    fn update(&mut self, _context: &mut Context) -> Result<(), Action> {
        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text = Text::new(format!("Stats for {}:", self.name.clone()));
        text.set_font("comfortaa_regular");
        text.set_scale(40.0);
        canvas.draw(&text, DrawParam::default().color(Color::BLACK));

        canvas.finish(context).expect("Failed to render!");
        Ok(())
    }
}
