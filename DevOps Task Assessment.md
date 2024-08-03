# DevOps Task Assessment

## Part1:ProjectScope

ThisassessmentinvolvessettingupalocalKubernetesenvironmentusingMinikube,
implementingpersistentvolumes,secretsmanagement,andconfiguringdeployment
manifestsforbothfrontendandbackendservices.Theprojectwillalsoincludeorganising
anduploadingallnecessaryfilesandscriptstoaGitHubrepository.

## SettingUpMinikube

ThisREADMEprovidesacomprehensiveguidetosettingupMinikubeforalocalKubernetes
environment.MinikubeallowsyoutorunKubernetesclustersonyourlocalmachine,making
itanexcellenttoolfordevelopmentandtesting.

## Prerequisites

```
● OperatingSystem :Ubuntu.
● Virtualization: uwslonwindows.
● Tools: Installkubectlforinteractingwithyourcluster.
```
**1.Installation
1.1InstallingDocker**

```
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo apt install -y apt-transport-https ca-certificates curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo
apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee
/etc/apt/sources.list.d/kubernetes.list
```
**1.2InstallMinikube**

```
curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-a
md
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```
**1.3InstallKubectl**


```
curl -LO
https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version
```
**1.4StartingMinikubewithDockerDriver**

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
### 2.1DeployabackendApplication

Youcandeployasimpleapplication,suchaspython-application:

```
apiVersion : apps/v
kind : Deployment
metadata :
name : myapp
spec :
replicas : 1
selector :
matchLabels :
app : myapp
template :
metadata :
labels :
app : myapp
spec :
containers :
```
- **name** : myapp
    **image** : dmrsoft/ **myapp** :latest
    **volumeMounts** :
    - **name** : shared-volume
       **mountPath** : /app/config
    **ports** :
    - **containerPort** : 5000
    **env** :
    - **name** : ENVIRONMENT
       **value** : "production"
**volumes** :
- **name** : shared-volume


```
emptyDir : {}
```
### 2.2Createbackendservicemanifest

First,youneedaServiceforthemyappDeploymentifitisn'talreadydefined.Here'san
exampleservicemanifest:

```
apiVersion: v
kind: Service
metadata:
name: myapp-service
spec:
selector:
app: myapp
ports:
```
- protocol: TCP
    port: 5000
    targetPort: 5000

### 2.3DeployFrontendapp,serviceandingress:

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
```
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


```
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
```
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

### ConfigurationDetails

1. **FrontendDeployment** :
    ○ TheDeploymentrunsanNginxservertoservethestaticfrontendfiles.
    ○ TheConfigMapnamedfrontend-configshouldcontaintheHTML,CSS,
       andJavaScriptfilesforthefrontend.
2. **FrontendService** :
    ○ ExposestheNginxserverinternallyintheKubernetescluster.
3. **FrontendIngress** :
    ○ Exposesthefrontendserviceexternallyatthehost
       frontend.example.com.Replacethiswithyouractualdomain.
4. **BackendService** :


```
○ Exposesthebackendapplicationwithinthecluster.
```
### ● PVandPVC

APersistentVolume(PV)isapieceofstorageintheclusterthathasbeenprovisionedbyan
administratorordynamicallyprovisionedusingStorageClasses

```
apiVersion: v
kind: PersistentVolume
metadata:
name: myapp-pv
spec:
capacity:
storage: 10Gi
accessModes:
```
- ReadWriteOnce
persistentVolumeReclaimPolicy: Retain
storageClassName: manual
hostPath:
path: "/mnt/data"

APersistentVolumeClaim(PVC)isarequestforstoragebyauser.Itissimilartoapod.

```
apiVersion: v
kind: PersistentVolumeClaim
metadata:
name: myapp-pvc
spec:
accessModes:
```
- ReadWriteOnce
resources:
requests:
storage: 10Gi
storageClassName: manual

### ● KubernetesSecrets

KubernetesSecretsareusedtostoreandmanagesensitiveinformation,suchaspasswords,
OAuthtokens,andsshkeys.

**CreateaSecret**

YoucancreateaSecretusingaYAMLfile

```
apiVersion: v
```

```
kind: Secret
metadata:
name: myapp-secret
type: Opaque
data:
username: YWRtaW4= # Base64 encoded value of "admin"
password: MWYyZDFlMmU2N2Rm # Base64 encoded value of "1f2d1e2e67df"
```
Youcanuseecho -n 'admin' | base64toencodethevalues.

Using **kubectl create secret** command

```
kubectlcreatesecretgenericmyapp-secret\
--from-literal=username=admin\
--from-literal=password=1f2d1e2e67df
```
### ● UsingPVCandSecretintheDeployment

YoucanthenusethisPVCinyourDeploymentbyreferencingitinthevolumesand
volumeMountssections.

### UpdatedDeploymentManifest

Here'sanupdatedmyappDeploymentmanifestthatusesthePVC:

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
```
- name: myapp
    image: dmrsoft/myapp:latest
    volumeMounts:
    - name: config-volume
       mountPath: /app/config
    - name: data-volume


