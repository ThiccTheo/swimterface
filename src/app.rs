use crate::state::{Action, State};
use std::collections::VecDeque;
use ggez::{event::EventHandler, Context, GameError};

pub struct App {
    states: Vec<State>,
    actions: VecDeque<Action>,
}

impl App {
    pub fn new() -> Self {
        Self {
            states: Vec::<State>::new(),
            actions: VecDeque::<Action>::new(),
        }
    }

    pub fn add_action(&mut self, action: Action) {
        self.actions.push_back(action);
        println!("Actions: {}, States: {}", &self.actions.len(), &self.states.len());
    }

    fn refresh(&mut self) {
        while let Some(action) = self.actions.pop_front() {
            match action {
                Action::Error(msg) => panic!("{msg}"),
                Action::Create(state) => self.states.push(state),
                Action::Destroy => drop(self.states.pop()),
                Action::Change(state) => {
                    self.states.pop();
                    self.states.push(state);
                }
            }

            println!("Actions: {}, States: {}", &self.actions.len(), &self.states.len());
        }
    }
}

impl EventHandler<()> for App {
    fn update(&mut self, context: &mut Context) -> Result<(), ()> {
        self.refresh();

        let index = self.states.len() - 1;
        match self.states[index].update(context) {
            Ok(()) => Ok(()),
            Err(_) => Err(()),
        }
    }

    fn draw(&mut self, context: &mut Context) -> Result<(), ()> {
        let index = self.states.len() - 1;
        match self.states[index].draw(context) {
            Ok(()) => Ok(()),
            Err(action) => Ok(self.add_action(action)),
        }
    }
}