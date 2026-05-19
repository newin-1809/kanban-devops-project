output "kanban_namespace" {
  value       = kubernetes_namespace.kanban_prod.metadata[0].name
  description = "The deployed Kubernetes namespace"
}