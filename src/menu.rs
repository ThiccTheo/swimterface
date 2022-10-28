use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Rect, Text},
    input::mouse::MouseButton,
    mint::Point2,
    Context,
};

use crate::{
    app::App, course_selection::CourseSelection, state::Action, user_selection::UserSelection,
};

pub struct Menu {
    click_pos: Point2<f32>,
}

impl Menu {
    pub fn new() -> Self {
        Self {
            click_pos: Point2 { x: 0.0, y: 0.0 },
        }
    }
}

impl EventHandler<Action> for Menu {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.mouse.button_just_pressed(MouseButton::Left) {
            self.click_pos = context.mouse.position();
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text1 = Text::new("Swimmer Stats");
        text1.set_scale(100.0);

        let bounds1 = text1.measure(context).expect("Couldn't measure text1");
        let rect1 = Rect::new(300.0, 170.0, bounds1.x, bounds1.y);

        let mut text2 = Text::new("Time Standards");
        text2.set_scale(100.0);

        let bounds2 = text2.measure(context).expect("Couldn't measure text2");
        let rect2 = Rect::new(270.0, 450.0, bounds2.x, bounds2.y);

        let text3 = Text::new("All data is for non-commercial use from:\nCopyright 2009 | collegeswimming.com, LLC All Rights Reserved\nCopyright 2022 | socalswim.org, SCS All Rights Reserved");

        canvas.draw(
            &text1,
            DrawParam::default()
                .color(if rect1.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                })
                .dest(Point2 { x: 300.0, y: 170.0 }),
        );

        canvas.draw(
            &text2,
            DrawParam::default()
                .color(if rect2.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                })
                .dest(Point2 { x: 270.0, y: 450.0 }),
        );

        canvas.draw(
            &text3,
            DrawParam::default()
                .color(Color::BLACK)
                .dest(Point2 { x: 20.0, y: 650.0 })
        );

        canvas.finish(context).expect("Failed to render!");

        if rect1.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(UserSelection::new())))
        } else if rect2.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(CourseSelection::new())))
        } else {
            Ok(())
        }
    }
}
