# Play.Trading
Play Economy Trading microservice

## Build the docker image
```powershell
$version="1.0.2"
$env:GH_OWNER="dotnetmicroservices"
$env:GH_PAT="[PAT HERE]"
$appname="playeconomy"
docker build --secret id=GH_OWNER --secret id=GH_PAT -t "$appname.azurecr.io/play.trading:$version" .
```

## Run the docker image
```powershell
$cosmosDbConnString="[CONN STRING HERE]"
$serviceBusConnString="[CONN STRING HERE]"
docker run -it --rm -p 5006:5006 --name trading -e MongoDbSettings__ConnectionString=$cosmosDbConnString -e ServiceBusSettings__ConnectionString=$serviceBusConnString -e ServiceSettings__MessageBroker="SERVICEBUS" play.trading:$version
```

## Publishing the Docker image
```powershell
az acr login --name $appname
docker push "$appname.azurecr.io/play.trading:$version"
```

## Creating the Azure Managed Identity and granting it access to Key Vault secrets
```powershell
$namespace="trading"
az identity create --resource-group $appname --name $namespace
$IDENTITY_CLIENT_ID=az identity show -g $appname -n $namespace --query clientId -otsv
az keyvault set-policy -n $appname --secret-permissions get list --spn $IDENTITY_CLIENT_ID
```

## Establish the federated identity credential
```powershell
$AKS_OIDC_ISSUER=az aks show -g $appname -n $appname --query oidcIssuerProfile.issuerUrl -otsv

az identity federated-credential create --name $namespace --identity-name $namespace --resource-group $appname --issuer $AKS_OIDC_ISSUER --subject "system:serviceaccount:${namespace}:${namespace}-serviceaccount"
```

## Install the Helm chart
```powershell
$helmUser=[guid]::Empty.Guid
$helmPassword=az acr login --name $appname --expose-token --output tsv --query accessToken

helm registry login "$appname.azurecr.io" --username $helmUser --password $helmPassword

$chartVersion="0.1.0"
helm upgrade trading-service oci://$appname.azurecr.io/helm/microservice --version $chartVersion -f .\helm\values.yaml --set image.tag=$version -n $namespace --install --create-namespace
```

## Required repository secrets for GitHub workflow
GH_PAT: Created in GitHub user profile --> Settings --> Developer settings --> Personal access token
AZURE_CLIENT_ID: From AAD App Registration
AZURE_SUBSCRIPTION_ID: From Azure Portal subscription
AZURE_TENANT_ID: From AAD properties page