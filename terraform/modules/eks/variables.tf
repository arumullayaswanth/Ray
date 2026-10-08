variable "cluster_name" {
  type    = string
  default = "YashAcademy"
}

variable "cluster_version" {
  type    = string
  default = "1.35"
}

variable "cluster_role_arn" {
  type = string
}

variable "cluster_policy_attachment" {
  description = "Dependency handle so the cluster waits for its IAM policy attachment."
  type        = string
}

variable "worker_role_arn" {
  type = string
}

# Bastion IAM role ARN, mapped into aws-auth so kubectl works on the bastion.
variable "bastion_role_arn" {
  type = string
}

variable "worker_role_attachments" {
  description = "Dependency handles so the node group waits for IAM policy attachments."
  type        = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "instance_types" {
  type    = list(string)
  default = ["t3.medium"]
}

variable "desired_size" {
  type    = number
  default = 4
}

variable "max_size" {
  type    = number
  default = 6
}

variable "min_size" {
  type    = number
  default = 1
}
