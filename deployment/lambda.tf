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
  function_name = "api_homomorphic_encryption"
  role          = "${aws_iam_role.lambda.arn}"
  handler       = "main"
  s3_bucket     = "${aws_s3_bucket.api.bucket}"
  s3_key        = "${var.version}.zip"
  runtime       = "go1.x"
}
