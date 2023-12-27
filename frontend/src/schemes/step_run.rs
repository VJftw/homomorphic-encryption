use std::collections::HashMap;

use api::v1::Stage;
use api::v1::Step;
use yew::functional::*;
use yew::prelude::*;

use crate::util::MathJax;


#[derive(Clone, Properties, PartialEq)]
pub struct StepRun {
    pub step: Step,
}

impl StepRun {
    pub fn from_stage(stage : Stage) -> Vec<StepRun> {
        let mut step_runs = Vec::new();

        for step in stage.steps.iter() {
            step_runs.push(StepRun{
                step: step.clone(),
            })
        }

        step_runs
    }

    pub fn value_from_scope(&self, scope : &HashMap<String, String>) -> Option<String> {
        let var = self.step.variable();

        if scope.contains_key(&var) {
            Some(scope.get(&var).unwrap().clone())
        } else {
            None
        }
    }
}

#[derive(Properties, PartialEq)]
pub struct StepRunComponentProps {
    pub step_run: StepRun,
    pub scope: HashMap<String, String>,
}

#[function_component()]
pub fn StepRunComponent(props: &StepRunComponentProps) -> Html {
    html! {
        <div key={props.step_run.step.variable()} class="row">
            <div class="col col-2 col-sm-1"><MathJax>{format!("\\({}\\)", props.step_run.step.variable())}</MathJax></div>
            <div class="col col-1"><MathJax>{"\\(=\\)"}</MathJax></div>
            <div class="col col-6 col-sm-7"><MathJax>{props.step_run.step.description.as_str()}</MathJax></div>
            if props.step_run.value_from_scope(&props.scope).is_some() {
                <div class="col col-1"><MathJax>{"\\(=\\)"}</MathJax></div>
                <div class="col col-2 col-sm-2">{format!("{}", props.step_run.value_from_scope(&props.scope).unwrap())}</div>
            }
        </div>
    }
}
