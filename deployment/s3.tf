resource "aws_s3_bucket" "client" {
  bucket = "homomorphic-encryption.vjpatel.me"
  acl    = "public-read"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::homomorphic-encryption.vjpatel.me/*"
      ]
    }
  ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name = "homomorphic-encryption.vjpatel.me"
  }
}

resource "aws_s3_bucket" "api" {
  bucket = "api.homomorphic-encryption.vjpatel.me"
  acl    = "private"

  tags = {
    Name = "api.homomorphic-encryption.vjpatel.me"
  }
}
