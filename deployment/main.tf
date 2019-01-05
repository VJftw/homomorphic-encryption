provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    encrypt = true
    bucket  = "vjftw-terraform"
    key     = "homomorphic-encryption.tfstate"
    region  = "eu-west-1"
  }
}