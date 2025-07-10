#!/bin/bash

# Cleanup script for old API files
# This script removes old Lambda function files and outdated configurations

echo "🧹 Cleaning up old API files..."

# Remove old Lambda function files
echo "Removing old Lambda function files..."
rm -f lambda_function_accurate_color.py
rm -f lambda_function_builtin_only.py
rm -f lambda_function_color_fixed.py
rm -f lambda_function_color_harmony_v11.py
rm -f lambda_function_improved.py
rm -f lambda_function_no_numpy.py
rm -f lambda_function_real_analysis.py
rm -f lambda_function_simple_real.py

# Keep the current main files:
# - lambda_function.py (current main)
# - lambda_function_restful_api.py (backup)

# Remove old deployment packages
echo "Removing old deployment packages..."
rm -f lambda-v11-deployment.zip
rm -f corrected-folder-fix.zip
rm -f simple-test.zip

# Remove old test files
echo "Removing old test files..."
rm -f simple-payload.json
rm -f simple-test-payload.json
rm -f options-payload.json
rm -f test-simple.json
rm -f test-payload-real.json

# Remove old response files
echo "Removing old response files..."
rm -f response-enhanced.json
rm -f response-fixed.json
rm -f response-professional.json
rm -f response-real.json
rm -f response-v2.json
rm -f response.json

# Remove old requirements files
echo "Removing old requirements files..."
rm -f requirements_real_analysis.txt

# Remove old web interface files (keep main ones)
echo "Cleaning up old web interface files..."
cd web/
rm -f index-backup-20250706-185858.html
rm -f index-cau-truc-moi.html
rm -f index-color-fixed.html
rm -f index-color-harmony-v11.html
rm -f index-fastapi-test.html
rm -f index-final-enhanced.html
rm -f index-fixed-complete.html
rm -f index-fixed.html
rm -f index-merged-v11.html
rm -f index-professional.html
rm -f index-responsive-improved.html
rm -f index-tieng-viet-backup.html
rm -f index-tieng-viet.html
rm -f index_backup.html
rm -f index_old.html
rm -f restful-api-demo.html
rm -f temp_script.txt

# Remove old analysis JS files
rm -f color-fixed-analysis.js
rm -f enhanced-analysis.js
rm -f fixed-analysis.js

cd ..

echo "✅ Cleanup completed!"
echo ""
echo "📋 Remaining important files:"
echo "  - lambda_function.py (current main Lambda function)"
echo "  - lambda_function_restful_api.py (backup)"
echo "  - web/index.html (main web interface)"
echo "  - web/index-updated-api.html (FastAPI interface)"
echo "  - web/test.html (API testing interface)"
echo ""
echo "🚀 Current API endpoint: https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
