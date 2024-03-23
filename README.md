# DICOM Manager

To run the project execute run.sh

To run project individually:

## Client
Execute front_run.sh

## Backend
Execute back_run.sh

## Azure Function
Execute func_run.sh


Install the following extensions for Azure:
- Azure functions
- Azure Account
- Azure Ressources
- Azure Static Web Apps
- Azure Storage
- Azurite

Run the following; 
npm install -g azure-functions-core-tools@4 --unsafe-perm true
npm install -g azurite

To update local blob storage cors, manually modify \__azurite_db_blob__.json