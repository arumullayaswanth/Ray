############################
# KUBERAY OPERATOR
# Installs via Helm so GitHub Actions no longer needs to run `helm`.
############################

terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12"
    }
  }
}

resource "helm_release" "kuberay_operator" {
  name             = "kuberay-operator"
  repository       = "https://ray-project.github.io/kuberay-helm/"
  chart            = "kuberay-operator"
  version          = var.kuberay_version
  namespace        = "kuberay-system"
  create_namespace = true
  wait             = true
}
