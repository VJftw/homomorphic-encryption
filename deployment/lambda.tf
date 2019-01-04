resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

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

resource "aws_lambda_function" "test_lambda" {
  filename         = "../backend/bin/compute.zip"
  function_name    = "api_homomorphic_encryption"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "main"
  source_code_hash = "${base64sha256(file("../backend/bin/compute.zip"))}"
  runtime          = "go1.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
}
