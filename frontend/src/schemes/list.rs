use api::v1::Scheme;
use gloo_net::http::Request;
use yew::functional::*;
use yew::prelude::*;
use yew_router::prelude::*;
use crate::app::Route;
use crate::util::*;


#[function_component()]
pub fn ListComponent() -> Html {

    let schemes = use_state(|| vec![]);
    {
        let schemes = schemes.clone();
        use_effect_with((), move |_| {
            let schemes = schemes.clone();

            wasm_bindgen_futures::spawn_local(async move {
                let fetched_schemes: Vec<Scheme> = Request::get("http://127.0.0.1:3000/v1/schemes")
                    .send().await.unwrap()
                    .json().await.unwrap();

                schemes.set(fetched_schemes);
            });

        });
    }

    let rendered_schemes = schemes.iter().map(|scheme| html! {
        <div key={scheme.id.as_str()} class="row mt-3">
            <div class="col">
                <div class="card">
                    <h5 class="card-header text-center">{scheme.name.as_str()}</h5>
                    <div class="card-body">
                        
                        <p><MathJax>{scheme.description.as_str()}</MathJax></p>
                        
                        <div class="text-center">
                            <Link<Route> to={Route::SchemeRun { id : scheme.id.to_string() }}>
                                <button type="button" class="btn btn-primary">{"Try "}{scheme.name.as_str()}</button>
                            </Link<Route>>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    }).collect::<Html>();

    html! {
        <>
            <div class="row mt-5">
                <div class="col-xs-12 col-sm-8 offset-sm-2 text-center mb-3">
                    <h1>{"Choose a Cryptosystem"}</h1>
                </div>
            </div>
            {rendered_schemes}
        </>
    }
}