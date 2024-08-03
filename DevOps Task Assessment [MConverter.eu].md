# **DevOps Task Assessment**

## **Part 1: Project Scope**

This assessment involves setting up a local Kubernetes environment using
Minikube, implementing persistent volumes, secrets management, and
configuring deployment manifests for both frontend and backend services.
The project will also include organising and uploading all necessary
files and scripts to a GitHub repository.

## **Setting Up Minikube**

This README provides a comprehensive guide to setting up Minikube for a
local Kubernetes environment. Minikube allows you to run Kubernetes
clusters on your local machine, making it an excellent tool for
development and testing.

## **Prerequisites**

#### **Operating System**: Ubuntu.

#### **Virtualization:** uwsl on windows**.**

#### **Tools:** Install kubectl for interacting with your cluster.

#### **1. Installation**

#### **1.1 Installing Docker**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>sudo apt update<br />
sudo apt install docker.io<br />
sudo systemctl start docker<br />
sudo systemctl enable docker<br />
sudo apt install -y apt-transport-https ca-certificates curl<br />
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo
apt-key add -<br />
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee
/etc/apt/sources.list.d/kubernetes.list</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**1.2 Install Minikube**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64<br />
sudo install minikube-linux-amd64 /usr/local/bin/minikube<br />
minikube version</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**1.3 Install Kubectl**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64</p>
<p>sudo install minikube-linux-amd64 /usr/local/bin/minikube</p>
<p>minikube version</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**1.4 Starting Minikube with Docker Driver**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>minikube start <strong>--driver</strong>=docker<br />
# If you encounter root privileges error, run:<br />
minikube start <strong>--driver</strong>=docker --force<br />
minikube status<br />
kubectl cluster-info<br />
kubectl config view<br />
kubectl get nodes<br />
kubectl get pods</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### **2.1 Deploy a backend Application**

You can deploy a simple application, such as python-application:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>apiVersion</strong>: apps/v1<br />
<strong>kind</strong>: Deployment<br />
<strong>metadata</strong>:<br />
<strong>name</strong>: myapp<br />
<strong>spec</strong>:<br />
<strong>replicas</strong>: 1<br />
<strong>selector</strong>:<br />
<strong>matchLabels</strong>:<br />
<strong>app</strong>: myapp<br />
<strong>template</strong>:<br />
<strong>metadata</strong>:<br />
<strong>labels</strong>:<br />
<strong>app</strong>: myapp<br />
<strong>spec</strong>:<br />
<strong>containers</strong>:<br />
- <strong>name</strong>: myapp<br />
<strong>image</strong>: dmrsoft/<strong>myapp</strong>:latest<br />
<strong>volumeMounts</strong>:<br />
- <strong>name</strong>: shared-volume<br />
<strong>mountPath</strong>: /app/config<br />
<strong>ports</strong>:<br />
- <strong>containerPort</strong>: 5000<br />
<strong>env</strong>:<br />
- <strong>name</strong>: ENVIRONMENT<br />
<strong>value</strong>: "production"<br />
<strong>volumes</strong>:<br />
- <strong>name</strong>: shared-volume<br />
<strong>emptyDir</strong>: {}</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**2.2 Create backend service manifest**  
First, you need a Service for the myapp Deployment if it isn't already
defined. Here's an example service manifest:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata:</p>
<p>name: myapp-service</p>
<p>spec:</p>
<p>selector:</p>
<p>app: myapp</p>
<p>ports:</p>
<p>- protocol: TCP</p>
<p>port: 5000</p>
<p>targetPort: 5000</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**2.3 Deploy Frontend app, service and ingress:**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>apiVersion: apps/v1</p>
<p>kind: Deployment</p>
<p>metadata:</p>
<p>name: frontend</p>
<p>spec:</p>
<p>replicas: 1</p>
<p>selector:</p>
<p>matchLabels:</p>
<p>app: frontend</p>
<p>template:</p>
<p>metadata:</p>
<p>labels:</p>
<p>app: frontend</p>
<p>spec:</p>
<p>containers:</p>
<p>- name: frontend</p>
<p>image: nginx:latest # Nginx to serve static files</p>
<p>volumeMounts:</p>
<p>- name: frontend-volume</p>
<p>mountPath: /usr/share/nginx/html</p>
<p>ports:</p>
<p>- containerPort: 80</p>
<p>volumes:</p>
<p>- name: frontend-volume</p>
<p>configMap:</p>
<p>name: frontend-config</p>
<p>---</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata:</p>
<p>name: frontend-service</p>
<p>spec:</p>
<p>selector:</p>
<p>app: frontend</p>
<p>ports:</p>
<p>- protocol: TCP</p>
<p>port: 80</p>
<p>targetPort: 80</p>
<p>---</p>
<p>apiVersion: networking.k8s.io/v1</p>
<p>kind: Ingress</p>
<p>metadata:</p>
<p>name: frontend-ingress</p>
<p>annotations:</p>
<p>nginx.ingress.kubernetes.io/rewrite-target: /</p>
<p>spec:</p>
<p>rules:</p>
<p>- host: frontend.example.com</p>
<p>http:</p>
<p>paths:</p>
<p>- path: /</p>
<p>pathType: Prefix</p>
<p>backend:</p>
<p>service:</p>
<p>name: frontend-service</p>
<p>port:</p>
<p>number: 80</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### **Configuration Details**

