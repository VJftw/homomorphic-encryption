use api::v1::Scheme;
use api::v1::ComputeRequest;
use api::v1::ComputeResponse;
use axum::{extract::{self, Path}, routing::get, routing::post, Json, Router};
use std::collections::HashMap;
use calculator::v1::do_compute;
use http::header::{CONTENT_TYPE};

mod schemes;

#[tokio::main]
async fn main() {
    // our router
    let app = Router::new()
        .route("/v1/schemes", get(get_v1_schemes))
        .route("/v1/schemes/:id", get(get_v1_scheme))
        .route("/v1/compute", post(post_v1_compute))
        .route("/", get(get_index))
        .layer(
            tower::ServiceBuilder::new()
            .layer(tower_http::cors::CorsLayer::new()
                .allow_methods([http::Method::GET, http::Method::POST])
                .allow_origin(tower_http::cors::Any)
                .allow_headers([CONTENT_TYPE])
            )
        );

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}



async fn get_index() -> Json<HashMap<String, String>> {
    let resp = HashMap::new();

    Json(resp)
}

async fn post_v1_compute(
    extract::Json(req): extract::Json<ComputeRequest>,
) -> Json<ComputeResponse> {
    let mut results: Vec<String> = Vec::new();
    let mut public_scope: HashMap<String, String> = req.public_scope.clone();

    for step in &req.compute_steps {
        let parts: Vec<&str> = step.split(" = ").collect();
        let var_name: &str = parts[0];
        let compute: &str = parts[1];

        let result: String = do_compute(compute, &public_scope);

        results.push(result.clone());
        public_scope.insert(var_name.to_string(), result.clone());
    }

    let resp = ComputeResponse {
        compute_request: req,
        results: results,
        public_scope: public_scope,
    };

    Json(resp)
}

async fn get_v1_schemes() -> Json<Vec<Scheme>> {
    Json(schemes::get_schemes().unwrap())
}

async fn get_v1_scheme(Path(id): Path<String>) -> Json<Scheme> {
    Json(schemes::get_scheme_by_id(id.as_str()).unwrap())
}