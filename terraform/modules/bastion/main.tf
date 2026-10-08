############################
# BASTION / CLIENT-SERVER
# A jump box with kubectl + eksctl to connect to the EKS cluster.
############################

# IAM role the bastion assumes so the AWS CLI on it has credentials
# automatically (no `aws configure`, no static keys).
resource "aws_iam_role" "bastion" {
  name = "${var.name}-bastion-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# Full admin on the bastion (lab convenience; tighten for production).
resource "aws_iam_role_policy_attachment" "bastion_admin" {
  role       = aws_iam_role.bastion.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_instance_profile" "bastion" {
  name = "${var.name}-bastion-profile"
  role = aws_iam_role.bastion.name
}

resource "aws_instance" "client" {
  ami                    = var.ami
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  iam_instance_profile   = aws_iam_instance_profile.bastion.name

  root_block_device {
    volume_size = var.root_volume_size
  }

  tags = {
    Name = var.name
  }

  # Bootstrap script that installs kubectl + eksctl on the bastion.
  user_data = file("${path.module}/tools.sh")
}
