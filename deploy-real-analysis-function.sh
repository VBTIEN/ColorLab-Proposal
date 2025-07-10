#!/bin/bash

echo "🚀 Deploying Real Image Analysis Lambda Function"
echo "================================================"

FUNCTION_NAME="ai-image-analyzer-real-analysis"
LAYER_ARN="arn:aws:lambda:ap-southeast-1:741448948262:layer:real-image-analysis-layer:1"
ROLE_ARN="arn:aws:iam::741448948262:role/lambda-execution-role"
REGION="ap-southeast-1"

echo ""
echo "📦 Creating deployment package..."
echo "--------------------------------"
cd /mnt/d/project/ai-image-analyzer-workshop/
zip -r real-analysis-function.zip lambda_function_real_analysis.py

echo ""
echo "📊 Package info:"
ls -lh real-analysis-function.zip

echo ""
echo "☁️  Creating Lambda function..."
echo "------------------------------"
aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --runtime python3.11 \
  --role $ROLE_ARN \
  --handler lambda_function_real_analysis.lambda_handler \
  --zip-file fileb://real-analysis-function.zip \
  --description "Real Image Analysis with PIL and numpy - processes actual pixels" \
  --timeout 120 \
  --memory-size 2048 \
  --layers $LAYER_ARN \
  --environment Variables='{ANALYSIS_TYPE=real_processing,PIL_AVAILABLE=true}' \
  --region $REGION

echo ""
echo "⚙️  Updating API Gateway to use new function..."
echo "----------------------------------------------"

# Get API Gateway info
API_ID="spsvd9ec7i"
RESOURCE_ID="3bds2i"  # {proxy+} resource

# Update integration to point to new function
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method ANY \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:741448948262:function:$FUNCTION_NAME/invocations" \
  --region $REGION

# Add permission for API Gateway to invoke the new function
aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id apigateway-invoke-real-analysis \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:741448948262:$API_ID/*/*" \
  --region $REGION

echo ""
echo "🚀 Deploying API Gateway changes..."
echo "-----------------------------------"
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod \
  --description "Deploy real image analysis function $(date)" \
  --region $REGION

echo ""
echo "⏳ Waiting for deployment..."
sleep 10

echo ""
echo "🧪 Testing new real analysis function..."
echo "----------------------------------------"
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo "Testing health endpoint..."
curl -s "$API_URL/health" | jq '.'

echo ""
echo "✅ Real Analysis Function deployed successfully!"
echo ""
echo "📋 Summary:"
echo "  Function Name: $FUNCTION_NAME"
echo "  Layer: $LAYER_ARN"
echo "  API URL: $API_URL"
echo "  Memory: 2048 MB"
echo "  Timeout: 120 seconds"
echo ""
echo "🎯 Next steps:"
echo "1. Test with real image: $API_URL/analyze"
echo "2. Check CloudWatch logs for detailed processing"
echo "3. Compare results with different images"
