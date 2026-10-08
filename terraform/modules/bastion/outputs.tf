output "instance_id" {
  value = aws_instance.client.id
}

output "public_ip" {
  value = aws_instance.client.public_ip
}

output "role_arn" {
  value = aws_iam_role.bastion.arn
}
