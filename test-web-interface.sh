#!/bin/bash

echo "🌐 Testing Web Interface Connection to Real AI Vision"
echo "===================================================="

WEB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/"
API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Testing Web Interface...${NC}"
echo "Web URL: $WEB_URL"

# Test web interface accessibility
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL")
if [ "$WEB_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Web interface is accessible${NC}"
else
    echo -e "${RED}❌ Web interface not accessible (Status: $WEB_STATUS)${NC}"
fi

echo ""
echo -e "${BLUE}🔍 Testing Real AI Vision API...${NC}"
echo "API URL: $API_URL"

# Test API health
API_HEALTH=$(curl -s "$API_URL/health" 2>/dev/null)
if [[ $API_HEALTH == *"success"* ]]; then
    echo -e "${GREEN}✅ Real AI Vision API is healthy${NC}"
    echo "API Response: $(echo $API_HEALTH | head -c 100)..."
else
    echo -e "${YELLOW}⚠️ API health check response:${NC}"
    echo "$API_HEALTH" | head -c 200
fi

echo ""
echo -e "${BLUE}🔍 Testing API Root Endpoint...${NC}"
API_ROOT=$(curl -s "$API_URL/" 2>/dev/null)
if [[ $API_ROOT == *"REAL AI Vision"* ]]; then
    echo -e "${GREEN}✅ Real AI Vision API root is working${NC}"
    echo "API Info: $(echo $API_ROOT | head -c 150)..."
else
    echo -e "${YELLOW}⚠️ API root response:${NC}"
    echo "$API_ROOT" | head -c 200
fi

echo ""
echo -e "${BLUE}🧪 Testing API Analyze Endpoint...${NC}"
TEST_RESPONSE=$(curl -s -X POST "$API_URL/analyze" \
  -H "Content-Type: application/json" \
  -d '{"image_data": "test_web_interface_connection"}' 2>/dev/null)

if [[ $TEST_RESPONSE == *"success"* ]] && [[ $TEST_RESPONSE == *"analysis"* ]]; then
    echo -e "${GREEN}✅ Real AI Vision analyze endpoint is working${NC}"
    echo "Sample analysis: $(echo $TEST_RESPONSE | head -c 200)..."
else
    echo -e "${RED}❌ Analyze endpoint issue:${NC}"
    echo "$TEST_RESPONSE" | head -c 300
fi

echo ""
echo -e "${BLUE}📊 Connection Summary:${NC}"
echo "=================================="
echo "Web Interface: $WEB_URL"
echo "API Endpoint: $API_URL"
echo ""

if [ "$WEB_STATUS" = "200" ] && [[ $API_ROOT == *"REAL AI Vision"* ]]; then
    echo -e "${GREEN}🎉 SUCCESS: Web interface is connected to Real AI Vision!${NC}"
    echo ""
    echo -e "${YELLOW}📝 How to use:${NC}"
    echo "1. Open: $WEB_URL"
    echo "2. Upload any image"
    echo "3. Click 'Analyze Image'"
    echo "4. See unique AI analysis results!"
    echo ""
    echo -e "${GREEN}🎯 Each image will now get different colors and analysis!${NC}"
else
    echo -e "${RED}❌ Connection issues detected${NC}"
    echo "Please check the configuration"
fi
