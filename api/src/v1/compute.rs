use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct ComputeRequest {
    pub compute_steps: Vec<String>,
    pub public_scope: HashMap<String, String>,
}

#[derive(Deserialize, Serialize)]
pub struct ComputeResponse {
    pub compute_request: ComputeRequest,
    pub results: Vec<String>,
    pub public_scope: HashMap<String, String>,
}
