use std::fs::File;

use api::v1::Scheme;

pub fn get_schemes() -> Result<Vec<Scheme>, serde_yaml::Error> {
    let schemes: [&str; 3] = [
        "/home/vjftw/Projects/VJftw/homomorphic-encryption/backend/src/schemes/gorti.yml",
        "/home/vjftw/Projects/VJftw/homomorphic-encryption/backend/src/schemes/paillier.yml",
        "/home/vjftw/Projects/VJftw/homomorphic-encryption/backend/src/schemes/rsa.yml",
    ];

    let mut results = Vec::new();

    for s in schemes {
        let s_file = File::open(s).unwrap();

        let parsed_scheme: Scheme = serde_yaml::from_reader(&s_file).unwrap();

        results.push(parsed_scheme);
    }

    Ok(results)
}

pub fn get_scheme_by_id(id: &str) -> Result<Scheme, &str> {
    let schemes = get_schemes().unwrap();

    for s in schemes.iter() {
        if s.id == id.to_string() {
            return Ok(s.clone())
        }
    }

    Err("not found")
}