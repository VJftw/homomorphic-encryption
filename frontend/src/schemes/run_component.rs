use std::collections::HashMap;
use std::ops::Deref;

use api::v1::ComputeRequest;
use api::v1::ComputeResponse;
use api::v1::Scheme;
use web_sys::HtmlInputElement;
use yew::functional::*;
use yew::prelude::*;
use gloo_net::http::Request;
use crate::util::*;

use crate::schemes::StageRunComponent;
use crate::schemes::SchemeRun;
use crate::schemes::StageRun;
use calculator::v1::do_compute;

fn on_submit_callback(
    input_a_ref : NodeRef,
    input_b_ref : NodeRef,
    input_op_ref : NodeRef,
    submit_ref : NodeRef,
    scheme_run_state : &UseStateHandle<SchemeRun>,
) -> Callback<SubmitEvent> {
    let scheme_run_state = scheme_run_state.clone();
    let scheme_run = scheme_run_state.clone();

    Callback::from(move |e: SubmitEvent| {
        e.prevent_default();

        if scheme_run.is_complete() {
            scheme_run_state.set(SchemeRun::from_scheme(scheme_run.clone().scheme.clone()));
            return
        }

        let input_a_elem : HtmlInputElement = input_a_ref.cast().unwrap();
        let input_b_elem : HtmlInputElement = input_b_ref.cast().unwrap();
        let input_op_elem : HtmlInputElement = input_op_ref.cast().unwrap();

        let scheme_run = scheme_run.
            set_input_op(input_op_elem.value()).
            set_scope_var("a", input_a_elem.value()).
            set_scope_var("b", input_b_elem.value());

        scheme_run_state.set(scheme_run.clone());

        recurse_stage_compute(
            scheme_run_state.setter(),
            scheme_run.clone(), 
            0,
        )

    })
}


fn recurse_stage_compute(
    scheme_run_setter: UseStateSetter<SchemeRun>,
    scheme_run: SchemeRun, 
    stage_run_i: usize,
) {
    let stage_run = scheme_run.stage_runs.get(stage_run_i).unwrap();
    let mut scheme_run = scheme_run.clone();
    let mut scope = scheme_run.scope.clone();

    if !stage_run.stage.is_backend() {
        for step_run in stage_run.step_runs.iter() {
            log(format!("do_compute: {}, scope: {}", step_run.step.compute, &scope.iter().map(|(k, v)| {format!("{}={}, ", k, v)}).collect::<String>()).as_str());
            let parts : Vec<&str> =  step_run.step.compute.split("=").collect();
            let var = parts[0].trim();
            let compute = parts[1].trim();
            let result = do_compute(compute, &scope);

            scope.insert(var.to_string(), result.clone());
        }

        scheme_run = scheme_run.set_scope(&scope);
        scheme_run_setter.set(scheme_run.clone());

        if scheme_run.stage_runs.len()-1 > stage_run_i {
            return recurse_stage_compute(
                scheme_run_setter,
                scheme_run.clone(),
                stage_run_i+1)
        }
    } else {
        let req = ComputeRequest{
            compute_steps: stage_run.step_runs.iter().map(|step_run| {
                step_run.clone().step.compute
            }).collect(),
            public_scope: scheme_run.public_scope(),
        };
        
        {
            let mut scheme_run = scheme_run.clone();
            let mut scope = scope.clone();

            wasm_bindgen_futures::spawn_local( async move {
                let resp : ComputeResponse = Request::post("http://127.0.0.1:3000/v1/compute")
                    .header("content-type", "application/json")
                    .body(serde_wasm_bindgen::to_value(&serde_json::to_string(&req).unwrap()).unwrap()).expect("")
                    .send().await.unwrap()
                    .json().await.unwrap();

                    for (k, v) in resp.public_scope.iter() {
                        scope.insert(k.to_string(), v.to_string());                
                    }

                    scheme_run = scheme_run.set_scope(&scope.clone());
                    scheme_run_setter.set(scheme_run.clone());

                    // continue decryption stages
                    if scheme_run.stage_runs.len()-1 > stage_run_i {
                        return recurse_stage_compute(
                            scheme_run_setter,
                            scheme_run.clone(),
                            stage_run_i+1)
                    }
            });
        }
    }

}


