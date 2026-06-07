output "lightsail_static_ip" {
  description = "Public IP for the app instance (stable while attached)"
  value       = aws_lightsail_static_ip.app.ip_address
}

output "lightsail_instance_name" {
  value = aws_lightsail_instance.app.name
}

output "database_master_endpoint" {
  description = "Lightsail PostgreSQL host for POSTGRES_HOST"
  value       = aws_lightsail_database.main.master_endpoint_address
}

output "database_port" {
  description = "PostgreSQL port for POSTGRES_PORT"
  value       = aws_lightsail_database.main.master_endpoint_port
}

output "database_name" {
  description = "Database name for POSTGRES_DB"
  value       = var.db_name
}

output "database_username" {
  description = "Master user for POSTGRES_USER"
  value       = aws_lightsail_database.main.master_username
}

output "database_password" {
  description = "Master password for POSTGRES_PASSWORD (also in Terraform state)"
  value       = random_password.db.result
  sensitive   = true
}

output "ssh_private_key_openssh" {
  description = "Only when ssh_public_key was empty: OpenSSH-format ED25519 private key (sensitive; also in state)"
  value       = try(tls_private_key.ssh[0].private_key_openssh, null)
  sensitive   = true
}

output "celery_redis_on_instance" {
  description = "Lightsail has no managed Redis. Run Redis on this VM (Docker or systemd) and set CELERY_BROKER_URL / CELERY_RESULT_BACKEND to redis://127.0.0.1:6379/0 or your compose service name."
  value       = "redis://127.0.0.1:6379/0"
}
