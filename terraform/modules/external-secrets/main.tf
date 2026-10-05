############################
# EXTERNAL SECRETS OPERATOR (ESO)
# Syncs AWS Secrets Manager values into native Kubernetes Secrets.
# Installed via Helm so GitHub Actions no longer needs to run `helm`.
############################

terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12"
    }
  }
}

resource "helm_release" "external_secrets" {
  name             = "external-secrets"
  repository       = "https://charts.external-secrets.io"
  chart            = "external-secrets"
  version          = var.external_secrets_version
  namespace        = var.namespace
  create_namespace = true
  wait             = true
}
