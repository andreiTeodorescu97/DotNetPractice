# Play.Common
Common libraries used by Play Economy services.

## Create and publish package
```powershell
$version="1.0.10"
$owner="dotnetmicroservices"
$gh_pat="[PAT HERE]"

dotnet pack src\Play.Common\ --configuration Release -p:PackageVersion=$version -p:RepositoryUrl=https://github.com/$owner/play.common -o ..\packages

dotnet nuget push ..\packages\Play.Common.$version.nupkg --api-key $gh_pat --source "github"
```