output "cluster_role_arn" {
  value = aws_iam_role.cluster_role.arn
}

output "cluster_policy_attachment" {
  value = aws_iam_role_policy_attachment.cluster_policy.id
}

output "worker_role_arn" {
  value = aws_iam_role.worker_role.arn
}

output "worker_role_attachments" {
  value = [
    aws_iam_role_policy_attachment.worker_node.id,
    aws_iam_role_policy_attachment.cni.id,
    aws_iam_role_policy_attachment.ecr.id,
  ]
}
