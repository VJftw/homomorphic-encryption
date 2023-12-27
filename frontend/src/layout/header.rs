use yew::functional::*;
use yew::prelude::*;
use yew_router::prelude::*;
use crate::app::Route;

#[function_component]
pub fn HeaderComponent() -> Html {
    html! {
        <div class="mt-5 container">
            <div class="row justify-content-md-center">
                <div class="col-md-auto text-center">
                    <h1 class="display-3"><Link<Route> to={Route::Home}>{"Implementations of Homormophic Encryption"}</Link<Route>></h1>
                    <div class="text-end">{"by "}<a href="https://vjpatel.me" target="_blank">{"VJ Patel"}</a></div>
                </div>
            </div>
            
        </div>
    }
}