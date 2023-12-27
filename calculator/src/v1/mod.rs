use crypto_bigint::{Encoding, U128};
use num_bigint::Sign;
use num_bigint::{BigInt, ParseBigIntError};
use regex::Regex;
use std::collections::HashMap;
use rand::Rng;

fn generate_random_prime_between_0_and_n(n : U128) -> U128 {
    loop {
        let r = generate_random_prime();

        if r.gt(&U128::ZERO) && r.lt(&n) {
            return r
        }
    }
}

fn is_prime(n: i32) -> bool {
    if n == 2 || n == 3 {
        return true;
    }

    if n <= 1 || n % 2 == 0 || n % 3 == 0 {
        return false;
    }
    
    for i in (5..).step_by(6).take_while(|i| i * i <= n) {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
    }

    true
}

fn generate_random_prime() -> U128 {
    let mut rng = rand::thread_rng();

    loop {
        let n : i32 = rng.gen_range(128..512);

        if is_prime(n) {
            return str_to_uint(n.to_string().as_str()).unwrap()
        }
    }
}


pub fn do_compute(calculation: &str, scope: &HashMap<String, String>) -> String {
    let calc: String = calculation.replace(" ", "");
    println!("{}", calc);
    match calc.as_str() {
        "generateRandomPrime()" => {
            return uint_to_str(generate_random_prime());
        },
        "randomRBetween0AndNWithGCD1(n)" => {
            return uint_to_str(generate_random_prime_between_0_and_n(resolve_variable("n", scope)))
        },
        "findCoPrime(l)" => {
            return uint_to_str(generate_random_prime_between_0_and_n(resolve_variable("l", scope)))
        },
        _ => {},
    }

    let bracket_re = Regex::new(r"\([^\)\(]*\)").unwrap();

    let bracket_matches: Vec<&str> = bracket_re.find_iter(&calc).map(|m| m.as_str()).collect();

    if bracket_matches.len() > 0 {
        for bracket_match in bracket_matches {
            let bracket_calculation = &bracket_match[1..bracket_match.len() - 1];
            let bracket_result = single_calculation(bracket_calculation, scope);

            let bracket_result_str = uint_to_str(bracket_result.unwrap());

            return do_compute(
                calc.replace(bracket_match, &bracket_result_str).as_str(),
                scope,
            );
        }
    }

    return uint_to_str(single_calculation(&calc, scope).unwrap());
}

fn single_calculation(calc: &str, scope: &HashMap<String, String>) -> Result<U128, String> {
    
    let operator_re = Regex::new(r"[\*\+\-\%\/\$\&]").unwrap();

    let found_operators: Vec<&str> = operator_re.find_iter(&calc).map(|m| m.as_str()).collect();
    if found_operators.len() > 1 {
        return Err("too many operators".to_string());
    }

    if found_operators.len() < 1 {
        return Ok(resolve_variable(calc, scope))
    }

    let operator = found_operators[0];

    let parts: Vec<&str> = calc.split(operator).collect();

    match operator {
        "+" | "-" | "*" | "%" | "/" | "$" => two_value_calculation(
            resolve_variable(parts[0], scope),
            resolve_variable(parts[1], scope),
            operator,
        ),
        "&" => {
            let g_parts: Vec<&str> = parts[1].split(",").collect();
            three_value_calculation(
                resolve_variable(parts[0], scope),
                resolve_variable(g_parts[0], scope),
                resolve_variable(g_parts[1], scope),
                operator,
            )
        }
        _ => Err("invalid operation".to_string()),
    }
}

fn two_value_calculation(a: U128, b: U128, op: &str) -> Result<U128, String> {
    match op {
        "+" => return Ok(a.wrapping_add(&b)),
        "-" => return Ok(a.wrapping_sub(&b)),
        "*" => return Ok(a.wrapping_mul(&b)),
        "%" => return Ok(a.wrapping_rem(&b)),
        "/" => return Ok(a.wrapping_div(&b)),
        "$" => return Ok(a.inv_mod(&b).0),
        _ => return Err(format!("invalid op: {}", op)),
    }
}

fn three_value_calculation(a: U128, b: U128, c: U128, op: &str) -> Result<U128, String> {
    let a_bigint = uint_to_bigint(a);
    let b_bigint = uint_to_bigint(b);
    let c_bigint = uint_to_bigint(c);

    match op {
        "&" => return Ok(bigint_to_uint(a_bigint.modpow(&b_bigint, &c_bigint))),
        _ => return Err(format!("invalid op: {}", op)),
    }
}

fn resolve_variable(variable: &str, scope: &HashMap<String, String>) -> U128 {
    match str_to_uint(variable) {
        Err(_) => str_to_uint(scope.get(variable).unwrap()).unwrap(),
        Ok(n) => n,
    }
}

fn uint_to_bigint(input: U128) -> BigInt {
    BigInt::from_bytes_be(Sign::Plus, &input.to_be_bytes())
}

