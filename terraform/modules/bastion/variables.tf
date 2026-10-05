variable "name" {
  type    = string
  default = "eks"
}

variable "ami" {
  type    = string
  default = "ami-02dfbd4ff395f2a1b"
}

variable "instance_type" {
  type    = string
  default = "t2.medium"
}

variable "subnet_id" {
  type        = string
  description = "Public subnet to place the bastion in."
}

variable "security_group_id" {
  type = string
}

variable "root_volume_size" {
  type    = number
  default = 30
}
