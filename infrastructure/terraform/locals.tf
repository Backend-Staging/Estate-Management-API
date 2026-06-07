locals {
  name_prefix = "${var.project_name}-${var.environment}"
  az          = coalesce(var.lightsail_az, "${var.aws_region}a")
}
