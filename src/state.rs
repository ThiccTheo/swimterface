use std::fmt::{Debug, Formatter, Result as FmtResult};

use ggez::event::EventHandler;

pub type State = Box<dyn EventHandler<Action>>;

pub enum Action {
    Error(String),
    Create(State),
    Destroy,
    Change(State),
}

impl Debug for Action {
    fn fmt(&self, _formatter: &mut Formatter<'_>) -> FmtResult {
        todo!()
    }
}