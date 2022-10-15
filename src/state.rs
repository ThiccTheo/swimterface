use ggez::event::EventHandler;

pub type State = Box<dyn EventHandler>;

pub enum Action {
    None,
    Error(String),
    Create(State),
    Destroy,
    Change(State),
}
