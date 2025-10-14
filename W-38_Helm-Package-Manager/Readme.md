# 🚀 Kubernetes & Helm Commands Guide

A complete reference for managing **Kubernetes clusters** and **Helm charts** efficiently.

---

## ⚙️ Basic Helm Commands

| Command | Description |
|----------|-------------|
| `helm list` | List all Helm releases in the current namespace |
| `helm lint` | Lint (validate) your Helm chart for syntax or structure errors |
| `helm template .` | Render templates locally without installing |
| `helm install chart-name . --dry-run` | Simulate an install without actually deploying |
| `helm --help` | Display general Helm help |
| `helm command_name --help` | Get help for a specific Helm command |

---

## 📦 Artifact Hub Repositories (e.g. Bitnami WordPress)

| Command | Description |
|----------|-------------|
| `helm repo add bitnami https://charts.bitnami.com/bitnami` | Add Bitnami repo from Artifact Hub |
| `helm install my-wordpress bitnami/wordpress --version 27.0.7` | Install WordPress chart |
| `helm pull oci://registry-1.docker.io/bitnamicharts/wordpress --version 27.0.7` | Pull WordPress chart from OCI registry |
| `helm upgrade my-wordpress . --values customValues.yaml` | Upgrade release using custom values |
| `helm history my-wordpress` | Show revision history of the release |
| `helm rollback my-wordpress version_number` | Rollback release to a specific version |
| `helm search hub wordpress` | Search for WordPress charts in Artifact Hub |

---

## 🧩 Creating YAML Files & Installing via Helm

| Step | Command | Purpose |
|------|----------|---------|
| 1️⃣ | `helm create first-chart` | Create a new Helm chart scaffold |
| 2️⃣ | `kubectl create deploy my-deployment --image=nginx --dry-run=client -o yaml > templates/deployment.yaml` | Generate Deployment YAML |
| 3️⃣ | `kubectl create service nodeport my-service --tcp=80:80 --dry-run=client -o yaml > templates/service.yaml` | Generate Service YAML |
| 4️⃣ | `helm install first-release .` | Install Helm chart |
| 4️⃣ | `helm install <custom-name> repo-name` | Install Helm chart with custom name e.g 'first-release' |
| 5️⃣ | `kubectl get deployment,svc` | List deployments and services |
| 6️⃣ | `kubectl get nodes -o wide` | List all nodes with details |
| 7️⃣ | `helm uninstall name_of_release` | Uninstall the release |

---

## 🧠 Useful Helm Template Functions

| Function | Example | Description |
|-----------|----------|-------------|
| `upper` | `drink: {{ .Values.drink | upper | quote }}` | Converts value to uppercase |
| `title` | `food: {{ .Values.food | title | quote }}` | Capitalizes first letter of each word |
| `default` | `name: {{ default "my-function" .Values.name}}-configmap` | Provides a fallback default value |
| `required` | `name: {{ required "This value is required" .Values.name}}-configmap` | Makes a value mandatory, else throws error |

---

## 🧱 Helm Conditionals (If / Else Logic)

Use the dash `-` before statements to remove unwanted whitespace in YAML rendering:

```yaml
containers:
  {{- if eq .Values.production "prod" }}
  - image: webapp:prod
  {{- else if eq .Values.production "dev" }}
  - image: webapp:dev
  {{- else }}
  - image: webapp:demo
  {{- end }}
  name: webapp



## 🧱 Helmfile sync (one-command using file)

to install the chart using helmfile while the `installed` value is set to true, run the command:
helmfile sync

to uninstall the chart using helmfile while the `installed` value is set to false, run the command:
helmfile sync

```yaml
releases:

  - name: hello-world-release
    chart: ./hello-world
    installed: false 