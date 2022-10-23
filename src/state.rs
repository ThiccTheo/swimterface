use ggez::event::EventHandler;
use std::fmt::{Debug, Formatter, Result as FmtResult};

pub type State = Box<dyn EventHandler<Action>>;

pub enum Action {
    Create(State),
    Destroy,
    Change(State),
}

impl Debug for Action {
    fn fmt(&self, _formatter: &mut Formatter<'_>) -> FmtResult {
        todo!()
    }
}
