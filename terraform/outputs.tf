output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "bastion_public_ip" {
  value = module.bastion.public_ip
}

output "gemini_secret_name" {
  description = "Set the real Gemini API key for this secret in the AWS Console."
  value       = module.secrets.secret_name
}

output "gemini_secret_arn" {
  value = module.secrets.secret_arn
}

output "agent_service_account" {
  value = module.secrets.service_account_name
}


