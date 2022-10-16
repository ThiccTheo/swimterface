use crate::state::{State, Action};

use std::time::{Duration, Instant};

use ggez::{
    event::EventHandler,
    graphics::{Canvas, CanvasLoadOp, Color, DrawParam, Image},
    mint::Point2,
    Context, GameError,
};

pub struct SplashScreen {
    logo: Image,
    timer: Instant,
    duration: Duration,
}

impl SplashScreen {
    pub fn new(context: &Context) -> Self {
        Self {
            logo: Image::from_path(context, "\\transparent_logo.png")
                .expect("Failed to create image!"),
            timer: Instant::now(),
            duration: Duration::from_secs(5),
        }
    }
}

impl EventHandler<Action> for SplashScreen {
    fn update(&mut self, _context: &mut Context) -> Result<(), Action> {
        Ok(())
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), Action> {
        let mut canvas =
            Canvas::from_frame(context, CanvasLoadOp::Clear(Color::from_rgb(219, 240, 254)));

        canvas.draw(
            &self.logo,
            DrawParam::default()
                .scale(Point2 { x: 0.5, y: 0.5 })
                .dest(Point2 {
                    x: context.gfx.size().0 / 2.0 - (self.logo.width() / 4) as f32,
                    y: context.gfx.size().1 / 2.0 - (self.logo.height() / 4) as f32,
                }),
        );

        canvas.finish(context).expect("Failed to render!");

        if self.timer.elapsed().as_secs() == self.duration.as_secs() {
            Err(Action::Destroy)
        } else {
            Ok(())
        }
    }
}