fn on_change_callback(
    input_op_ref : NodeRef,
    scheme_run_state : &UseStateHandle<SchemeRun>,
) -> Callback<Event> {
    let scheme_run_state = scheme_run_state.clone();
    let scheme_run = scheme_run_state.clone();

    Callback::from(move |e: Event| {
        let input_op_elem : HtmlInputElement = input_op_ref.cast().unwrap();

        let scheme_run = scheme_run.set_input_op(input_op_elem.value());


        scheme_run_state.set(scheme_run); 
    })
}

#[derive(Properties, PartialEq)]
pub struct RunComponentProps {
    pub id : String,
}

#[function_component()]
pub fn RunComponent(props: &RunComponentProps) -> Html {
    let scheme_run: UseStateHandle<SchemeRun> = use_state(|| SchemeRun::new());

    let input_a_ref = use_node_ref();
    let input_b_ref = use_node_ref();
    let input_op_ref = use_node_ref();
    let submit_ref = use_node_ref();

    let scheme_id = props.id.to_string();

    {
        let scheme_run = scheme_run.clone();

        use_effect_with((), move |_| {
            wasm_bindgen_futures::spawn_local(async move {
                let fetched_scheme: Scheme = Request::get(format!("http://127.0.0.1:3000/v1/schemes/{}", scheme_id).as_str())
                    .send().await.unwrap()
                    .json().await.unwrap();

                    scheme_run.set(SchemeRun::from_scheme(fetched_scheme));
            });
        });
    }


    html! {
        <>
        <div class="row mt-3">
            <h1>{scheme_run.scheme.name.as_str()}</h1>
            <p><MathJax>{scheme_run.scheme.description.as_str()}</MathJax></p>
        </div>
        <div class="row mt-3">
            <div class="col-xs-12">
                <div class="card">
                    <h5 class="card-header text-center">{"Enter a sum"}</h5>
                    <div class="card-body">
                        <form onsubmit={
                            on_submit_callback(
                            input_a_ref.clone(), 
                            input_b_ref.clone(), 
                            input_op_ref.clone(), 
                            submit_ref.clone(), 
                            &scheme_run,
                        )}>
                        <div class="row text-center">
                            if !scheme_run.is_executing() && !scheme_run.is_complete() {
                                <div class="col-xs-12 col-sm-5">
                                    <input ref={input_a_ref} type="number" class="form-control text-center" placeholder="3" />
                                </div>
                                <div class="col-xs-12 col-sm-2">
                                    <select onchange={on_change_callback(input_op_ref.clone(), &scheme_run)} ref={input_op_ref.clone()} class="form-select text-center">
                                    {scheme_run.scheme.capabilities().iter().map(|capability| { 
                                        html! {
                                            <option value={capability.to_string()} selected={&scheme_run.input_op.clone().unwrap().to_string() == &capability.to_string()}>{capability}</option>
                                        }
                                    }).collect::<Html>()}
                                    </select>
                                </div>
                                <div class="col-xs-12 col-sm-5">
                                    <input ref={input_b_ref} type="number" class="form-control text-center" placeholder="5" />
                                </div>
                            } else {
                                <div class="col-xs-12 col-sm-6 offset-sm-3">
                                
                                    if scheme_run.is_complete() || scheme_run.is_executing() {
                                        <MathJax>
                                        {format!("\\({} {} {} = {}\\)", 
                                            scheme_run.get_var_from_scope("a"),
                                            scheme_run.input_op.clone().unwrap().mathjax_render(),
                                            scheme_run.get_var_from_scope("b"),
                                            scheme_run.get_var_from_scope("c"),
                                        )}</MathJax>
                                    } else {
                                        <MathJax>

                                        {format!("\\({} {} {}\\)", 
                                            scheme_run.get_var_from_scope("a"),
                                            scheme_run.input_op.clone().unwrap(),
                                            scheme_run.get_var_from_scope("b"),
                                        )}
                                        </MathJax>
                                    }
                                </div>
                            }                     
                        </div>
                        <div class="row mt-3">
                            <div class="col-xs-12 text-end">
                                <button ref={submit_ref} type="submit" class="btn btn-primary" disabled={scheme_run.is_executing()}>
                                    if scheme_run.is_executing() {
                                        {"Executing..."}
                                    } else if scheme_run.is_complete() {
                                        {"Reset"}
                                    } else {
                                        {"Execute!"}
                                    }
                                </button>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {scheme_run.stage_runs.iter().map(|stage_run| { 
            html! {
                <StageRunComponent stage_run={stage_run.clone()} scope={scheme_run.scope.clone()} />
            }
        }).collect::<Html>()}
        </>
    }
}

