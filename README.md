# <a name="_oxept21bfwq9"></a>**DevOps Task Assessment**
## <a name="_4kkzp9rmz4do"></a>**Part 1: Project Scope**
This assessment involves setting up a local Kubernetes environment using Minikube, implementing persistent volumes, secrets management, and configuring deployment manifests for both frontend and backend services. The project will also include organising and uploading all necessary files and scripts to a GitHub repository.
## <a name="_f94hilza2e6p"></a>**Setting Up Minikube**
This README provides a comprehensive guide to setting up Minikube for a local Kubernetes environment. Minikube allows you to run Kubernetes clusters on your local machine, making it an excellent tool for development and testing.
## <a name="_hoki4rwzrl2i"></a>**Prerequisites**
- #### **Operating System**: Ubuntu.
- #### <a name="_5hgdzbafvc1h"></a>**Virtualization:** uwsl on windows**.**
- #### <a name="_j9aupr7m90kj"></a>**Tools:** Install kubectl for interacting with your cluster.
#### <a name="_c3im1o8o13jf"></a>**1. Installation**
#### <a name="_liodv08bxhe8"></a>**1.1 Installing Docker**

|sudo apt update<br>sudo apt install docker.io<br>sudo systemctl start docker<br>sudo systemctl enable docker<br>sudo apt install -y apt-transport-https ca-certificates curl<br>curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -<br>echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list|
| :- |

**1.2 Install Minikube**

|curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64<br>sudo install minikube-linux-amd64 /usr/local/bin/minikube<br>minikube version|
| :- |


**1.3 Install Kubectl**

|<p>curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64</p><p>sudo install minikube-linux-amd64 /usr/local/bin/minikube</p><p>minikube version</p>|
| :- |

**1.4 Starting Minikube with Docker Driver**

|minikube start **--driver**=docker<br># If you encounter root privileges error, run:<br>minikube start **--driver**=docker --force<br>minikube status<br>kubectl cluster-info<br>kubectl config view<br>kubectl get nodes<br>kubectl get pods|
| :- |
### <a name="_wpcviijh9stz"></a>**2.1 Deploy a backend Application**
You can deploy a simple application, such as python-application:

