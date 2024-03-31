#!/bin/bash

SOLUTION_DIR="Module_.NET/WebApplication1"
CUSTOM_PROFILE="https"

cd "$SOLUTION_DIR" || exit

dotnet watch --project "WebApplication1.csproj" --configuration Debug --launch-profile "$CUSTOM_PROFILE"
