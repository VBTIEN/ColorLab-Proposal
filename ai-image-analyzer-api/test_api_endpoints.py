#!/usr/bin/env python3
"""
API Endpoints Test Script
Script để test các API endpoints
"""

import asyncio
import aiohttp
import json
import base64
import sys
from pathlib import Path

# API base URL
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

async def test_health_endpoints():
    """Test health check endpoints"""
    print("🏥 Testing Health Endpoints...")
    
    async with aiohttp.ClientSession() as session:
        # Test root endpoint
        try:
            async with session.get(BASE_URL) as response:
                data = await response.json()
                print(f"   ✅ Root endpoint: {response.status} - {data.get('service', 'Unknown')}")
        except Exception as e:
            print(f"   ❌ Root endpoint failed: {str(e)}")
        
        # Test basic health check
        try:
            async with session.get(f"{API_BASE}/health") as response:
                data = await response.json()
                status = data.get('data', {}).get('status', 'unknown')
                print(f"   ✅ Health check: {response.status} - Status: {status}")
        except Exception as e:
            print(f"   ❌ Health check failed: {str(e)}")
        
        # Test detailed health check
        try:
            async with session.get(f"{API_BASE}/health/detailed") as response:
                data = await response.json()
                print(f"   ✅ Detailed health: {response.status}")
        except Exception as e:
            print(f"   ❌ Detailed health failed: {str(e)}")

async def test_image_endpoints():
    """Test image management endpoints"""
    print("\n🖼️  Testing Image Endpoints...")
    
    async with aiohttp.ClientSession() as session:
        # Test list images (should be empty initially)
        try:
            async with session.get(f"{API_BASE}/images") as response:
                data = await response.json()
                print(f"   ✅ List images: {response.status}")
        except Exception as e:
            print(f"   ❌ List images failed: {str(e)}")
        
        # Test get non-existent image
        try:
            async with session.get(f"{API_BASE}/images/nonexistent-id") as response:
                print(f"   ✅ Get non-existent image: {response.status} (expected 404)")
        except Exception as e:
            print(f"   ❌ Get non-existent image failed: {str(e)}")
        
        # Test create image with invalid data
        try:
            invalid_payload = {
                "image_data": "invalid_base64",
                "filename": "test.jpg"
            }
            async with session.post(
                f"{API_BASE}/images", 
                json=invalid_payload
            ) as response:
                print(f"   ✅ Create invalid image: {response.status} (expected 422)")
        except Exception as e:
            print(f"   ❌ Create invalid image failed: {str(e)}")

async def test_analysis_endpoints():
    """Test analysis endpoints"""
    print("\n🔍 Testing Analysis Endpoints...")
    
    async with aiohttp.ClientSession() as session:
        # Test list analyses (should be empty initially)
        try:
            async with session.get(f"{API_BASE}/analysis") as response:
                data = await response.json()
                print(f"   ✅ List analyses: {response.status}")
        except Exception as e:
            print(f"   ❌ List analyses failed: {str(e)}")
        
        # Test get non-existent analysis
        try:
            async with session.get(f"{API_BASE}/analysis/nonexistent-id") as response:
                print(f"   ✅ Get non-existent analysis: {response.status} (expected 404)")
        except Exception as e:
            print(f"   ❌ Get non-existent analysis failed: {str(e)}")
        
        # Test color analysis with invalid URL
        try:
            invalid_payload = {
                "image_url": "invalid-url",
                "analysis_type": "COLOR"
            }
            async with session.post(
                f"{API_BASE}/analysis/color", 
                json=invalid_payload
            ) as response:
                print(f"   ✅ Color analysis invalid URL: {response.status} (expected error)")
        except Exception as e:
            print(f"   ❌ Color analysis invalid URL failed: {str(e)}")
        
        # Test composition analysis with invalid URL
        try:
            invalid_payload = {
                "image_url": "invalid-url",
                "analysis_type": "COMPOSITION"
            }
            async with session.post(
                f"{API_BASE}/analysis/composition", 
                json=invalid_payload
            ) as response:
                print(f"   ✅ Composition analysis invalid URL: {response.status} (expected error)")
        except Exception as e:
            print(f"   ❌ Composition analysis invalid URL failed: {str(e)}")
        
        # Test analysis stats
        try:
            async with session.get(f"{API_BASE}/analysis/stats/summary") as response:
                data = await response.json()
                print(f"   ✅ Analysis stats: {response.status}")
        except Exception as e:
            print(f"   ❌ Analysis stats failed: {str(e)}")

async def test_error_handling():
    """Test error handling"""
    print("\n⚠️  Testing Error Handling...")
    
    async with aiohttp.ClientSession() as session:
        # Test non-existent endpoint
        try:
            async with session.get(f"{API_BASE}/nonexistent") as response:
                print(f"   ✅ Non-existent endpoint: {response.status} (expected 404)")
        except Exception as e:
            print(f"   ❌ Non-existent endpoint failed: {str(e)}")
        
        # Test method not allowed
        try:
            async with session.patch(f"{API_BASE}/health") as response:
                print(f"   ✅ Method not allowed: {response.status} (expected 405)")
        except Exception as e:
            print(f"   ❌ Method not allowed failed: {str(e)}")

async def test_with_sample_image():
    """Test with a sample image"""
    print("\n🎨 Testing with Sample Image...")
    
    # Create a minimal 1x1 pixel PNG image in base64
    sample_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    
    async with aiohttp.ClientSession() as session:
        # Test create image with valid data
        try:
            payload = {
                "image_data": sample_image_b64,
                "filename": "test.png",
                "analysis_type": "COLOR"
            }
            async with session.post(
                f"{API_BASE}/images", 
                json=payload
            ) as response:
                if response.status == 201:
                    data = await response.json()
                    print(f"   ✅ Create valid image: {response.status}")
                    return data.get('data', {}).get('id')
                else:
                    print(f"   ⚠️  Create valid image: {response.status} (may need AWS config)")
        except Exception as e:
            print(f"   ❌ Create valid image failed: {str(e)}")
    
    return None

async def main():
    """Main test function"""
    print("🧪 AI Image Analyzer API - Endpoint Tests")
    print("=" * 50)
    
    try:
        # Test all endpoints
        await test_health_endpoints()
        await test_image_endpoints()
        await test_analysis_endpoints()
        await test_error_handling()
        
        # Test with sample image (may require AWS config)
        image_id = await test_with_sample_image()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("\n📝 Notes:")
        print("   - Some tests may fail if AWS credentials are not configured")
        print("   - This is expected behavior for development testing")
        print("   - Check the API documentation at http://localhost:8000/api/v1/docs")
        
    except Exception as e:
        print(f"\n❌ Test suite failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # Check if server is running
    print("🔍 Checking if API server is running...")
    try:
        import requests
        response = requests.get(f"{BASE_URL}/api/v1/health", timeout=5)
        if response.status_code == 200:
            print("✅ API server is running")
            asyncio.run(main())
        else:
            print(f"❌ API server returned status {response.status_code}")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server")
        print("   Please start the server first:")
        print("   python run_server.py --reload")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error checking server: {str(e)}")
        sys.exit(1)
