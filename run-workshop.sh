#!/bin/bash

# Master script để chạy AI Image Analyzer Workshop
clear
echo "🤖 AI Image Analyzer Workshop"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "config.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Workshop Options:"
echo "1. 🎭 Demo Mode (No AWS account needed)"
echo "2. ☁️  Full AWS Mode (Requires AWS credentials)"
echo "3. 📖 View Documentation"
echo "4. 🧪 Open Test Guide"
echo "5. 🌐 Open Web Interface"
echo ""

read -p "Choose option (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🎭 Starting Demo Mode..."
        cd scripts/
        ./demo-mode.sh
        echo ""
        echo "🌐 Opening web interface..."
        ./open-web.sh
        ;;
    2)
        echo ""
        echo "☁️  Full AWS Mode Setup"
        echo "📋 Prerequisites:"
        echo "   - AWS Account"
        echo "   - AWS CLI configured"
        echo ""
        read -p "Do you have AWS credentials configured? (y/n): " aws_ready
        
        if [ "$aws_ready" = "y" ]; then
            echo "🚀 Running AWS setup..."
            cd scripts/
            ./setup-workshop.sh
            echo ""
            echo "🚀 Deploying Lambda function..."
            ./deploy-lambda.sh
            echo ""
            echo "✅ AWS setup complete!"
            ./open-web.sh
        else
            echo "📖 Please follow the setup guide:"
            cat docs/setup-iam-user.md
        fi
        ;;
    3)
        echo ""
        echo "📖 Documentation:"
        echo "   - README.md: Main documentation"
        echo "   - QUICKSTART.md: Quick start guide"
        echo "   - TEST-GUIDE.md: Testing instructions"
        echo "   - docs/: Additional documentation"
        echo ""
        read -p "Open README.md? (y/n): " open_readme
        if [ "$open_readme" = "y" ]; then
            less README.md
        fi
        ;;
    4)
        echo ""
        echo "🧪 Opening Test Guide..."
        less TEST-GUIDE.md
        ;;
    5)
        echo ""
        echo "🌐 Opening Web Interface..."
        cd scripts/
        ./open-web.sh
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Workshop ready! Enjoy learning!"
echo ""
echo "💡 Tips:"
echo "   - Start with Demo Mode if you're new"
echo "   - Check TEST-GUIDE.md for testing scenarios"
echo "   - Use different types of images for testing"
echo ""
echo "📞 Need help? Check README.md or docs/ folder"