```
mountPath: /app/data
ports:
```
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

### ApplyingtheManifests

Foreachmanifestfile,needtoapplythem:

```
kubectl apply -f myapp-pv.yaml
kubectl apply -f myapp-pvc.yaml
kubectl apply -f myapp-secret.yaml
kubectl apply -f myapp-deployment.yaml
```
## RunningE2ETests

```
● InstallCypressoranotherE2Etestingframeworktotestthedeployedapplication.
```
```
npx cypress run
```
```
ThiscommandwillopentheCypressTestRunnerandcreateacypressdirectoryin
yourproject,whereyoucanwriteyourtestfiles.
```
```
● WritingaTestScript
```
```
Createatestfileinthecypress/e2edirectory,forexample,myapp.spec.js.
```

```
// cypress/e2e/myapp.spec.js
describe ('MyApp E2E Tests', () => {
beforeEach (() => {
cy .visit('http://frontend.example.com'); // URL of the frontend
});
```
```
it ('loads the homepage', () => {
cy .contains('Welcome to MyApp Frontend');
});
```
```
it ('fetches data from the backend', () => {
cy .intercept('GET', '/api/data').as('getData');
cy .visit('http://frontend.example.com');
```
```
cy .wait('@getData').its('response.statusCode').should('eq', 200 );
cy .get('#data').should('contain', 'Expected data from backend');
});
```
```
it ('handles form submission', () => {
cy .get('input[name="username"]').type('testuser');
cy .get('input[name="password"]').type('password');
cy .get('button[type="submit"]').click();
```
```
cy .url().should('include', '/dashboard');
cy .contains('Welcome, testuser');
});
});
```
```
● RunningtheTests
```
```
YoucanrunthetestsusingtheCypressTestRunner
```
```
npx cypress run
```
#### Note:

```
● Enableingresscontrollerforconfigureingress,pleaserunthiscommand
minikube addons enable ingress
● IntegrateE2ETestingcanbeautomatedwithCICDPipeline
```
### ValidatingSecretsManagement

**A.CheckSecretsStatus**

1. **ListSecrets:** kubectl get secrets
    ● Ensurethesecretexistsandiscorrectlynamed.


2. **DescribetheSecret** :kubectl describe secret myapp-secret

```
● Thiscommandprovidesdetailsaboutthesecret,includingthenumberof
dataitems.
```
3. **VerifySecretsUsageinPods**

```
UseSecretsasEnvironmentVariables:
```
```
● Ensurethatsecretsarecorrectlybeingsetasenvironmentvariablesinthe
pods.
```
### ValidatingPersistentStorage

### PersistentVolumes(PVs)andPersistentVolumeClaims(PVCs)

**A.CheckPVandPVCStatus**

**1. ListPersistentVolumes(PVs):**

```
kubectl get pv
● EnsurethatthePVshavethecorrectstatus(Bound),indicatingtheyaresuccessfully
boundtoaPVC.
```
**2. ListPersistentVolumeClaims(PVCs):**
    kubectl get pvc

**B.StorageCapacityandAccessModes**

**1. CheckStorageCapacity:**
    ○ EnsurethatthecapacitydefinedinthePVmatchesthecapacityrequestedin
       thePVC.
**2. CheckAccessModes:**
    ○ Verifythattheaccessmodes(e.g.,ReadWriteOnce,ReadOnlyMany,
       ReadWriteMany)arecorrectlysetandalignwithyourapplication'sneeds.


