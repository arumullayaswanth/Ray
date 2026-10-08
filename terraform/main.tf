terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.12"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.25"
    }
  }

  # Partial backend config: only bucket + region are supplied at init time via
  # -backend-config flags (fed from GitHub variables). key is hardcoded here.
  backend "s3" {
    key          = "kuberay-agent/terraform.tfstate"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region
}

############################
# PROVIDERS FOR HELM / K8S
# Authenticate to the EKS cluster created below.
############################

data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}

provider "helm" {
  kubernetes = {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.this.token
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.this.token
}

############################
# MODULES
############################

module "vpc" {
  source       = "./modules/vpc"
  cluster_name = var.cluster_name
}

module "iam" {
  source = "./modules/iam"
}

module "ecr" {
  source          = "./modules/ecr"
  repository_name = var.ecr_repository_name
}

module "eks" {
  source = "./modules/eks"

  cluster_name              = var.cluster_name
  cluster_version           = var.cluster_version
  cluster_role_arn          = module.iam.cluster_role_arn
  cluster_policy_attachment = module.iam.cluster_policy_attachment
  worker_role_arn           = module.iam.worker_role_arn
  worker_role_attachments   = module.iam.worker_role_attachments
  private_subnet_ids        = module.vpc.private_subnet_ids
  bastion_role_arn          = module.bastion.role_arn
}

module "bastion" {
  source            = "./modules/bastion"
  subnet_id         = module.vpc.public_subnet_ids[0]
  security_group_id = module.vpc.allow_all_sg_id
}

module "secrets" {
  source       = "./modules/secrets"
  cluster_name = module.eks.cluster_name

  # ESO is what reads from Secrets Manager, so the pod-identity binding targets
  # its controller service account.
  service_account_name      = module.external_secrets.service_account_name
  service_account_namespace = module.external_secrets.namespace

  depends_on = [module.eks, module.external_secrets]
}

module "kuberay" {
  source          = "./modules/kuberay"
  kuberay_version = var.kuberay_version

  depends_on = [module.eks]
}

module "external_secrets" {
  source                   = "./modules/external-secrets"
  external_secrets_version = var.external_secrets_version

  depends_on = [module.eks]
}

# NOTE: The GitHub Actions OIDC provider + IAM role are created MANUALLY in the
# AWS Console (see DEPLOY.md). Put that role ARN into the GitHub repo variable
# AWS_ROLE_ARN.
