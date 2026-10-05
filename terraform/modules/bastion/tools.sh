#!/bin/bash
# Update system
yum update -y

# ----------------------------- Install kubectl -----------------------------
curl -o /tmp/kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x /tmp/kubectl
mv /tmp/kubectl /usr/local/bin/kubectl

# Verify kubectl
kubectl version --client || true

# ----------------------------- Install eksctl -------------------------------
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" \
| tar xz -C /tmp

mv /tmp/eksctl /usr/local/bin/eksctl

# Verify eksctl
eksctl version || true
