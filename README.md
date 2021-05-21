# azure_terraform_ocr

## initial setup project from scratch
* prerequisits `azure-cli`, `azure subscription`
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
ARM_SUBSCRIPTION_ID can be found in the `Service Principal` account
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
* generate storage account `tfstate-sa` in azure console, remember the `key` under menu `Access keys`,
* generate storage container `tfstate-sc` in azure console
* set values in `github`>>`settings`>>`secrets`
  AZDO_PERSONAL_ACCESS_TOKEN="..."
  
## setup pipeline
valheim automatic deployment to azure
