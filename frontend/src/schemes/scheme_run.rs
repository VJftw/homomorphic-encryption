use std::{collections::HashMap, borrow::Borrow};
use api::v1::Scheme;
use crate::schemes::StageRun;
use std::fmt;

#[derive(Clone)]
pub enum SchemeRunOp {
    Add,
    Multiply,
}

impl SchemeRunOp {
    pub fn from_string(str : String) -> Option<SchemeRunOp> {
        match str.to_lowercase().as_str() {
            "+" => Some(SchemeRunOp::Add),
            "x" => Some(SchemeRunOp::Multiply),
            _ => None,
        }
    }

    pub fn mathjax_render(&self) -> String {
        match self {
            SchemeRunOp::Multiply => "\\times".to_string(),
            _ => format!("{}", self),
        }
    }
}

impl fmt::Display for SchemeRunOp {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SchemeRunOp::Add => write!(f, "+"),
            SchemeRunOp::Multiply => write!(f, "x"),
        }
    }
}

#[derive(Clone)]
pub struct SchemeRun {
    pub scheme : Scheme,
    pub stage_runs : Vec<StageRun>,

    pub input_op : Option<SchemeRunOp>,
    pub scope: HashMap<String, String>,
}

impl SchemeRun {
    pub fn new() -> SchemeRun {
        SchemeRun{
            scheme: Scheme::new(),
            stage_runs: Vec::new(),
            input_op: None,
            scope: HashMap::new(),
        }
    }

    pub fn from_scheme(scheme: Scheme) -> SchemeRun {
        let mut sr = SchemeRun{
            scheme: scheme.clone(),
            stage_runs: Vec::new(),
            input_op: SchemeRunOp::from_string(scheme.capabilities()[0].clone()),
            scope: HashMap::new(),
        };

        sr.stage_runs = StageRun::from_scheme_run(sr.clone());

        sr
    }

    pub fn set_scope_var(&self, var: &str, val : String) -> SchemeRun {
        let mut scope = self.scope.clone();
        scope.insert(var.to_string(), val);

        self.set_scope(&scope)
    }

    pub fn set_input_op(&self, op : String) -> SchemeRun {
        let mut sr = self.clone();
        sr.input_op = SchemeRunOp::from_string(op);

        sr.stage_runs = StageRun::from_scheme_run(sr.clone());

        sr
    }

    pub fn set_scope(&self, scope : &HashMap<String, String>) -> SchemeRun {
        let mut sr = self.clone();
        sr.scope = scope.clone();
        sr.stage_runs = StageRun::from_scheme_run(sr.clone());

        sr
    }

    pub fn get_var_from_scope(&self, var: &str) -> String {
        self.scope.get(&var.to_string()).unwrap_or("".to_string().borrow()).clone()
    }

    pub fn is_executing(&self) -> bool {
        self.scope.contains_key("a") && !self.is_complete()
    }

    pub fn is_complete(&self) -> bool {
        self.scope.contains_key("c")
    }

    pub fn public_scope(&self) -> HashMap<String, String> {
        let mut public_scope : HashMap<String, String> = HashMap::new();

        for stage_run in self.stage_runs.iter() {
            for step_run in stage_run.step_runs.iter() {
                if step_run.step.expose {
                    let var = step_run.step.variable();
                    let maybe_val = self.scope.get(step_run.step.variable().as_str());
                    if maybe_val.is_some() {
                        public_scope.insert(var, maybe_val.unwrap().clone());
                    }
                }
            }
        }

        public_scope
    }
}
