variable "location" {
  type        = string
  description = "azure region where the resources will be created"
  default     = "westeurope"
}

variable "COGNITIVE_SERVICE_ACCOUNT_NAME" {
  type        = string
  description = "azure cognitive service account name, needs to be unique because of use in url"
}

variable "OCR_STORAGE_ACCOUNT_NAME" {
  type        = string
  description = "azure storage account name, , needs to be unique because of use in url"
}
