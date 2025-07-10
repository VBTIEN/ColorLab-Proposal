#!/usr/bin/env python3
"""
ColorLab Project Reorganization Script
Sắp xếp lại project structure để chuẩn bị đưa lên GitHub
"""

import os
import shutil
import json
from pathlib import Path

def create_new_structure():
    """Tạo cấu trúc thư mục mới cho GitHub"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop")
    new_structure = {
        # Root level files
        "": [
            "README.md",
            "LICENSE", 
            ".gitignore",
            "requirements.txt"
        ],
        
        # Documentation
        "docs/": [
            "architecture.md",
            "api-reference.md", 
            "deployment-guide.md",
            "troubleshooting.md"
        ],
        
        # Workshop content
        "workshop/": [
            "README.md"
        ],
        "workshop/content/": [],
        "workshop/assets/": [],
        
        # Source code
        "src/": [],
        "src/lambda/": [],
        "src/web/": [],
        "src/scripts/": [],
        
        # Infrastructure
        "infrastructure/": [],
        "infrastructure/cloudformation/": [],
        "infrastructure/terraform/": [],
        
        # Tests
        "tests/": [],
        "tests/unit/": [],
        "tests/integration/": [],
        
        # Examples and demos
        "examples/": [],
        "examples/images/": [],
        "examples/responses/": [],
        
        # Development tools
        "tools/": [],
        "tools/deployment/": [],
        "tools/testing/": [],
        
        # Archive (old files)
        "archive/": [],
        "archive/development-logs/": [],
        "archive/old-versions/": []
    }
    
    # Create directory structure
    for dir_path, files in new_structure.items():
        full_path = base_path / "ColorLab-Reorganized" / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {full_path}")
    
    return base_path / "ColorLab-Reorganized"

def categorize_files():
    """Phân loại các file hiện tại"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop")
    
    file_categories = {
        # Core documentation
        "docs": [
            "README.md",
            "WORKSHOP-README.md", 
            "PROJECT-SUMMARY.md",
            "USER-GUIDE.md",
            "HOW-TO-RUN.md",
            "QUICKSTART.md",
            "TEST-GUIDE.md"
        ],
        
        # Lambda functions and Python code
        "src_lambda": [
            "lambda_function.py",
            "lambda_function_colorlab_complete.py",
            "lambda_function_final_accurate.py",
            "lambda_function_real_analysis.py",
            "lambda_function_improved_colors.py"
        ],
        
        # Web interface files
        "src_web": [
            "web_interface_ultimate_final.html",
            "web_interface_accurate_algorithm.html", 
            "enhanced_interface.html",
            "create-improved-colorlab.html"
        ],
        
        # JavaScript fixes and enhancements
        "src_js": [
            "ultimate_final_fix.js",
            "accurate_color_extraction.js",
            "accurate_regional_algorithm.js",
            "complete_new_regional_fix.js",
            "final_complete_fixes.js"
        ],
        
        # Deployment scripts
        "scripts_deploy": [
            "deploy-real-ai-vision.sh",
            "deploy-improved-kmeans-v2.sh",
            "setup-complete-api.sh",
            "create-complete-layer.sh"
        ],
        
        # Testing scripts
        "scripts_test": [
            "test-colorlab-enhanced-final.sh",
            "test-final-accurate-system.sh",
            "final-complete-test.sh",
            "verify-real-analysis-fix.sh"
        ],
        
        # Workshop content
        "workshop": [
            "workshop-structure.md",
            "manual-github-commands.md"
        ],
        
        # Success documentation
        "success_logs": [
            "ULTIMATE-FINAL-SUCCESS-COMPLETE.md",
            "FINAL-ALL-ISSUES-RESOLVED-SUCCESS.md",
            "ACCURATE-ALGORITHM-SUCCESS.md",
            "COLORLAB-FINAL-SUCCESS-SUMMARY.md"
        ],
        
        # Configuration files
        "config": [
            "config.json",
            "api-gateway-restful-config.json",
            "test-payload.json"
        ],
        
        # Archive files (development logs)
        "archive": [
            "CLEANUP-SUMMARY.md",
            "API-FIX-SUMMARY.md", 
            "ENHANCEMENT-SUMMARY.md",
            "DEPLOYMENT-SUMMARY.md"
        ]
    }
    
    return file_categories

if __name__ == "__main__":
    print("🎨 ColorLab Project Reorganization")
    print("=" * 50)
    
    # Create new structure
    new_base = create_new_structure()
    print(f"\n✅ Created new project structure at: {new_base}")
    
    # Get file categories
    categories = categorize_files()
    print(f"\n📁 Categorized {sum(len(files) for files in categories.values())} files")
    
    print("\n🎯 Next steps:")
    print("1. Run the file moving script")
    print("2. Create new README.md")
    print("3. Set up proper .gitignore")
    print("4. Create LICENSE file")
    print("5. Prepare for GitHub upload")
