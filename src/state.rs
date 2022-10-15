use ggez::event::EventHandler;

pub type State = Box<dyn EventHandler>;

pub enum Action {
    None,
    Error,
    Create(State),
    Destroy,
    Change(State),
}
