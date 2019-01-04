resource "aws_s3_bucket" "client" {
  bucket = "homomorphic-encryption.vjpatel.me"
  acl    = "private"

  tags = {
    Name = "homomorphic-encryption.vjpatel.me"
  }
}
