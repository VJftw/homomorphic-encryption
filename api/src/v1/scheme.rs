use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone, PartialEq)]
pub struct Scheme {
    pub id : String,
    pub name : String,
    pub description : String,
    pub stages : Vec<Stage>,
}

impl Scheme {
    pub fn new() -> Scheme {
        Scheme{id: "".to_string(), name: "".to_string(), description: "".to_string(), stages: Vec::new()}
    }

    pub fn capabilities(&self) -> Vec<String> {
        let mut c : Vec<String> = Vec::new();

        for stage in self.stages.iter() {
            if stage.is_backend() {
                c.push(stage.get_backend_capability())
            }
        }

        c
    }
}

#[derive(Deserialize, Serialize, Clone, PartialEq)]
pub struct Stage {
    pub name : String,
    pub pre_description : String,
    pub post_description : String,
    pub steps : Vec<Step>,
}

impl Stage {
    pub fn is_backend(&self) -> bool {
        self.name.to_lowercase().starts_with("backend")
    }

    pub fn get_backend_capability(&self) -> String {
        let lowercase_name = self.name.to_lowercase();
        let parts : Vec<&str> = lowercase_name.split(" ").collect();

        match parts[1] {
            "addition" => "+".to_string(),
            "multiplication" => "x".to_string(),
            _ => "".to_string()
        }
    }
}

#[derive(Deserialize, Serialize, Clone, PartialEq)]
pub struct Step {
    pub description : String,
    pub compute : String,
    #[serde(default)]
    pub expose : bool,
}

impl Step {
    pub fn variable(&self) -> String {
        let parts: Vec<&str> = self.compute.split("=").collect();
        
        parts[0].trim().to_string()
    }
}

#[derive(Serialize)]
struct SchemesResponse {
    schemes: Vec<Scheme>,
}
