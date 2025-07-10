#!/usr/bin/env python3
"""
Move files to new organized structure
"""

import os
import shutil
from pathlib import Path

def move_files():
    """Di chuyển files vào cấu trúc mới"""
    
    base_path = Path("/mnt/d/project/ai-image-analyzer-workshop")
    new_base = base_path / "ColorLab-Reorganized"
    
    # File mapping: source -> destination
    file_moves = {
        # Core Lambda functions
        "lambda_function_colorlab_complete.py": "src/lambda/lambda_function.py",
        "lambda_function_final_accurate.py": "src/lambda/lambda_function_accurate.py", 
        "lambda_function_real_analysis.py": "src/lambda/lambda_function_analysis.py",
        
        # Web interfaces (keep the best ones)
        "web_interface_ultimate_final.html": "src/web/index.html",
        "web_interface_accurate_algorithm.html": "src/web/accurate_interface.html",
        
        # JavaScript algorithms
        "ultimate_final_fix.js": "src/web/js/color_analysis.js",
        "accurate_color_extraction.js": "src/web/js/color_extraction.js",
        "accurate_regional_algorithm.js": "src/web/js/regional_analysis.js",
        
        # Deployment scripts
        "deploy-real-ai-vision.sh": "tools/deployment/deploy_lambda.sh",
        "setup-complete-api.sh": "tools/deployment/setup_api.sh",
        "create-complete-layer.sh": "tools/deployment/create_layer.sh",
        
        # Testing scripts
        "test-colorlab-enhanced-final.sh": "tools/testing/test_colorlab.sh",
        "final-complete-test.sh": "tools/testing/test_complete.sh",
        
        # Configuration
        "config.json": "src/config/config.json",
        "api-gateway-restful-config.json": "infrastructure/api_gateway_config.json",
        
        # Documentation
        "WORKSHOP-README.md": "workshop/README.md",
        "USER-GUIDE.md": "docs/user_guide.md",
        "HOW-TO-RUN.md": "docs/quick_start.md",
        
        # Success logs (important achievements)
        "ULTIMATE-FINAL-SUCCESS-COMPLETE.md": "docs/project_success.md",
        "ACCURATE-ALGORITHM-SUCCESS.md": "docs/algorithm_details.md",
        
        # Workshop content
        "workshop-structure.md": "workshop/structure.md",
        
        # Examples
        "image_test.jpg": "examples/images/sample_image.jpg",
        "real_image_analysis_result.json": "examples/responses/sample_response.json",
        
        # Archive development logs
        "CLEANUP-SUMMARY.md": "archive/development-logs/cleanup.md",
        "API-FIX-SUMMARY.md": "archive/development-logs/api_fixes.md",
        "ENHANCEMENT-SUMMARY.md": "archive/development-logs/enhancements.md"
    }
    
    moved_count = 0
    error_count = 0
    
    for source_file, dest_path in file_moves.items():
        source = base_path / source_file
        dest = new_base / dest_path
        
        if source.exists():
            try:
                # Create destination directory if it doesn't exist
                dest.parent.mkdir(parents=True, exist_ok=True)
                
                # Copy file (not move, to preserve original)
                shutil.copy2(source, dest)
                print(f"✅ Copied: {source_file} -> {dest_path}")
                moved_count += 1
            except Exception as e:
                print(f"❌ Error copying {source_file}: {e}")
                error_count += 1
        else:
            print(f"⚠️  File not found: {source_file}")
    
    print(f"\n📊 Summary:")
    print(f"✅ Successfully copied: {moved_count} files")
    print(f"❌ Errors: {error_count} files")
    
    return moved_count, error_count

def create_additional_directories():
    """Tạo thêm các thư mục cần thiết"""
    
    new_base = Path("/mnt/d/project/ai-image-analyzer-workshop/ColorLab-Reorganized")
    
    additional_dirs = [
        "src/config",
        "src/web/js",
        "src/web/css", 
        "src/web/assets",
        "workshop/modules",
        "docs/images",
        "infrastructure/aws",
        "tests/data"
    ]
    
    for dir_path in additional_dirs:
        full_path = new_base / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"📁 Created: {dir_path}")

if __name__ == "__main__":
    print("🚀 Moving files to new structure...")
    print("=" * 50)
    
    # Create additional directories
    create_additional_directories()
    
    # Move files
    moved, errors = move_files()
    
    if errors == 0:
        print("\n🎉 All files moved successfully!")
    else:
        print(f"\n⚠️  Completed with {errors} errors")
    
    print("\n📋 Next steps:")
    print("1. Create main README.md")
    print("2. Create .gitignore")
    print("3. Create LICENSE")
    print("4. Review and clean up structure")
