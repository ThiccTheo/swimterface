use crate::{
    app::App, men_lcm::MenLcm, men_scy::MenScy, state::Action, women_lcm::WomenLcm,
    women_scy::WomenScy,
};
use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Rect, Text},
    input::{keyboard::KeyCode, mouse::MouseButton},
    mint::Point2,
    Context,
};

pub struct CourseSelection {
    is_active: bool,
    click_pos: Point2<f32>,
}

impl CourseSelection {
    pub fn new() -> Self {
        Self {
            is_active: true,
            click_pos: Point2 { x: 0.0, y: 0.0 },
        }
    }
}

impl EventHandler<Action> for CourseSelection {
    fn update(&mut self, context: &mut Context) -> Result<(), Action> {
        if context.keyboard.is_key_just_pressed(KeyCode::Space) {
            self.is_active = false;
        }

        if context.mouse.button_just_pressed(MouseButton::Left) {
            self.click_pos = context.mouse.position();
        }

        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas = Canvas::from_frame(context, CanvasLoadOp::Clear(App::BG_COLOR));

        let mut text1 = Text::new("Choose a course:");
        text1.set_scale(100.0);

        let mut text2 = Text::new("Men SCY");
        text2.set_scale(100.0);
        let bounds1 = text2.measure(context).expect("Couldn't measure text1");
        let rect1 = Rect::new(100.0, 270.0, bounds1.x, bounds1.y);

        let mut text3 = Text::new("Men LCM");
        text3.set_scale(100.0);
        let bounds2 = text3.measure(context).expect("Couldn't measure text1");
        let rect2 = Rect::new(100.0, 470.0, bounds2.x, bounds2.y);

        let mut text4 = Text::new("Women SCY");
        text4.set_scale(100.0);
        let bounds3 = text4.measure(context).expect("Couldn't measure text1");
        let rect3 = Rect::new(710.0, 270.0, bounds3.x, bounds3.y);

        let mut text5 = Text::new("Women LCM");
        text5.set_scale(100.0);
        let bounds4 = text5.measure(context).expect("Couldn't measure text1");
        let rect4 = Rect::new(710.0, 470.0, bounds4.x, bounds4.y);

        canvas.draw(
            &text1,
            DrawParam::default()
                .dest(Point2 { x: 210.0, y: 70.0 })
                .color(Color::BLACK),
        );

        canvas.draw(
            &text2,
            DrawParam::default()
                .dest(Point2 { x: 100.0, y: 270.0 })
                .color(if rect1.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                }),
        );

        canvas.draw(
            &text3,
            DrawParam::default()
                .dest(Point2 { x: 100.0, y: 470.0 })
                .color(if rect2.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                }),
        );

        canvas.draw(
            &text4,
            DrawParam::default()
                .dest(Point2 { x: 710.0, y: 270.0 })
                .color(if rect3.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                }),
        );

        canvas.draw(
            &text5,
            DrawParam::default()
                .dest(Point2 { x: 710.0, y: 470.0 })
                .color(if rect4.contains(context.mouse.position()) {
                    App::SELECTION_COLOR
                } else {
                    Color::BLACK
                }),
        );

        canvas.finish(context).expect("Failed to render!");

        if !self.is_active {
            Err(Action::Destroy)
        } else if rect1.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(MenScy::new())))
        } else if rect2.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(MenLcm::new())))
        } else if rect3.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(WomenScy::new())))
        } else if rect4.contains(self.click_pos.clone()) {
            self.click_pos = Point2 { x: 0.0, y: 0.0 };
            Err(Action::Create(Box::new(WomenLcm::new())))
        } else {
            Ok(())
        }
    }
}
