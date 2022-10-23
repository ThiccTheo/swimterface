use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Text},
    input::keyboard::KeyCode,
    mint::Point2,
    Context,
};

use crate::{app::App, state::Action, user_selection::UserSelection};

pub struct Menu {
    is_active: bool,
}

impl Menu {
    pub fn new() -> Self {
        Self { is_active: true }
    }
}

impl EventHandler<Action> for Menu {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.keyboard.is_key_just_pressed(KeyCode::Space) {
            self.is_active = false;
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text1 = Text::new("Swimmer Stats");
        text1.set_scale(100.0);

        let mut text2 = Text::new("Time Standards");
        text2.set_scale(100.0);

        canvas.draw(
            &text1,
            DrawParam::default()
                .color(Color::BLACK)
                .dest(Point2 { x: 300.0, y: 170.0 }),
        );
        canvas.draw(
            &text2,
            DrawParam::default()
                .color(Color::BLACK)
                .dest(Point2 { x: 270.0, y: 450.0 }),
        );

        canvas.finish(context).expect("Failed to render!");

        if !self.is_active {
            self.is_active = true;
            Err(Action::Create(Box::new(UserSelection::new())))
        } else {
            Ok(())
        }
    }
}
