# Deployment Guide — YashAcademy Gemini Agent

## Step 1 — Create S3 bucket for Terraform state (AWS Console)

1. **S3 → Create bucket**.
2. Bucket name: `kuberay-agent-tfstate-fde` (must be globally unique).
3. Region: `us-east-1`.
4. Enable **Bucket Versioning**.
5. **Create bucket**.

---

## Step 2 — Create GitHub OIDC provider + IAM role (AWS Console)

### 2a. OIDC provider

1. **IAM → Identity providers → Add provider**.
2. Provider type: **OpenID Connect**.
3. Provider URL: `https://token.actions.githubusercontent.com` → **Get thumbprint**.
4. Audience: `sts.amazonaws.com`.
5. **Add provider**.

### 2b. IAM role

1. **IAM → Roles → Create role**.
2. Trusted entity type: **Web identity**.
3. Identity provider: `token.actions.githubusercontent.com`.
4. Audience: `sts.amazonaws.com`.
5. **Next** → attach **AdministratorAccess** → **Next**.
6. Role name: `github-actions-deploy` → **Create role**.

### 2c. Trust policy

Open the role → **Trust relationships → Edit trust policy**. Replace `ACCOUNT_ID`, `GITHUB_ORG`, `REPO`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:GITHUB_ORG/REPO:*"
        }
      }
    }
  ]
}
```

Copy the role **ARN** for Step 3.

---

## Step 3 — Set GitHub variables

Repo → **Settings → Secrets and variables → Actions → Variables → New repository variable**:

| Name                | Value                       |
| ------------------- | --------------------------- |
| `AWS_REGION`        | `us-east-1`                 |
| `AWS_OIDC_ROLE_ARN` | role ARN from Step 2        |
| `TF_STATE_BUCKET`   | `kuberay-agent-tfstate-fde` |

> `TF_STATE_KEY`, `CLUSTER_NAME`, and `ECR_REPO` are hardcoded in Terraform / the workflows.

---

## Step 4 — Provision infrastructure

Actions tab → run the **`infra Terraform`** workflow.

---

## Step 5 — Set the Gemini API key

1. **Secrets Manager → `kuberay-agent/gemini-api-key` → Retrieve/Edit**.
2. Replace `CHANGE_ME` with your real key under `api-key`.
3. **Save**.

---

## Step 6 — Build + push the image

Actions tab → run the **`deploy`** workflow. It builds, pushes to ECR, and commits the image tag into `k8s/kustomization.yaml`.

---

## Step 7 — Connect to the bastion

```bash
ssh ec2-user@<BASTION_PUBLIC_IP>
aws eks update-kubeconfig --name YashAcademy --region us-east-1
```

---

## Step 8 — Clone + deploy

```bash
git clone <YOUR_REPO_URL>
cd <REPO_DIR>
git pull
kubectl apply -k k8s/
```

---

## Step 9 — Verify

```bash
kubectl get rayservice ai-agent -n ai-agent
kubectl get pods -n ai-agent
kubectl get secret gemini-secret -n ai-agent
kubectl get svc -n ai-agent
```

---

## Step 10 — Port-forward

```bash
kubectl port-forward svc/ai-agent-head-svc 8265:8265 -n ai-agent
kubectl port-forward svc/ai-agent-serve-svc 8000:8000 -n ai-agent
```

- Dashboard: http://localhost:8265
- Agent: http://localhost:8000

---

## Step 11 — Test

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hai"}'

for i in {1..20}; do
  curl -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"hai"}' &
done
wait
```

---

## Step 12 — Public URL (optional)

```bash
kubectl get svc ai-agent-public -n ai-agent \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## Teardown

**One-click:** Actions tab → run **`infra Terraform`** → set `action` = **destroy**.
This deletes the Kubernetes app + NLB first, then runs `terraform destroy`.

**Manual equivalent:**

```bash
kubectl delete -k k8s/        # removes the app + NLB
cd terraform && terraform destroy
```

> The S3 state bucket and the GitHub OIDC role are managed manually and are NOT
> deleted by destroy — remove them by hand if you want a true $0 state.
