#!/bin/bash

echo "🧪 Testing Real AI Vision API"
echo "=============================="

API_ENDPOINT="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

echo "Testing root endpoint..."
curl -s "$API_ENDPOINT/" | head -c 200
echo ""
echo ""

echo "Testing health endpoint..."
curl -s "$API_ENDPOINT/health" | head -c 200
echo ""
echo ""

echo "Testing with POST method..."
curl -s -X POST "$API_ENDPOINT/" -H "Content-Type: application/json" -d '{}' | head -c 200
echo ""
echo ""

echo "Testing analyze endpoint..."
curl -s -X POST "$API_ENDPOINT/analyze" -H "Content-Type: application/json" -d '{"image_data": "test"}' | head -c 200
echo ""
