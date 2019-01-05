resource "aws_iam_role" "lambda" {
  name = "lambda.homomorphic-encryption"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "backend" {
  filename         = "../backend/bin/compute.zip"
  function_name    = "api_homomorphic_encryption"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "main"
  source_code_hash = "${base64sha256(file("../backend/bin/compute.zip"))}"
  runtime          = "go1.x"
}
