variable "cluster_name" {
  type = string
}

variable "secret_name" {
  type    = string
  default = "kuberay-agent/gemini-api-key"
}

# The External Secrets Operator controller is what calls AWS Secrets Manager,
# so EKS Pod Identity is bound to the ESO controller's service account.
variable "service_account_namespace" {
  type    = string
  default = "external-secrets"
}

variable "service_account_name" {
  description = "Service account that reads from Secrets Manager (the ESO controller)."
  type        = string
  default     = "external-secrets"
}
