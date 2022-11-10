# azure_terraform_ocr

## purpose
* simple example doing OCR using Azure Function Apps, Cognitive Services Blob Storage in combination with terraform

## initial setup project from scratch
* prerequisits `azure-cli`, `azure subscription`
* fork this repo

### create Service Principal
* `azure-cli` login
```shell
az login
```
* list subscriptions
```shell
az account list
```

* set correct subscription
```shell
az account set --subscription="...<SUBSCRIPTION_ID>..."
```

* create service account
```shell
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/...<SUBSCRIPTION_ID>..."

{
"appId": "...",
"displayName": "...",
"name": "...",
"password": "...",
"tenant": "..."
}
```

* remember these mappings
```shell
ARM_CLIENT_ID = appId
ARM_CLIENT_SECRET = password
ARM_TENANT_ID = tenant
ARM_SUBSCRIPTION_ID can be found in the `Azure Portal` or in the `Service Principal` account `id`
```

* login as `Service Principal`
```shell
az login --service-principal -u <client-id> -p <client-secret> --tenant <tenant-id>
```

* set values in `github`>>`settings`>>`secrets`
```
ARM_CLIENT_ID="..."
ARM_CLIENT_SECRET="..."
ARM_SUBSCRIPTION_ID="..."
ARM_TENANT_ID="..."
```

## manual setup
* you need `terraform` installed
* follow [setup terraform tfstate in azure](##setup terraform tfstate in azure)
* login as `Service Principal`
```shell
az login --service-principal -u <client-id> -p <client-secret> --tenant <tenant-id>
```

* init project
```shell
terraform init -reconfigure
```

* plan, execute following command and enter credentials
```shell
terraform plan -out "planfile"
```

* apply
```shell
terraform apply -input=false "planfile"
```

## setup terraform tfstate in azure
* generate resource group `azure-terraform-ocr-tfstate` in azure console
* generate storage account `tfstatestoraccXYZ` in azure console, this is a custom value and need to be globaly unique in azure, remember the `key` under menu `Access keys`, deactivate `Enable blob public access`, chose `LRS`
* generate storage container `tfstatestorcon` in azure console
* set values in `github`>>`settings`>>`secrets>>actions`
```
AZDO_PERSONAL_ACCESS_TOKEN=...key...
TFSTATE_STORAGE_ACCOUNT_NAME=tfstatestoraccXYZ
TF_VAR_CUSTOMIZERE=...<custom and unique code for url's, e.g. '0815'>...
```

## set up azure function
* select function folder
```shell
cd azure_functions
```

* install function build tools
```shell
npm install -g azure-functions-core-tools@3 --unsafe-perm true
```
or 

```shell
brew tap azure/functions
brew install azure-functions-core-tools@3
```

* initialize function project
```shell
func init
```

* start function locally
```shell
func start
```

* deploy function
```shell
npm ci
func azure functionapp publish azure-terraform-ocr-node-functions
```

## setup pipeline
TODO

## further reads
* [Documentation Microsoft Cloud Computer Vision](https://docs.microsoft.com/de-de/azure/cognitive-services/computer-vision/)
* [Cognitive Services Javascript Sample](https://github.com/Azure-Samples/js-e2e-client-cognitive-services/tree/main/)
* [create BlobTrigger function](https://docs.microsoft.com/de-de/azure/azure-functions/functions-create-storage-blob-triggered-function)
* [terraform azurerm_function_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/function_app)
* [Quick Start: Cognitive Services Read API Node.js](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts-sdk/client-library?tabs=visual-studio&pivots=programming-language-javascript)
* [Cognitive Services API Documentation](https://centraluseuap.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005)
* [Cognitive Services Daocker Image](https://hub.docker.com/_/microsoft-azure-cognitive-services-vision-read)
* [Computer Vision Costs S1](https://azure.microsoft.com/de-de/pricing/details/cognitive-services/)
