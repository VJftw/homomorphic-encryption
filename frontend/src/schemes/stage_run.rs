use std::collections::HashMap;

use api::v1::Scheme;
use api::v1::Stage;
use api::v1::Step;
use yew::functional::*;
use yew::prelude::*;
use crate::schemes::StepRunComponent;
use crate::schemes::StepRun;
use crate::util::*;

use super::SchemeRun;

#[derive(Clone, Properties, PartialEq)]
pub struct StageRun {
    pub stage : Stage,

    pub step_runs : Vec<StepRun>,
}

impl StageRun {
    pub fn from_scheme(scheme : Scheme) -> Vec<StageRun> {
        let mut stage_runs = Vec::new();

        for stage in scheme.stages.iter() {
            stage_runs.push(StageRun{
                stage: stage.clone(),
                step_runs: StepRun::from_stage(stage.clone()),
            })
        }

        stage_runs
    }

    pub fn from_scheme_run(scheme_run : SchemeRun) -> Vec<StageRun> {
        let mut stage_runs = Vec::new();

        stage_runs.push(setup_stage_run(scheme_run.clone()));

        for stage in scheme_run.scheme.stages.iter() {
            if !stage.is_backend() {
                stage_runs.push(StageRun{
                    stage: stage.clone(),
                    step_runs: StepRun::from_stage(stage.clone()),
                })
            } else if stage.get_backend_capability() == scheme_run.input_op.clone().unwrap().to_string() {
                stage_runs.push(StageRun{
                    stage: stage.clone(),
                    step_runs: StepRun::from_stage(stage.clone()),
                })
            }
        }

        stage_runs
    }
}

fn setup_stage_run(scheme_run : SchemeRun) -> StageRun {
    let setup_stage = Stage { 
        name: "Set Up".to_string(), 
        pre_description: format!("We aim to calculate a {} b = c.", scheme_run.input_op.clone().unwrap()).to_string(), 
        post_description: "".to_string(), 
        steps: vec![
            Step{
                compute: format!("a = {}", scheme_run.get_var_from_scope("a")).to_string(),
                description: format!("The 1st input value"),
                expose: false,
            },
            Step{
                compute: format!("b = {}", scheme_run.get_var_from_scope("b")).to_string(),
                description: format!("The 2nd input value"),
                expose: false,
            },
        ],
    };

    StageRun{
        stage: setup_stage.clone(),
        step_runs: StepRun::from_stage(setup_stage.clone()),
    }
}



#[derive(Properties, PartialEq)]
pub struct StageRunComponentProps {
    pub stage_run: StageRun,
    pub scope : HashMap<String, String>,
}

#[function_component()]
pub fn StageRunComponent(props: &StageRunComponentProps) -> Html {
    let rendered_steps = props.stage_run.step_runs.iter().map(|step_run| html! {
        <StepRunComponent step_run={step_run.clone()} scope={props.scope.clone()} />
    }).collect::<Html>();
    html! {
        <div key={props.stage_run.stage.name.as_str()} class="row mt-3">
            <div class="col">
                <div class="card">
                    <h5 class="card-header text-center">{props.stage_run.stage.name.as_str()}</h5>
                    <div class="card-body">
                        <p><MathJax>{props.stage_run.stage.pre_description.as_str()}</MathJax></p>
                        <p>{rendered_steps}</p>
                        <p><MathJax>{props.stage_run.stage.post_description.as_str()}</MathJax></p>
                    </div>
                    
                </div>
            </div>
        </div>
    }
}