1.  **Frontend Deployment**:

    - The Deployment runs an Nginx server to serve the static frontend
      > files.

    - The ConfigMap named frontend-config should contain the HTML, CSS,
      > and JavaScript files for the frontend.

2.  **Frontend Service**:

    - Exposes the Nginx server internally in the Kubernetes cluster.

3.  **Frontend Ingress**:

    - Exposes the frontend service externally at the host
      > frontend.example.com. Replace this with your actual domain.

4.  **Backend Service**:

    - Exposes the backend application within the cluster.

- **PV and PVC**

A PersistentVolume (PV) is a piece of storage in the cluster that has
been provisioned by an administrator or dynamically provisioned using
Storage Classes

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>apiVersion: v1<br />
kind: PersistentVolume<br />
metadata:<br />
name: myapp-pv<br />
spec:<br />
capacity:<br />
storage: 10Gi<br />
accessModes:<br />
- ReadWriteOnce<br />
persistentVolumeReclaimPolicy: Retain<br />
storageClassName: manual<br />
hostPath:<br />
path: "/mnt/data"</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

A PersistentVolumeClaim (PVC) is a request for storage by a user. It is
similar to a pod.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>apiVersion: v1<br />
kind: PersistentVolumeClaim<br />
metadata:<br />
name: myapp-pvc<br />
spec:<br />
accessModes:<br />
- ReadWriteOnce<br />
resources:<br />
requests:<br />
storage: 10Gi<br />
storageClassName: manual</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### **Kubernetes Secrets**

### Kubernetes Secrets are used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.

### **Create a Secret**

### You can create a Secret using a YAML file

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>apiVersion: v1<br />
kind: Secret<br />
metadata:<br />
name: myapp-secret<br />
type: Opaque<br />
data:<br />
username: YWRtaW4= # Base64 encoded value of "admin"<br />
password: MWYyZDFlMmU2N2Rm # Base64 encoded value of "1f2d1e2e67df"</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### You can use echo -n 'admin' | base64 to encode the values.

### Using **kubectl create secret** command

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>kubectl create secret generic myapp-secret \<br />
--from-literal=username=admin \<br />
--from-literal=password=1f2d1e2e67df</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### **Using PVC and Secret in the Deployment**

You can then use this PVC in your Deployment by referencing it in the
volumes and volumeMounts sections.

#### **Updated Deployment Manifest**

