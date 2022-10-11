use std::process::Command;
use ggez::{self, ContextBuilder, event::{EventHandler, self}, GameError, Context, graphics::Rect};

struct Game {}

impl Game {
    fn new(_context: &mut Context) -> Self {
        Self {}
    }
}

impl EventHandler for Game {
    fn update(&mut self, _context: &mut ggez::Context) -> Result<(), GameError> {
        Ok(())
    }

    fn draw(&mut self, _context: &mut ggez::Context) -> Result<(), GameError> {
        let rect = Rect::new(0.0, 0.0, 20.0, 20.0);
        Ok(())
    }
}

fn main() {
    let cmd = "python3";
    let script = "src/main.py";

    Command::new(cmd)
        .arg(script)
        .spawn()
        .expect("{cmd} command failed to start!");

    // let raw_contents = fs::read_to_string("src/test.txt")
    //     .expect("Could not open file!");

    // println!("{raw_contents}");

    let (mut context, event_loop) = ContextBuilder::new("Swimterface", "Theo Lee")
        .build()
        .expect("Failed to create application context!");

    let game = Game::new(&mut context);
    event::run(context, event_loop, game);
}
