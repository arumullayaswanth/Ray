#!/usr/bin/env bash
# Writes the destroy summary to the GitHub Actions run summary.
#
# Env expected: CLUSTER_NAME, TF_STATE_BUCKET
set -euo pipefail

{
  echo "## Infrastructure destroyed"
  echo ""
  echo "- Kubernetes app + public NLB deleted"
  echo "- EKS cluster \`${CLUSTER_NAME}\`, node group, VPC, NAT, bastion, ECR removed"
  echo ""
  echo "> Not deleted (manual): S3 state bucket \`${TF_STATE_BUCKET}\` and the GitHub OIDC role."
} >> "$GITHUB_STEP_SUMMARY"
