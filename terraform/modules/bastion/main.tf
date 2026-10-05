############################
# BASTION / CLIENT-SERVER
# A jump box with kubectl + eksctl to connect to the EKS cluster.
############################

resource "aws_instance" "client" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]

  root_block_device {
    volume_size = var.root_volume_size
  }

  tags = {
    Name = var.name
  }

  # Bootstrap script that installs kubectl + eksctl on the bastion.
  user_data = file("${path.module}/tools.sh")
}
