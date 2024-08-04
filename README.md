# DevOps Task Assessment

## Part1: Project Scope

This assessment involves setting up a local Kubernetes environment using Minikube, implementing persistent volumes, secrets management, and configuring deployment manifests for both frontend and backend services. The project will also include organising and uploading all necessary files and scripts to a GitHub repository.

## Setting Up Minikube

This README provides a comprehensive guide to setting up Minikube for a local Kubernetes environment. Minikube allows you to run Kubernetes clusters on your local machine, making it an excellent tool for development and testing.

## Prerequisites

```
Operating System: Ubuntu.
Virtualization: uwsl on windows.
Tools: Install kubectl for interacting with your cluster.
```
**1. Installation
1.1 Installing Docker**

```
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo apt install -y apt-transport-https ca-certificates curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo
apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee/etc/apt/sources.list.d/kubernetes.list
```
**1.2 Install Minikube**

```
curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-a
md
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```
**1.3 Install Kubectl**


```
curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```
**1.4 Starting Minikube with Docker Driver**

```
minikube start --driver =docker
# If you encounter root privileges error, run:
minikube start --driver =docker --force
minikube status
kubectl cluster-info
kubectl config view
kubectl get nodes
kubectl get pods
```
### 2.1 Deploy backend Application

You can deploy a simple application, such as python-application:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: dmrsoft/myapp:latest
        volumeMounts:
        - name: shared-volume
          mountPath: /app/config
        ports:
        - containerPort: 5000
        env:
        - name: ENVIRONMENT
          value: "production"
      volumes:
      - name: shared-volume
        emptyDir: {}
```
### 2.2 Create backend service manifest

First, you need a Service for the myapp Deployment if it isn't already defined. Here's an example service manifest:
```
apiVersion: v
kind: Service
metadata:
name: myapp-service
spec:
selector:
app: myapp
ports:
- protocol: TCP
    port: 5000
    targetPort: 5000
```
### 2.3 Deploy Frontend app, service and ingress:
```
apiVersion: apps/v
kind: Deployment
metadata:
name: frontend
spec:
replicas: 1
selector:
matchLabels:
app: frontend
template:
metadata:
labels:
app: frontend
spec:
containers:
- name: frontend
    image: nginx:latest# Nginx to serve static files
    volumeMounts:
    - name: frontend-volume
       mountPath: /usr/share/nginx/html
    ports:
    - containerPort: 80
volumes:
- name: frontend-volume
    configMap:
       name: frontend-config
---
apiVersion: v
kind: Service
metadata:
name: frontend-service
spec:
selector:
app: frontend
ports:
- protocol: TCP
    port: 80
    targetPort: 80
---
apiVersion: networking.k8s.io/v
kind: Ingress
metadata:
name: frontend-ingress
annotations:
nginx.ingress.kubernetes.io/rewrite-target: /
spec:
rules:
- host: frontend.example.com
[http:](http:)
paths:
- path: /
pathType: Prefix
backend:
service:
name: frontend-service
port:
number: 80
```
### Configuration Details

1. **Frontend Deployment** :
    ○ The Deployment runs an Nginx server to serve the static frontend files.
    ○ The ConfigMap named frontend-config should contain the HTML, CSS, and JavaScript files for the frontend.

2. **Frontend Service** :
    ○ Exposes the Nginx server internally in the Kubernetes cluster.

3. **Frontend Ingress** :
    ○ Exposes the frontend service externally at the host frontend.example.com. Replace this with your actual domain.
4. **Backend Service** :
    ○ Exposes the backend application within the cluster.
### ● PV and PVC

A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes

```
apiVersion: v
kind: PersistentVolume
metadata:
name: myapp-pv
spec:
capacity:
storage: 10Gi
accessModes:
- ReadWriteOnce
persistentVolumeReclaimPolicy: Retain
storageClassName: manual
hostPath:
path: "/mnt/data"
```
A PersistentVolumeClaim (PVC) is a request for storage by a user. It is similar to a pod.

```
apiVersion: v
kind: PersistentVolumeClaim
metadata:
name: myapp-pvc
spec:
accessModes:
- ReadWriteOnce
resources:
requests:
storage: 10Gi
storageClassName: manual
```
### ● Kubernetes Secrets

Kubernetes Secrets are used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.

**Create a Secret**

You can create a Secret using a YAML file

```
apiVersion: v
kind: Secret
metadata:
name: myapp-secret
type: Opaque
data:
username: YWRtaW4= # Base64 encoded value of "admin"
password: MWYyZDFlMmU2N2Rm # Base64 encoded value of "1f2d1e2e67df"
```
You can use echo -n 'admin' | base64toencodethevalues.

Using **kubectl create secret** command

```
kubectl create secret generic myapp-secret\
--from-literal=username=admin\
--from-literal=password=1f2d1e2e67df
```
### ● Using PVC and Secret in the Deployment

You can then use this PVC in your Deployment by referencing it in the volumes and volumeMounts sections.

### Updated Backend Deployment Manifest

Here's an updated myapp Deployment manifest that uses the PVC:

```
apiVersion: apps/v
kind: Deployment
metadata:
name: myapp
spec:
replicas: 1
selector:
matchLabels:
app: myapp
template:
metadata:
labels:
app: myapp
spec:
containers:
- name: myapp
    image: dmrsoft/myapp:latest
    volumeMounts:
    - name: config-volume
       mountPath: /app/config
    - name: data-volume
       mountPath: /app/data
