use yew::functional::*;
use yew::prelude::*;
use yew_router::prelude::*;
use crate::app::Route;

#[function_component]
pub fn HomeComponent() -> Html {
    html! {
        <>
            <div class="row mt-5">
                <div class="col-xs-12 col-sm-8 offset-sm-2">
                    <p class="lead text-center">{"This application presents various Homomorphic Encryption schemes to help teach how they work and could be implemented."}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 text-center center-block">
                <Link<Route> to={Route::Schemes}><button type="button" class="btn btn-primary">{"Try it out!"}</button></Link<Route>>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-xs-12 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2">
                    <h3>{"More information"}</h3>
                    <p class="text-justified">
                        <em>{"Homomorphic Encryption"}</em>{r#" has 
                        become an increasingly important topic in Computer 
                        Science with the emergence of public cloud services 
                        like "#}
                        <a href="https://aws.amazon.com">{"Amazon Web Services"}</a>{", "} 
                        <a href="https://cloud.google.com">{"Google Cloud Platform"}</a>{" and "} 
                        <a href="https://azure.microsoft.com">{"Microsoft Azure"}</a>{r#" who offer 
                        virtual computers in their data-centers across the globe. 
                        Usage of their computers ultimately means that anyone 
                        who can gain access to their computers can discover what 
                        it is currently executing and compromise any data that 
                        is a part of that process. "#}<em>{"Homomorphic Encryption"}</em> 
                        {r#" describes the ability to encrypt values and allow any 
                        external process to perform operations on them whilst 
                        retaining their original meaning, thus solving this 
                        vulnerability."#}</p>
                    <h3>{"Created with"}</h3>
                    <ul>
                        <li>
                            <a href="https://www.rust-lang.org/" target="_blank">{"Rust"}</a>
                            <ul>
                                <li><a href="https://yew.rs" target="_blank">{"Yew"}</a></li>
                                <li><a href="https://github.com/tokio-rs/axum" target="_blank">{"Axum"}</a></li>
                            </ul>
                        </li>
                        <li><a href="https://getbootstrap.com" target="_blank">{"Bootstrap 5"}</a></li>
                        <li><span class="fw-lighter">{"Hosted on "}</span><a href="https://aws.amazon.com" target="_blank">{"Amazon Web Services"}</a></li>
                    </ul>
                </div>
            </div>
        </>
    }
}