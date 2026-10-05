output "namespace" {
  value = helm_release.external_secrets.namespace
}

# The ESO controller service account (used for the EKS Pod Identity binding).
output "service_account_name" {
  value = "external-secrets"
}