|**apiVersion**: apps/v1<br>**kind**: Deployment<br>**metadata**:<br>`  `**name**: myapp<br>**spec**:<br>`  `**replicas**: 1<br>`  `**selector**:<br>`    `**matchLabels**:<br>`      `**app**: myapp<br>`  `**template**:<br>`    `**metadata**:<br>`      `**labels**:<br>`        `**app**: myapp<br>`    `**spec**:<br>`      `**containers**:<br>`      `- **name**: myapp<br>`        `**image**: dmrsoft/**myapp**:latest<br>`        `**volumeMounts**:<br>`        `- **name**: shared-volume<br>`          `**mountPath**: /app/config<br>`        `**ports**:<br>`        `- **containerPort**: 5000<br>`        `**env**:<br>`        `- **name**: ENVIRONMENT<br>`          `**value**: "production"<br>`      `**volumes**:<br>`      `- **name**: shared-volume<br>`        `**emptyDir**: {}|
| :- |

**2.2 Create backend service manifest**
First, you need a Service for the myapp Deployment if it isn't already defined. Here's an example service manifest:

|<p>apiVersion: v1</p><p>kind: Service</p><p>metadata:</p><p>`  `name: myapp-service</p><p>spec:</p><p>`  `selector:</p><p>`    `app: myapp</p><p>`  `ports:</p><p>`    `- protocol: TCP</p><p>`      `port: 5000</p><p>`      `targetPort: 5000</p>|
| :- |

**2.3 Deploy Frontend app, service and ingress:**

|<p>apiVersion: apps/v1</p><p>kind: Deployment</p><p>metadata:</p><p>`  `name: frontend</p><p>spec:</p><p>`  `replicas: 1</p><p>`  `selector:</p><p>`    `matchLabels:</p><p>`      `app: frontend</p><p>`  `template:</p><p>`    `metadata:</p><p>`      `labels:</p><p>`        `app: frontend</p><p>`    `spec:</p><p>`      `containers:</p><p>`      `- name: frontend</p><p>`        `image: nginx:latest # Nginx to serve static files</p><p>`        `volumeMounts:</p><p>`        `- name: frontend-volume</p><p>`          `mountPath: /usr/share/nginx/html</p><p>`        `ports:</p><p>`        `- containerPort: 80</p><p>`      `volumes:</p><p>`      `- name: frontend-volume</p><p>`        `configMap:</p><p>`          `name: frontend-config</p><p>---</p><p>apiVersion: v1</p><p>kind: Service</p><p>metadata:</p><p>`  `name: frontend-service</p><p>spec:</p><p>`  `selector:</p><p>`    `app: frontend</p><p>`  `ports:</p><p>`    `- protocol: TCP</p><p>`      `port: 80</p><p>`      `targetPort: 80</p><p>---</p><p>apiVersion: networking.k8s.io/v1</p><p>kind: Ingress</p><p>metadata:</p><p>`  `name: frontend-ingress</p><p>`  `annotations:</p><p>`    `nginx.ingress.kubernetes.io/rewrite-target: /</p><p>spec:</p><p>`  `rules:</p><p>`    `- host: frontend.example.com</p><p>`      `http:</p><p>`        `paths:</p><p>`          `- path: /</p><p>`            `pathType: Prefix</p><p>`            `backend:</p><p>`              `service:</p><p>`                `name: frontend-service</p><p>`                `port:</p><p>`                  `number: 80</p>|
| :- |
### <a name="_8w0un3w6u46o"></a>**Configuration Details**
1. **Frontend Deployment**:
   1. The Deployment runs an Nginx server to serve the static frontend files.
   1. The ConfigMap named frontend-config should contain the HTML, CSS, and JavaScript files for the frontend.
1. **Frontend Service**:
   1. Exposes the Nginx server internally in the Kubernetes cluster.
1. **Frontend Ingress**:
   1. Exposes the frontend service externally at the host frontend.example.com. Replace this with your actual domain.
1. **Backend Service**:
   1. Exposes the backend application within the cluster.

- **PV and PVC**

A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes

|apiVersion: v1<br>kind: PersistentVolume<br>metadata:<br>`  `name: myapp-pv<br>spec:<br>`  `capacity:<br>`    `storage: 10Gi<br>`  `accessModes:<br>`    `- ReadWriteOnce<br>`  `persistentVolumeReclaimPolicy: Retain<br>`  `storageClassName: manual<br>`  `hostPath:<br>`    `path: "/mnt/data"|
| :- |

A PersistentVolumeClaim (PVC) is a request for storage by a user. It is similar to a pod.

|apiVersion: v1<br>kind: PersistentVolumeClaim<br>metadata:<br>`  `name: myapp-pvc<br>spec:<br>`  `accessModes:<br>`    `- ReadWriteOnce<br>`  `resources:<br>`    `requests:<br>`      `storage: 10Gi<br>`  `storageClassName: manual|
| :- |
- ### <a name="_yfmtabw1ns5i"></a>**Kubernetes Secrets**
### Kubernetes Secrets are used to store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.
### <a name="_iyygv8ywu5ns"></a>**Create a Secret**
### <a name="_2othra95qan"></a>You can create a Secret using a YAML file

|apiVersion: v1<br>kind: Secret<br>metadata:<br>`  `name: myapp-secret<br>type: Opaque<br>data:<br>`  `username: YWRtaW4=    # Base64 encoded value of "admin"<br>`  `password: MWYyZDFlMmU2N2Rm   # Base64 encoded value of "1f2d1e2e67df"|
| :- |
### <a name="_6hvj825cwp01"></a>You can use echo -n 'admin' | base64 to encode the values.
### <a name="_1lwea9xtuy4m"></a>Using **kubectl create secret** command

|kubectl create secret generic myapp-secret \ <br>--from-literal=username=admin \ <br>--from-literal=password=1f2d1e2e67df|
| :- |
- ### <a name="_jtt39axzwr6w"></a>**Using PVC and Secret in the Deployment**
You can then use this PVC in your Deployment by referencing it in the volumes and volumeMounts sections.
#### <a name="_j2bef7jc168t"></a>**Updated Deployment Manifest**
Here's an updated myapp Deployment manifest that uses the PVC:

|<p>apiVersion: apps/v1</p><p>kind: Deployment</p><p>metadata:</p><p>`  `name: myapp</p><p>spec:</p><p>`  `replicas: 1</p><p>`  `selector:</p><p>`    `matchLabels:</p><p>`      `app: myapp</p><p>`  `template:</p><p>`    `metadata:</p><p>`      `labels:</p><p>`        `app: myapp</p><p>`    `spec:</p><p>`      `containers:</p><p>`      `- name: myapp</p><p>`        `image: dmrsoft/myapp:latest</p><p>`        `volumeMounts:</p><p>`        `- name: config-volume</p><p>`          `mountPath: /app/config</p><p>`        `- name: data-volume</p><p>`          `mountPath: /app/data</p><p>`        `ports:</p><p>`        `- containerPort: 5000</p><p>`        `env:</p><p>`        `- name: ENVIRONMENT</p><p>`          `value: "production"</p><p>`        `- name: USERNAME</p><p>`          `valueFrom:</p><p>`            `secretKeyRef:</p><p>`              `name: myapp-secret</p><p>`              `key: username</p><p>`        `- name: PASSWORD</p><p>`          `valueFrom:</p><p>`            `secretKeyRef:</p><p>`              `name: myapp-secret</p><p>`              `key: password</p><p>`      `volumes:</p><p>`      `- name: config-volume</p><p>`        `emptyDir: {}</p><p>`      `- name: data-volume</p><p>`        `persistentVolumeClaim:</p><p>`          `claimName: myapp-pvc</p><p></p>|
| :- |
**Applying the Manifests**
For each manifest file, need to apply them:

|<p>kubectl apply -f myapp-pv.yaml </p><p>kubectl apply -f myapp-pvc.yaml</p><p>kubectl apply -f myapp-secret.yaml </p><p>kubectl apply -f myapp-deployment.yaml</p>|
| :- |
## <a name="_lllorc4qmkmv"></a>**Running E2E Tests**
- **Install Cypress or another E2E testing framework to test the deployed application.**

|npx cypress **run**|
| :- |

This command will open the Cypress Test Runner and create a cypress directory in your project, where you can write your test files.

- **Writing a Test Script**

  Create a test file in the cypress/e2e directory, for example, myapp.spec.js.

|// cypress/e2e/myapp.spec.js<br>**describe**('MyApp E2E Tests', () => {<br>`  `**beforeEach**(() => {<br>`    `**cy**.visit('http://frontend.example.com'); // URL of the frontend<br>`  `});<br><br>`  `**it**('loads the homepage', () => {<br>`    `**cy**.contains('Welcome to MyApp Frontend');<br>`  `});<br><br>`  `**it**('fetches data from the backend', () => {<br>`    `**cy**.intercept('GET', '/api/data').as('getData');<br>`    `**cy**.visit('http://frontend.example.com');<br><br>`    `**cy**.wait('@getData').its('response.statusCode').should('eq', 200);<br>`    `**cy**.get('#data').should('contain', 'Expected data from backend');<br>`  `});<br><br>`  `**it**('handles form submission', () => {<br>`    `**cy**.get('input[name="username"]').type('testuser');<br>`    `**cy**.get('input[name="password"]').type('password');<br>`    `**cy**.get('button[type="submit"]').click();<br><br>`    `**cy**.url().should('include', '/dashboard');<br>`    `**cy**.contains('Welcome, testuser');<br>`  `});<br>});|
| :- |

- **Running the Tests**

  You can run the tests using the Cypress Test Runner

|npx cypress **run**|
| :- |

**Note:** 

- Enable ingress controller for configure ingress, please run this command

  |minikube addons enable ingress|
  | :- |

- Integrate E2E Testing can be automated with CICD Pipeline
### <a name="_qe3478txst4b"></a>**Validating Secrets Management**
#### <a name="_ta96dqubbm89"></a>**A. Check Secrets Status**
1. **List Secrets:** kubectl get secrets
- Ensure the secret exists and is correctly named.

1. **Describe the Secret**: kubectl describe secret myapp-secret

- This command provides details about the secret, including the number of data items.
1. **Verify Secrets Usage in Pods**

   **Use Secrets as Environment Variables:**

- Ensure that secrets are correctly being set as environment variables in the pods.

**Validating Persistent Storage**
### <a name="_63hhamzzxrl"></a>**Persistent Volumes (PVs) and Persistent Volume Claims (PVCs)**
#### <a name="_pc3xrio7w0ma"></a>**A. Check PV and PVC Status**
1. **List Persistent Volumes (PVs):**

|kubectl get pv|
| :- |

- Ensure that the PVs have the correct status (Bound), indicating they are successfully bound to a PVC.

1. **List Persistent Volume Claims (PVCs):**

|kubectl get pvc|
| :- |
#### <a name="_s9cvj75e1dpv"></a>**B. Storage Capacity and Access Modes**
1. **Check Storage Capacity:**
   1. Ensure that the capacity defined in the PV matches the capacity requested in the PVC.
1. **Check Access Modes:**
   1. Verify that the access modes (e.g., ReadWriteOnce, ReadOnlyMany, ReadWriteMany) are correctly set and align with your application's needs.

