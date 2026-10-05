# Supplied by GitHub Actions via TF_VAR_aws_region (repo variable AWS_REGION).
variable "aws_region" {
  type = string
}

variable "cluster_name" {
  type    = string
  default = "YashAcademy"
}

variable "cluster_version" {
  type    = string
  default = "1.35"
}

variable "ecr_repository_name" {
  type    = string
  default = "kuberay-agent"
}

variable "kuberay_version" {
  type    = string
  default = "1.2.2"
}

variable "external_secrets_version" {
  type    = string
  default = "0.10.4"
}


