#!/usr/bin/env bash
# Writes the apply summary to the GitHub Actions run summary.
#
# Env expected: CLUSTER_NAME, AWS_REGION
set -euo pipefail

cd terraform

{
  echo "## Infrastructure applied"
  echo ""
  echo "| Item | Value |"
  echo "| --- | --- |"
  echo "| Cluster | \`${CLUSTER_NAME}\` |"
  echo "| Region | \`${AWS_REGION}\` |"
  echo "| ECR repo | \`$(terraform output -raw ecr_repository_url 2>/dev/null || echo n/a)\` |"
  echo "| Bastion IP | \`$(terraform output -raw bastion_public_ip 2>/dev/null || echo n/a)\` |"
  echo "| Gemini secret | \`$(terraform output -raw gemini_secret_name 2>/dev/null || echo n/a)\` |"
  echo ""
  echo "**Next:** set the Gemini key in Secrets Manager, then deploy the app (see DEPLOY.md)."
} >> "$GITHUB_STEP_SUMMARY"