Here's an updated myapp Deployment manifest that uses the PVC:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>apiVersion: apps/v1</p>
<p>kind: Deployment</p>
<p>metadata:</p>
<p>name: myapp</p>
<p>spec:</p>
<p>replicas: 1</p>
<p>selector:</p>
<p>matchLabels:</p>
<p>app: myapp</p>
<p>template:</p>
<p>metadata:</p>
<p>labels:</p>
<p>app: myapp</p>
<p>spec:</p>
<p>containers:</p>
<p>- name: myapp</p>
<p>image: dmrsoft/myapp:latest</p>
<p>volumeMounts:</p>
<p>- name: config-volume</p>
<p>mountPath: /app/config</p>
<p>- name: data-volume</p>
<p>mountPath: /app/data</p>
<p>ports:</p>
<p>- containerPort: 5000</p>
<p>env:</p>
<p>- name: ENVIRONMENT</p>
<p>value: "production"</p>
<p>- name: USERNAME</p>
<p>valueFrom:</p>
<p>secretKeyRef:</p>
<p>name: myapp-secret</p>
<p>key: username</p>
<p>- name: PASSWORD</p>
<p>valueFrom:</p>
<p>secretKeyRef:</p>
<p>name: myapp-secret</p>
<p>key: password</p>
<p>volumes:</p>
<p>- name: config-volume</p>
<p>emptyDir: {}</p>
<p>- name: data-volume</p>
<p>persistentVolumeClaim:</p>
<p>claimName: myapp-pvc</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**Applying the Manifests  
**For each manifest file, need to apply them:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p>kubectl apply -f myapp-pv.yaml</p>
<p>kubectl apply -f myapp-pvc.yaml</p>
<p>kubectl apply -f myapp-secret.yaml</p>
<p>kubectl apply -f myapp-deployment.yaml</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## **Running E2E Tests**

- **Install Cypress or another E2E testing framework to test the
  > deployed application.**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>npx cypress <strong>run</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

> This command will open the Cypress Test Runner and create a cypress
> directory in your project, where you can write your test files.

- **Writing a Test Script**

> Create a test file in the cypress/e2e directory, for example,
> myapp.spec.js.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>// cypress/e2e/myapp.spec.js<br />
<strong>describe</strong>('MyApp E2E Tests', () =&gt; {<br />
<strong>beforeEach</strong>(() =&gt; {<br />
<strong>cy</strong>.visit('http://frontend.example.com'); // URL of the
frontend<br />
});<br />
<br />
<strong>it</strong>('loads the homepage', () =&gt; {<br />
<strong>cy</strong>.contains('Welcome to MyApp Frontend');<br />
});<br />
<br />
<strong>it</strong>('fetches data from the backend', () =&gt; {<br />
<strong>cy</strong>.intercept('GET', '/api/data').as('getData');<br />
<strong>cy</strong>.visit('http://frontend.example.com');<br />
<br />
<strong>cy</strong>.wait('@getData').its('response.statusCode').should('eq',
200);<br />
<strong>cy</strong>.get('#data').should('contain', 'Expected data from
backend');<br />
});<br />
<br />
<strong>it</strong>('handles form submission', () =&gt; {<br />
<strong>cy</strong>.get('input[name="username"]').type('testuser');<br />
<strong>cy</strong>.get('input[name="password"]').type('password');<br />
<strong>cy</strong>.get('button[type="submit"]').click();<br />
<br />
<strong>cy</strong>.url().should('include', '/dashboard');<br />
<strong>cy</strong>.contains('Welcome, testuser');<br />
});<br />
});</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

- **Running the Tests**

> You can run the tests using the Cypress Test Runner

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>npx cypress <strong>run</strong></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**<span class="mark">Note:</span>**

- Enable ingress controller for configure ingress, please run this
  > command

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>minikube addons enable ingress</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

- Integrate E2E Testing can be automated with CICD Pipeline

### **Validating Secrets Management**

#### **A. Check Secrets Status**

1.  **List Secrets:** kubectl get secrets

- Ensure the secret exists and is correctly named.

2.  **Describe the Secret**: kubectl describe secret myapp-secret

- This command provides details about the secret, including the number
  > of data items.

3.  **Verify Secrets Usage in Pods**

> **Use Secrets as Environment Variables:**

- Ensure that secrets are correctly being set as environment variables
  > in the pods.

**Validating Persistent Storage**

### **Persistent Volumes (PVs) and Persistent Volume Claims (PVCs)**

#### **A. Check PV and PVC Status**

1.  **List Persistent Volumes (PVs):**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>kubectl get pv</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

- Ensure that the PVs have the correct status (Bound), indicating they
  > are successfully bound to a PVC.

2.  **List Persistent Volume Claims (PVCs):**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th>kubectl get pvc</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

#### **B. Storage Capacity and Access Modes**

1.  **Check Storage Capacity:**

    - Ensure that the capacity defined in the PV matches the capacity
      > requested in the PVC.

2.  **Check Access Modes:**

    - Verify that the access modes (e.g., ReadWriteOnce, ReadOnlyMany,
      > ReadWriteMany) are correctly set and align with your
      > application's needs.
