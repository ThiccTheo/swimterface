use std::{path::PathBuf, process::Command};

use crate::{state::Action, app::App, profile::Profile};
use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Text, DrawParam, Color},
    input::keyboard::KeyCode,
    Context, mint::Point2,
};

pub struct UserSelection {
    user_id: String,
    is_entered: bool,
}

impl UserSelection {
    pub fn new() -> Self {
        Self {
            user_id: String::new(),
            is_entered: false,
        }
    }
}

impl EventHandler<Action> for UserSelection {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.keyboard.is_key_just_pressed(KeyCode::Key0) {
            self.user_id.push('0');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key1) {
            self.user_id.push('1');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key2) {
            self.user_id.push('2');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key3) {
            self.user_id.push('3');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key4) {
            self.user_id.push('4');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key5) {
            self.user_id.push('5');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key6) {
            self.user_id.push('6');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key7) {
            self.user_id.push('7');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key8) {
            self.user_id.push('8');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Key9) {
            self.user_id.push('9');
        } else if context.keyboard.is_key_just_pressed(KeyCode::Back) {
            self.user_id.pop();
        } else if context.keyboard.is_key_just_pressed(KeyCode::Return) && self.user_id.len() > 0 {
            self.is_entered = true;
        }

        while self.user_id.len() > 7 {
            self.user_id.pop();
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas =
            Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text = Text::new("Enter a Swimcloud ID (number in URL):\n\n");
        text.add(self.user_id.clone().as_str());
        text.set_scale(70.0);
        text.set_font("comfortaa_regular");
        canvas.draw(&text, DrawParam::default().dest(Point2 { x: 0.0, y: 0.0 }).color(Color::BLACK));

        canvas.finish(context).expect("Failed to render!");

        if self.is_entered {
            let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
            let command = "python3";

            let mut script = root.clone();
            script.push("src\\main.py");

            let output = Command::new(command)
                .args([script.to_str().unwrap(), self.user_id.trim()])
                .output()
                .expect("{cmd} command failed to start!");

            let mut src = String::new();

            for ascii_value in output.stdout {
                src.push(ascii_value as char);
            }

            println!("{src}");
            
            Err(Action::Create(Box::new(Profile::new(src))))

        } else {
            Ok(())
        }
    }
}
