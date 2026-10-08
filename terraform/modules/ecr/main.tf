resource "aws_ecr_repository" "app" {
  name = var.repository_name

  # Allow destroy even when the repo still contains pushed images.
  force_delete = true
}
