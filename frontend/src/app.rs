use yew::functional::*;
use yew::prelude::*;
use yew_router::prelude::*;

use crate::home::HomeComponent;
use crate::layout::HeaderComponent;
use crate::schemes::ListComponent as SchemesListComponent;
use crate::schemes::RunComponent as SchemeRunComponent;


#[function_component(App)]
pub fn app() -> Html {
    html! {
        <>
        <main>
        <div class="container mb-5">
            <HashRouter>
                <HeaderComponent />
                <div class="container">
                    <Switch<Route> render={switch} />
                </div>
            </HashRouter>
        </div>
        </main>
        </>
    }
}






#[derive(Clone, Routable, PartialEq)]
pub enum Route {
    #[at("/")]
    Home,
    #[at("/schemes")]
    Schemes,
    #[at("/schemes/:id/run")]
    SchemeRun { id : String },
    #[not_found]
    #[at("/404")]
    NotFound,
}

fn switch(routes: Route) -> Html {
    match routes {
        Route::Home => html! {<HomeComponent />},
        Route::Schemes => html! {<SchemesListComponent />},
        Route::SchemeRun { id } => html! {<SchemeRunComponent id={id} />},
        Route::NotFound => html! { <h1>{ "404" }</h1> },
    }
}


