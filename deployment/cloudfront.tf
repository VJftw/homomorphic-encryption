resource "aws_cloudfront_distribution" "client" {
  origin {
    domain_name = "${aws_s3_bucket.client.bucket_regional_domain_name}"
    origin_id   = "S3-homomorphic-encryption.vjpatel.me"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment"
  default_root_object = "index.html"

  #   logging_config {
  #     include_cookies = false
  #     bucket          = "mylogs.s3.amazonaws.com"
  #     prefix          = "myprefix"
  #   }

  aliases = ["homomorphic-encryption.vjpatel.me"]
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "S3-homomorphic-encryption.vjpatel.me"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"

    # viewer_protocol_policy = "redirect-to-https"
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }
  price_class = "PriceClass_All"
  tags = {
    Environment = "production"
  }
  viewer_certificate {
    # cloudfront_default_certificate = true
    acm_certificate_arn = "${data.aws_acm_certificate.client.arn}"
    ssl_support_method  = "sni-only"
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

data "aws_acm_certificate" "client" {
  domain   = "homomorphic-encryption.vjpatel.me"
  statuses = ["ISSUED"]
}

resource "aws_route53_record" "client" {
  name    = "homomorphic-encryption"
  type    = "A"
  zone_id = "${data.aws_route53_zone.organisation.id}"

  alias {
    evaluate_target_health = true
    name                   = "${aws_cloudfront_distribution.client.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.client.hosted_zone_id}"
  }
}
