terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.60.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "azure-terraform-ocr-tfstate"
    storage_account_name = var.storage_account_name
    container_name       = "tfstatestorcon"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}
