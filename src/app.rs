use crate::state::{Action, State};
use ggez::{event::EventHandler, graphics::Color, Context};
use std::collections::VecDeque;

pub struct App {
    states: Vec<State>,
    actions: VecDeque<Action>,
}

impl App {
    pub const BG_COLOR: Color =
        Color::new(200.0 / 255.0, 240.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0);

    pub const SELECTION_COLOR: Color =
        Color::new(7.0 / 255.0, 58.0 / 255.0, 175.0 / 255.0, 255.0 / 255.0);

    pub fn new() -> Self {
        Self {
            states: Vec::<State>::new(),
            actions: VecDeque::<Action>::new(),
        }
    }

    pub fn add_action(&mut self, action: Action) {
        self.actions.push_back(action);
    }

    fn refresh(&mut self) {
        while let Some(action) = self.actions.pop_front() {
            match action {
                Action::Create(state) => self.states.push(state),
                Action::Destroy => drop(self.states.pop()),
                Action::Change(state) => {
                    self.states.pop();
                    self.states.push(state);
                }
            }
        }
    }
}

impl EventHandler<()> for App {
    fn update(&mut self, context: &mut Context) -> Result<(), ()> {
        self.refresh();

        let index = (self.states.len() - 1).clamp(0, usize::MAX);
        match self.states[index].update(context) {
            Ok(()) => Ok(()),
            Err(_) => Err(()),
        }
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), ()> {
        let index = (self.states.len() - 1).clamp(0, usize::MAX);
        match self.states[index].draw(context) {
            Ok(()) => Ok(()),
            Err(action) => Ok(self.add_action(action)),
        }
    }
}
