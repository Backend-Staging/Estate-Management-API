variable "aws_region" {
  type        = string
  description = "AWS region. Lightsail is only available in some regions (e.g. us-east-1, us-west-2)."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Short name used in Lightsail resource names (letters, numbers, hyphen)"
  default     = "estate-api"
}

variable "environment" {
  type        = string
  description = "Deployment stage (e.g. production, staging)"
  default     = "production"
}

variable "lightsail_az" {
  type        = string
  description = "Availability zone for the instance and database (must support Lightsail in this region)"
  default     = null
}

variable "instance_blueprint_id" {
  type        = string
  description = "Lightsail OS/app blueprint for the app instance; \"docker\" ships Docker on Amazon Linux 2."
  default     = "docker"
}

variable "instance_bundle_id" {
  type        = string
  description = "Instance size bundle (e.g. micro_3_0, small_3_0). See Lightsail pricing for your region."
  default     = "small_3_0"
}

variable "database_blueprint_id" {
  type        = string
  description = "Lightsail PostgreSQL blueprint (engine major). Try postgres_15 or postgres_16 in your region."
  default     = "postgres_15"
}

variable "database_bundle_id" {
  type        = string
  description = "Lightsail database bundle (e.g. micro_5_0). See Lightsail database pricing."
  default     = "micro_5_0"
}

variable "db_name" {
  type        = string
  description = "Initial database name (POSTGRES_DB)"
  default     = "estate"
}

variable "db_username" {
  type        = string
  description = "Database master username (POSTGRES_USER)"
  default     = "estate"
}

variable "database_publicly_accessible" {
  type        = bool
  description = "If true, the managed database accepts connections from the internet. Prefer false when only the Lightsail instance must connect."
  default     = false
}

variable "ssh_public_key" {
  type        = string
  description = "Optional. OpenSSH public key to register on the instance. If empty, Terraform generates a key pair (private key is sensitive output / in state)."
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Extra tags merged via provider default_tags (where supported)"
  default     = {}
}
