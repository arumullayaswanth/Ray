output "secret_arn" {
  value = aws_secretsmanager_secret.gemini.arn
}

output "secret_name" {
  value = aws_secretsmanager_secret.gemini.name
}

output "secret_reader_role_arn" {
  value = aws_iam_role.secret_reader.arn
}

output "service_account_name" {
  value = var.service_account_name
}

output "service_account_namespace" {
  value = var.service_account_namespace
}