ports:
- containerPort: 5000
env:
- name: ENVIRONMENT
    value: "production"
- name: USERNAME
    valueFrom:
       secretKeyRef:
          name: myapp-secret
          key: username
- name: PASSWORD
    valueFrom:
       secretKeyRef:
          name: myapp-secret
          key: password
volumes:
- name: config-volume
emptyDir: {}
- name: data-volume
persistentVolumeClaim:
claimName: myapp-pvc
```
### Applying the Manifests

For each manifest file, need to apply them:

```
kubectl apply -f myapp-pv.yaml
kubectl apply -f myapp-pvc.yaml
kubectl apply -f myapp-secret.yaml
kubectl apply -f myapp-deployment.yaml
```
## Running E2E Tests

● Install Cypress or another E2E testing framework to test the deployed application.
```
npx cypress run
```
This command will open the Cypress Test Runner and create a cypress directory in your project, where you can write your test files.

● Writing a Test Script
```
Create a test file in the cypress/e2e directory, for example, myapp.spec.js.
```
```
// cypress/e2e/myapp.spec.js
describe ('MyApp E2E Tests', () => {
beforeEach (() => {
cy .visit('http://frontend.example.com'); // URL of the frontend
});
it ('loads the homepage', () => {
cy .contains('Welcome to MyApp Frontend');
});
it ('fetches data from the backend', () => {
cy .intercept('GET', '/api/data').as('getData');
cy .visit('http://frontend.example.com');

cy .wait('@getData').its('response.statusCode').should('eq', 200 );
cy .get('#data').should('contain', 'Expected data from backend');
});
it ('handles form submission', () => {
cy .get('input[name="username"]').type('testuser');
cy .get('input[name="password"]').type('password');
cy .get('button[type="submit"]').click();

cy .url().should('include', '/dashboard');
cy .contains('Welcome, testuser');
});
});
```
● Running the tests
You can run the tests using the Cypress Test Runner
```
npx cypress run
```
#### Note:

● Enable ingress controller for configure ingress, please run this command
minikube addons enable ingress
● Integrate E2E Testing can be automated with CICD Pipeline
● Not need to expose the Backend external to the internet..
### Validating Secrets Management

**A. Check Secrets Status**

1. **ListSecrets:** ```kubectl get secrets```
    ● Ensure the secret exists and is correctly named.


2. **Describe the Secret** : ```kubectl describe secret myapp-secret```

● This command provides details about the secret, including the number of data items.
3. **Verify Secrets Usage in Pods**
Use Secrets as Environment Variables:
● Ensure that secrets are correctly being set as environment variables in the pods.
### Validating Persistent Storage

### Persistent Volumes(PVs) and Persistent Volume Claims(PVCs)

**A. Check PV and PVCStatus**

**1. List Persistent Volumes(PVs):**

```
kubectl get pv
```
● Ensure that the PVs have the correct status (Bound), indicating they are successfully bound to a PVC.

**2. List Persistent Volume Claims(PVCs):**
```
kubectl get pvc
```
**B. Storage Capacity and Access Modes**

**1. Check Storage Capacity:**
    ○ Ensure that the capacity defined in the PV matches the capacity requested in the PVC.
**2. Check Access Modes:**
    ○ Verify that the access modes (e.g., ReadWriteOnce, ReadOnlyMany, ReadWriteMany) are correctly set and align with your application's needs.
### Part 2: DevOps Lumofy Task
***Please check the following [URL](https://docs.google.com/document/d/1_sDVnV8O03ZUH37wVO-aFgrJZOZ3SiyIo0xW-VXpztg/edit?usp=sharing)