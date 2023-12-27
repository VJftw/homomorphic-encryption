mod app;
mod home;
mod schemes;
mod util;
mod layout;

use app::App;

fn main() {
    yew::Renderer::<App>::new().render();
}
