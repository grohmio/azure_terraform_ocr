resource "azurerm_resource_group" "ocr-rg" {
  name     = "ocr-service"
  location = var.location
}

resource "azurerm_cognitive_account" "ocr-ca" {
  name                  = "ocr-s1-123"
  location              = azurerm_resource_group.ocr-rg.location
  resource_group_name   = azurerm_resource_group.ocr-rg.name
  kind                  = "ComputerVision"
  sku_name              = "S1"
  custom_subdomain_name = "ocr-s1-123"
}

resource "azurerm_storage_account" "ocr-sa" {
  name                     = "ocrstoracc"
  resource_group_name      = azurerm_resource_group.ocr-rg.name
  location                 = azurerm_resource_group.ocr-rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_blob_public_access = true
}

resource "azurerm_storage_container" "ocr-image-sc" {
  name                  = "rawimages"
  storage_account_name  = azurerm_storage_account.ocr-sa.name
  container_access_type = "blob"
}

resource "azurerm_app_service_plan" "ocr-node-asp" {
  name                = "ocr-functions-node-service-plan"
  location            = azurerm_resource_group.ocr-rg.location
  resource_group_name = azurerm_resource_group.ocr-rg.name
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "ocr-node-fa" {
  name                       = "azure-terraform-ocr-node-functions"
  location                   = azurerm_resource_group.ocr-rg.location
  resource_group_name        = azurerm_resource_group.ocr-rg.name
  app_service_plan_id        = azurerm_app_service_plan.ocr-node-asp.id
  storage_account_name       = azurerm_storage_account.ocr-sa.name
  storage_account_access_key = azurerm_storage_account.ocr-sa.primary_access_key
  version                    = "~3"
  app_settings = {
    FUNCTIONS_WORKER_RUNTIME     = "node"
    WEBSITE_NODE_DEFAULT_VERSION = "~14"
  }

  identity {
    type = "SystemAssigned"
  }
}
