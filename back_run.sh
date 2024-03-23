#!/bin/bash

SOLUTION_DIR="Module_.NET/WebApplication1"
CUSTOM_PROFILE="https"
CUSTOM_PROFILE_CONFIG="Module_.NET/WebApplication1/Properties/launchSettings.json"

cd "$SOLUTION_DIR" || exit
export ASPNETCORE_ENVIRONMENT="$CUSTOM_PROFILE"

dotnet build
dotnet run --project "WebApplication1.csproj" --configuration Debug --launch-profile "$CUSTOM_PROFILE" --additional-profiles "$CUSTOM_PROFILE_CONFIG"
