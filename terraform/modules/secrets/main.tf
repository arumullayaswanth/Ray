############################
# AWS SECRETS MANAGER

############################

resource "aws_secretsmanager_secret" "gemini" {
  name        = var.secret_name
  description = "Gemini API key for the KubeRay agent. Set the real value in the AWS Console."

  # Delete immediately on destroy so a recreate with the same name does not hit
  # "scheduled for deletion" (default recovery window is 30 days).
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "gemini" {
  secret_id = aws_secretsmanager_secret.gemini.id

  # Placeholder. Replace "CHANGE_ME" in the AWS Console after apply.
  secret_string = jsonencode({
    "api-key" = "CHANGE_ME"
  })

  lifecycle {
    # Do not revert the value you set manually in the console.
    ignore_changes = [secret_string]
  }
}

############################
# IAM ROLE FOR PODS (via EKS Pod Identity)
# Lets the agent pods read ONLY this secret from Secrets Manager.
############################

resource "aws_iam_role" "secret_reader" {
  name = "${var.cluster_name}-gemini-secret-reader"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "pods.eks.amazonaws.com"
      }
      Action = [
        "sts:AssumeRole",
        "sts:TagSession"
      ]
    }]
  })
}

resource "aws_iam_policy" "secret_read" {
  name        = "${var.cluster_name}-gemini-secret-read"
  description = "Read access to the Gemini API key secret."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ]
      Resource = aws_secretsmanager_secret.gemini.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "secret_read" {
  role       = aws_iam_role.secret_reader.name
  policy_arn = aws_iam_policy.secret_read.arn
}

# Bind the IAM role to the Kubernetes service account the pods use.
resource "aws_eks_pod_identity_association" "secret_reader" {
  cluster_name    = var.cluster_name
  namespace       = var.service_account_namespace
  service_account = var.service_account_name
  role_arn        = aws_iam_role.secret_reader.arn
}
