# Play.Common

Common nugget repo

## Create and publish nugget package

```powershell
$version="1.0.10"
$owner="dotnetmicroservices997"
$gt_pat="GITHUB SECRET"

dotnet pack src\Play.Common --configuration Release -p:PackageVersion=$version -p:RepositoryUrl=https://github.com/$owner/play.common -o ..\packages
dotnet nuget push ..\packages\Play.Common.$version.nupkg --api-key $gt_pat --source "github"
```