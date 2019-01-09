resource "aws_api_gateway_rest_api" "backend" {
  name        = "HomomorphicEncryptionBackend"
  description = "Backend for Homomorpic Encryption"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.backend.id}"
  parent_id   = "${aws_api_gateway_rest_api.backend.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.backend.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.backend.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.backend.invoke_arn}"
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.backend.id}"
  resource_id   = "${aws_api_gateway_rest_api.backend.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.backend.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.backend.invoke_arn}"
}

resource "aws_api_gateway_deployment" "backend" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
    "aws_api_gateway_integration.lambda_root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.backend.id}"
  stage_name  = "production"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.backend.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.backend.execution_arn}/*/*"
}

output "base_url" {
  value = "${aws_api_gateway_deployment.backend.invoke_url}"
}

resource "aws_api_gateway_base_path_mapping" "base_path_mapping" {
  api_id     = "${aws_api_gateway_rest_api.backend.id}"
  stage_name = "production"

  domain_name = "${aws_api_gateway_domain_name.backend.domain_name}"
}

data "aws_acm_certificate" "backend" {
  domain   = "api.homomorphic-encryption.vjpatel.me"
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_domain_name" "backend" {
  certificate_arn = "${data.aws_acm_certificate.backend.arn}"
  domain_name     = "api.homomorphic-encryption.vjpatel.me"
}

resource "aws_route53_record" "backend" {
  name    = "${aws_api_gateway_domain_name.backend.domain_name}"
  type    = "A"
  zone_id = "${data.aws_route53_zone.organisation.id}"

  alias {
    evaluate_target_health = true
    name                   = "${aws_api_gateway_domain_name.backend.cloudfront_domain_name}"
    zone_id                = "${aws_api_gateway_domain_name.backend.cloudfront_zone_id}"
  }
}
