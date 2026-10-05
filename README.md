# YashAcademy Gemini Agent

An AI chatbot served with **Ray Serve** on **KubeRay** (AWS EKS), powered by **Google Gemini**.
Infrastructure is provisioned with **Terraform**, images are built and shipped via **GitHub Actions**,
and the Gemini API key is pulled at runtime from **AWS Secrets Manager** (never stored in Git).

---

## Architecture

```
Developer ──push──> GitHub Actions ──OIDC──> AWS
                        │
          ┌─────────────┴─────────────┐
          │ Terraform (infra)         │ Docker build → ECR
          ▼                           ▼
   VPC · EKS · ECR · Secrets Manager · Bastion · KubeRay operator · ESO

   Users ─> NLB (:80) ─> Ray Serve / FastAPI (:8000) ─> Google Gemini
                                   ▲
          ESO syncs Secrets Manager ─> gemini-secret (k8s)
```

Open `index.html` for a visual architecture diagram (also deployable to GitHub Pages).

| Layer      | Tech |
| ---------- | ---- |
| Runtime    | Ray Serve + FastAPI on KubeRay (RayService), autoscaling 1→4 replicas |
| Model      | Google Gemini via `google-genai` |
| Frontend   | React + Vite + TypeScript (served by FastAPI) |
| Infra      | Terraform (VPC, EKS, ECR, Secrets Manager, bastion, addons) |
| Operators  | KubeRay operator, External Secrets Operator (ESO) |
| Secrets    | AWS Secrets Manager → ESO → k8s Secret (via EKS Pod Identity) |
| CI/CD      | GitHub Actions with OIDC (no static AWS keys) |

---

## Repository layout

```
app/
  backend/      app.py (Ray Serve + FastAPI), requirements.txt, static/ (built UI)
  frontend/     React (Vite + TS) source; builds into backend/static
  docker/       Dockerfile + Dockerfile.dockerignore
k8s/            Kustomize manifests (namespace, SA, SecretStore, ExternalSecret,
                RayService, Service) + kustomization.yaml
terraform/      Root config + modules: vpc, iam, eks, ecr, bastion, secrets,
                kuberay, external-secrets
scripts/        destroy.sh, apply-summary.sh, destroy-summary.sh
.github/workflows/
  ci.yml        Terraform apply/destroy (manual, choice input)
  deploy.yml    Build + push image, commit image tag into kustomization
  pages.yml     Publish index.html to GitHub Pages (only when it changes)
index.html      Architecture diagram
DEPLOY.md       Step-by-step deployment guide
```

---

## How it works

- **KubeRay / Ray Serve** — `app/backend/app.py` defines a Ray Serve `Agent`
  deployment wrapping a FastAPI app. KubeRay runs it as a `RayService` with a head
  pod and autoscaling workers. Ray Serve autoscales replicas based on in-flight
  requests (`target_ongoing_requests: 1`, 1→4 replicas).
- **Routing** — a public NLB `Service` selects pods KubeRay marks ready to serve
  (`ray.io/serve: "true"`), forwarding `:80 → :8000`, so traffic follows the active
  RayCluster during zero-downtime upgrades.
- **Secrets** — the Gemini key lives in AWS Secrets Manager. ESO reads it (via EKS
  Pod Identity) and syncs it into the `gemini-secret` Kubernetes Secret, which the
  Ray pods read as the `GEMINI_API_KEY` env var.
- **Frontend** — the React app builds into `app/backend/static` and is served by
  FastAPI at `/`.

---

## Quick start
1. Create the Terraform state **S3 bucket** (manual).
2. Create the **GitHub OIDC provider + IAM role** (manual).
3. Set GitHub repo **variables**: `AWS_REGION`, `AWS_OIDC_ROLE_ARN`, `TF_STATE_BUCKET`.
4. Run the **`infra Terraform`** workflow (`action: apply`) to build infra.
5. Set the real **Gemini key** in Secrets Manager (`kuberay-agent/gemini-api-key`).
6. Run the **`deploy`** workflow to build + push the image.
7. On the **bastion**, clone the repo and `kubectl apply -k k8s/`.

### Local frontend dev

```bash
cd app/frontend
npm install
npm run dev        # proxies /chat and /healthz to localhost:8000
```

### Test the deployed agent

```bash
kubectl port-forward svc/ai-agent-serve-svc 8000:8000 -n ai-agent

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hai"}'
```

---

## Teardown

Run the **`infra Terraform`** workflow with `action: destroy` — it deletes the
Kubernetes app + NLB first, then runs `terraform destroy`. The S3 state bucket and
GitHub OIDC role are managed manually and are not removed automatically.

---

## API

| Method | Path       | Description |
| ------ | ---------- | ----------- |
| GET    | `/`        | React chat UI |
| GET    | `/healthz` | Health + model name |
| GET    | `/ready`   | Readiness |
| POST   | `/chat`    | `{ "message": "...", "history": [...] }` → `{ "answer", "model" }` |
