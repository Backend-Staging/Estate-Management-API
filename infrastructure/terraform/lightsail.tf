resource "random_password" "db" {
  length  = 32
  special = false
}

resource "tls_private_key" "ssh" {
  count     = var.ssh_public_key == "" ? 1 : 0
  algorithm = "ED25519"
}

resource "aws_lightsail_key_pair" "generated" {
  count      = var.ssh_public_key == "" ? 1 : 0
  name       = "${local.name_prefix}-ssh"
  public_key = tls_private_key.ssh[0].public_key_openssh
}

resource "aws_lightsail_key_pair" "imported" {
  count      = var.ssh_public_key != "" ? 1 : 0
  name       = "${local.name_prefix}-ssh"
  public_key = var.ssh_public_key
}

locals {
  lightsail_key_pair_name = var.ssh_public_key == "" ? aws_lightsail_key_pair.generated[0].name : aws_lightsail_key_pair.imported[0].name
}

resource "aws_lightsail_database" "main" {
  relational_database_name = "${local.name_prefix}-db"
  availability_zone        = local.az
  master_database_name     = var.db_name
  master_username          = var.db_username
  master_password          = random_password.db.result
  blueprint_id             = var.database_blueprint_id
  bundle_id                = var.database_bundle_id
  publicly_accessible      = var.database_publicly_accessible
}

resource "aws_lightsail_instance" "app" {
  name              = "${local.name_prefix}-app"
  availability_zone = local.az
  blueprint_id      = var.instance_blueprint_id
  bundle_id         = var.instance_bundle_id
  key_pair_name     = local.lightsail_key_pair_name
}

resource "aws_lightsail_static_ip" "app" {
  name = "${local.name_prefix}-ip"
}

resource "aws_lightsail_static_ip_attachment" "app" {
  static_ip_name = aws_lightsail_static_ip.app.name
  instance_name  = aws_lightsail_instance.app.name
}

resource "aws_lightsail_instance_public_ports" "app" {
  instance_name = aws_lightsail_instance.app.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}
