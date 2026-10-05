#!/usr/bin/env bash
# Full teardown: delete the Kubernetes app (incl. the NLB) first so AWS does not
# orphan the load balancer, then destroy all Terraform-managed infra.
#
# Env expected:
#   CLUSTER_NAME   EKS cluster name
#   AWS_REGION     AWS region
#   TF_STATE_BUCKET  S3 backend bucket (for terraform init)
set -euo pipefail

NAMESPACE="ai-agent"
LB_SERVICE="ai-agent-public"

echo "==> Point kubectl at the cluster (best effort)"
if aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$AWS_REGION"; then
  echo "==> Deleting Kubernetes app (RayService, Service/NLB, ESO resources)"
  # Remove the public Service first so the NLB is released by the cloud controller.
  kubectl delete svc "$LB_SERVICE" -n "$NAMESPACE" --ignore-not-found --wait=true || true
  # Remove everything else defined in the kustomization.
  kubectl delete -k k8s/ --ignore-not-found --wait=true || true

  echo "==> Waiting for the load balancer to be fully deleted"
  for i in $(seq 1 30); do
    if ! kubectl get svc "$LB_SERVICE" -n "$NAMESPACE" >/dev/null 2>&1; then
      echo "    load balancer service gone"
      break
    fi
    echo "    attempt $i: still deleting..."
    sleep 10
  done
else
  echo "==> Cluster not reachable (already gone?); skipping k8s cleanup"
fi

echo "==> terraform init"
cd terraform
terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="region=${AWS_REGION}"

echo "==> terraform destroy"
terraform destroy -auto-approve

echo "==> Done. Note: S3 state bucket and the GitHub OIDC role are managed"
echo "    manually and are NOT destroyed by this script."
