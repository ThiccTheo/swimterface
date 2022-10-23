use std::{fs::read_to_string, path::PathBuf};

use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Text},
    input::keyboard::KeyCode,
    mint::Point2,
    Context,
};

use crate::{app::App, state::Action, user_selection::UserSelection};

pub struct Profile {
    name: String,
    data: String,
    is_active: bool,
}

impl Profile {
    pub fn new(mut src: String) -> Self {
        if let Some(index) = src.find('_') {
            let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
            let mut path = root.clone();
            let fmt = String::from("assets\\data\\");
            path.push(fmt + &src);

            let (first_name, last_name) = src.split_at_mut(index);
            let mut full_name = String::new();

            first_name.get_mut(..1).unwrap().make_ascii_uppercase();
            last_name.get_mut(..2).unwrap().make_ascii_uppercase();

            full_name += first_name;
            full_name.push(' ');
            full_name += last_name.replace("_", "").as_str();

            let data = read_to_string(path).expect("Failed to read data!");

            Self {
                name: full_name.replace("formatted.txt", "").trim().to_string(),
                data,
                is_active: true,
            }
        } else {
            panic!();
        }
    }
}

impl EventHandler<Action> for Profile {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.keyboard.is_key_just_pressed(KeyCode::Space) {
            self.is_active = false;
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text = Text::new(format!("Stats for {}:\n", self.name.clone()));
        text.add(self.data.clone());
        text.set_scale(26.0);
        text.set_bounds(Point2 {
            x: context.gfx.size().0,
            y: context.gfx.size().1,
        });
        canvas.draw(&text, DrawParam::default().color(Color::BLACK));

        canvas.finish(context).expect("Failed to render!");

        if !self.is_active {
            Err(Action::Change(Box::new(UserSelection::new())))
        } else {
            Ok(())
        }
    }
}
