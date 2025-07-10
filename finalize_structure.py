#!/usr/bin/env python3
"""
Final organization and cleanup script for ColorLab GitHub repository
"""

import os
import shutil
from pathlib import Path

def create_missing_files():
    """Tạo các file còn thiếu"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    
    # Create API reference documentation
    api_ref_content = """# ColorLab API Reference

## Overview
ColorLab provides a RESTful API for professional color analysis of images.

## Base URL
```
https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Authentication
No authentication required for public endpoints.

## Endpoints

### POST /analyze
Analyze colors in an uploaded image.

**Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "dominant_colors": [...],
  "regional_analysis": {...},
  "statistics": {...}
}
```

For complete API documentation, see the main README.md file.
"""
    
    with open(base_path / "docs/api_reference.md", "w") as f:
        f.write(api_ref_content)
    
    # Create deployment guide
    deploy_guide_content = """# Deployment Guide

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Python 3.11+

## Step-by-Step Deployment

### 1. Deploy Lambda Function
```bash
./tools/deployment/deploy_lambda.sh
```

### 2. Setup API Gateway
```bash
./tools/deployment/setup_api.sh
```

### 3. Create Lambda Layer
```bash
./tools/deployment/create_layer.sh
```

### 4. Deploy Web Interface
Upload the web interface to S3 bucket.

For detailed instructions, see the main README.md file.
"""
    
    with open(base_path / "docs/deployment_guide.md", "w") as f:
        f.write(deploy_guide_content)
    
    # Create troubleshooting guide
    troubleshooting_content = """# Troubleshooting Guide

## Common Issues

### Lambda Timeout
**Problem:** Function times out during processing
**Solution:** Increase timeout in Lambda configuration

### CORS Errors
**Problem:** Cross-origin request blocked
**Solution:** Configure API Gateway CORS settings

### Permission Denied
**Problem:** AWS permission errors
**Solution:** Check IAM policies and roles

For more troubleshooting tips, see the main documentation.
"""
    
    with open(base_path / "docs/troubleshooting.md", "w") as f:
        f.write(troubleshooting_content)
    
    print("✅ Created missing documentation files")

def create_example_files():
    """Tạo các file example"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    
    # Create example API response
    example_response = """{
  "dominant_colors": [
    {
      "color": "#FF5733",
      "name": "Vermillion",
      "percentage": 25.4,
      "rgb": [255, 87, 51],
      "lab": [62.3, 52.1, 45.8]
    },
    {
      "color": "#33A1FF",
      "name": "Sky Blue",
      "percentage": 18.7,
      "rgb": [51, 161, 255],
      "lab": [65.2, -8.4, -42.1]
    }
  ],
  "regional_analysis": {
    "grid_3x3": [
      {
        "position": 1,
        "dominant_color": "#FF5733",
        "color_name": "Vermillion",
        "percentage": 45.2
      }
    ]
  },
  "statistics": {
    "total_colors": 1247,
    "processing_time": 3.2,
    "accuracy_score": 0.95,
    "algorithm": "kmeans_plus_plus_lab"
  }
}"""
    
    with open(base_path / "examples/responses/detailed_analysis.json", "w") as f:
        f.write(example_response)
    
    print("✅ Created example files")

def create_test_structure():
    """Tạo cấu trúc test cơ bản"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    
    # Create basic test file
    test_content = """import pytest
from src.lambda.lambda_function import lambda_handler

class TestColorAnalysis:
    def test_lambda_handler_basic(self):
        # Basic test for lambda handler
        # TODO: Implement actual tests
        pass
    
    def test_color_extraction(self):
        # Test color extraction algorithm
        # TODO: Implement actual tests
        pass
    
    def test_kmeans_clustering(self):
        # Test K-means++ clustering
        # TODO: Implement actual tests
        pass
"""
    
    with open(base_path / "tests/unit/test_color_analysis.py", "w") as f:
        f.write(test_content)
    
    # Create integration test
    integration_test = """import pytest
import requests

class TestAPIIntegration:
    def test_api_endpoint(self):
        # Test API endpoint integration
        # TODO: Implement actual integration tests
        pass
    
    def test_full_workflow(self):
        # Test complete workflow
        # TODO: Implement actual workflow tests
        pass
"""
    
    with open(base_path / "tests/integration/test_api.py", "w") as f:
        f.write(integration_test)
    
    print("✅ Created test structure")

def create_github_templates():
    """Tạo GitHub templates"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    github_dir = base_path / ".github"
    github_dir.mkdir(exist_ok=True)
    
    # Issue template
    issue_template = """---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
"""
    
    templates_dir = github_dir / "ISSUE_TEMPLATE"
    templates_dir.mkdir(exist_ok=True)
    
    with open(templates_dir / "bug_report.md", "w") as f:
        f.write(issue_template)
    
    # Pull request template
    pr_template = """## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
"""
    
    with open(github_dir / "pull_request_template.md", "w") as f:
        f.write(pr_template)
    
    print("✅ Created GitHub templates")

def check_structure():
    """Kiểm tra cấu trúc cuối cùng"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    
    required_files = [
        "README.md",
        "LICENSE", 
        ".gitignore",
        "requirements.txt",
        "CONTRIBUTING.md"
    ]
    
    required_dirs = [
        "src/lambda",
        "src/web", 
        "src/config",
        "docs",
        "workshop",
        "tools/deployment",
        "tools/testing",
        "tests/unit",
        "tests/integration",
        "examples/images",
        "examples/responses"
    ]
    
    print("🔍 Checking project structure...")
    
    # Check files
    missing_files = []
    for file_name in required_files:
        if not (base_path / file_name).exists():
            missing_files.append(file_name)
    
    # Check directories
    missing_dirs = []
    for dir_name in required_dirs:
        if not (base_path / dir_name).exists():
            missing_dirs.append(dir_name)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
    else:
        print("✅ All required files present")
    
    if missing_dirs:
        print(f"❌ Missing directories: {missing_dirs}")
    else:
        print("✅ All required directories present")
    
    # Count files
    total_files = sum(1 for _ in base_path.rglob("*") if _.is_file())
    print(f"📊 Total files in organized structure: {total_files}")
    
    return len(missing_files) == 0 and len(missing_dirs) == 0

if __name__ == "__main__":
    print("🎨 ColorLab Final Organization")
    print("=" * 50)
    
    # Create missing files
    create_missing_files()
    create_example_files()
    create_test_structure()
    create_github_templates()
    
    # Check final structure
    is_complete = check_structure()
    
    if is_complete:
        print("\n🎉 Project structure is complete and ready for GitHub!")
        print("\n📋 Next steps:")
        print("1. Review all files in ColorLab-Reorganized/")
        print("2. Initialize git repository")
        print("3. Make initial commit")
        print("4. Push to GitHub")
        print("5. Set up GitHub Pages (optional)")
    else:
        print("\n⚠️  Some files or directories are missing")
        print("Please review and fix before uploading to GitHub")
    
    print(f"\n📁 Organized project location:")
    print(f"/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized/")