fn bigint_to_uint(input: BigInt) -> U128 {
    let num_big_int_bytes = input.to_bytes_be().1;
    let input_crypto_uint_bytes: [u8; 16] = core::array::from_fn(|i| {
        if i >= 16 - num_big_int_bytes.len() {
            return num_big_int_bytes
                .get(i - (16 - num_big_int_bytes.len()))
                .unwrap()
                .clone();
        } else {
            return 0;
        }
    });

    U128::from_be_bytes(input_crypto_uint_bytes)
}

fn str_to_uint(input: &str) -> Result<U128, ParseBigIntError> {
    let parsed_num_big_int = input.trim().parse::<BigInt>()?;

    Ok(bigint_to_uint(parsed_num_big_int))
}

fn uint_to_str(input: U128) -> String {
    let parsed = BigInt::from_bytes_be(Sign::Plus, &input.to_be_bytes());

    parsed.to_string()
}

#[cfg(test)]
mod tests {
    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn test_resolve_to_int() {
        assert_eq!(uint_to_str(str_to_uint("1234").unwrap()), "1234");
        assert_eq!(uint_to_str(str_to_uint("4").unwrap()), "4");
        assert_eq!(uint_to_str(str_to_uint("123455").unwrap()), "123455");
        assert_eq!(uint_to_str(str_to_uint("5161263207575308255340136206219427057").unwrap()), "5161263207575308255340136206219427057");
        assert_eq!(uint_to_str(str_to_uint("330933555368106345822335396296949774885").unwrap()), "330933555368106345822335396296949774885");
        assert_eq!(uint_to_str(str_to_uint("1").unwrap()), "1");
    }

    #[test]
    fn test_resolve_variable() {
        let mut scope: HashMap<String, String> = HashMap::new();
        scope.insert("a".to_string(), "12345".to_string());

        assert_eq!(uint_to_str(resolve_variable("1234", &scope)), "1234");
        assert_eq!(uint_to_str(resolve_variable("a", &scope)), "12345");
    }

    #[test]
    fn test_two_value_calculation() {
        assert_eq!(
            uint_to_str(two_value_calculation(
                str_to_uint("5").unwrap(),
                str_to_uint("3").unwrap(),
                "+",
            ).unwrap()),
            "8",
        );

        assert_eq!(
            uint_to_str(two_value_calculation(
                str_to_uint("5").unwrap(),
                str_to_uint("3").unwrap(),
                "*",
            ).unwrap()),
            "15",
        );

        assert_eq!(
            uint_to_str(two_value_calculation(
                str_to_uint("5161263207575308255340136206219427057").unwrap(),
                str_to_uint("1").unwrap(),
                "-",
            ).unwrap()),
            "5161263207575308255340136206219427056",
        );
    }

    #[test]
    fn test_three_value_calculation() {
        assert_eq!(
            uint_to_str(three_value_calculation(
                str_to_uint("697598984").unwrap(),
                str_to_uint("26496").unwrap(),
                str_to_uint("719687929").unwrap(),
                "&",
            ).unwrap()),
            "648650034",
        );
    }

    #[test]
    fn test_single_calculation() {
        let mut scope: HashMap<String, String> = HashMap::new();
        scope.insert("a".to_string(), "3".to_string());

        assert_eq!(uint_to_str(single_calculation("5+3", &scope).unwrap()), "8");
        assert_eq!(uint_to_str(single_calculation("5+a", &scope).unwrap()), "8");
        assert_eq!(
            uint_to_str(single_calculation("5*3", &scope).unwrap()),
            "15"
        );
        assert_eq!(
            uint_to_str(single_calculation("5*a", &scope).unwrap()),
            "15"
        );
    }

    #[test]
    fn test_do_compute() {
        let mut scope: HashMap<String, String> = HashMap::new();
        scope.insert("a".to_string(), "3".to_string());
        scope.insert("b".to_string(), "1".to_string());

        assert_eq!(do_compute("3 + 5", &scope).as_str(), "8");
        assert_eq!(do_compute("5 - 3", &scope).as_str(), "2");
        assert_eq!(do_compute("5 * 3", &scope).as_str(), "15");
        assert_eq!(do_compute("5 % 2", &scope).as_str(), "1");
        assert_eq!(do_compute("4 / 2", &scope).as_str(), "2");
        assert_eq!(do_compute("13 $ 4", &scope).as_str(), "1");

        assert_eq!(do_compute("13 & 4,3", &scope).as_str(), "1");

        assert_eq!(do_compute("(5 * 3) + 4", &scope).as_str(), "19");
        assert_eq!(do_compute("(5 * 3) + (4 + 7)", &scope).as_str(), "26");
        assert_eq!(do_compute("(5 * (3 + 3)) + (4 + 7)", &scope).as_str(), "41");
        assert_eq!(do_compute("(5 * (3 + 3)) + (4 + 7)", &scope).as_str(), "41");
        assert_eq!(do_compute("(648650034 - 1) / 26827", &scope).as_str(), "24179");
    }
}
