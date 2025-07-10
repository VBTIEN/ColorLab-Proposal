#!/bin/bash

# 🚀 GitHub CLI Workflow for AI Image Analyzer Workshop
# This script helps you fork and setup the workshop repository

set -e

echo "🎨 AI Image Analyzer Workshop - GitHub Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI is not installed. Please install it first:"
    echo "curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "sudo apt update && sudo apt install gh -y"
    exit 1
fi

print_status "GitHub CLI is installed: $(gh --version | head -1)"

# Check authentication
print_info "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    print_warning "You are not authenticated with GitHub."
    print_info "Please run: gh auth login"
    print_info "Choose:"
    print_info "  - GitHub.com"
    print_info "  - HTTPS"
    print_info "  - Yes (authenticate Git with GitHub credentials)"
    print_info "  - Login with a web browser"
    echo ""
    print_info "After authentication, run this script again."
    exit 1
fi

print_status "GitHub authentication verified"

# Get authenticated user
GITHUB_USER=$(gh api user --jq '.login')
print_info "Authenticated as: $GITHUB_USER"

# Repository details
TEMPLATE_REPO="AWS-First-Cloud-Journey/Workshop-template"
NEW_REPO_NAME="ai-image-analyzer-workshop"
WORKSHOP_DIR="/mnt/d/project/ai-image-analyzer-workshop"

print_info "Template repository: $TEMPLATE_REPO"
print_info "New repository name: $NEW_REPO_NAME"

# Check if repository already exists
if gh repo view "$GITHUB_USER/$NEW_REPO_NAME" &> /dev/null; then
    print_warning "Repository $GITHUB_USER/$NEW_REPO_NAME already exists!"
    read -p "Do you want to delete and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deleting existing repository..."
        gh repo delete "$GITHUB_USER/$NEW_REPO_NAME" --confirm
        print_status "Repository deleted"
    else
        print_info "Using existing repository"
    fi
fi

# Fork the template repository
print_info "Forking template repository..."
if ! gh repo view "$GITHUB_USER/$NEW_REPO_NAME" &> /dev/null; then
    gh repo fork "$TEMPLATE_REPO" --repo-name "$NEW_REPO_NAME" --default-branch-only
    print_status "Repository forked successfully!"
else
    print_status "Repository already exists, skipping fork"
fi

# Clone the forked repository
CLONE_DIR="$HOME/ai-image-analyzer-workshop"
if [ -d "$CLONE_DIR" ]; then
    print_warning "Directory $CLONE_DIR already exists"
    read -p "Do you want to remove it and clone fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$CLONE_DIR"
        print_status "Directory removed"
    else
        print_info "Using existing directory"
        cd "$CLONE_DIR"
    fi
fi

if [ ! -d "$CLONE_DIR" ]; then
    print_info "Cloning repository..."
    gh repo clone "$GITHUB_USER/$NEW_REPO_NAME" "$CLONE_DIR"
    print_status "Repository cloned to $CLONE_DIR"
    cd "$CLONE_DIR"
fi

# Copy workshop content
print_info "Copying workshop content..."

# Create necessary directories
mkdir -p content
mkdir -p assets/code
mkdir -p assets/images
mkdir -p assets/scripts

# Copy workshop content files
if [ -d "$WORKSHOP_DIR/workshop-content" ]; then
    cp -r "$WORKSHOP_DIR/workshop-content/"* content/
    print_status "Workshop content copied"
else
    print_warning "Workshop content directory not found at $WORKSHOP_DIR/workshop-content"
fi

# Copy main files
if [ -f "$WORKSHOP_DIR/WORKSHOP-README.md" ]; then
    cp "$WORKSHOP_DIR/WORKSHOP-README.md" README.md
    print_status "README.md updated"
fi

if [ -f "$WORKSHOP_DIR/workshop-config.yaml" ]; then
    cp "$WORKSHOP_DIR/workshop-config.yaml" config.yaml
    print_status "Configuration file copied"
fi

# Copy source code
if [ -f "$WORKSHOP_DIR/lambda_function_colorlab_complete.py" ]; then
    cp "$WORKSHOP_DIR/lambda_function_colorlab_complete.py" assets/code/
    print_status "Lambda function code copied"
fi

if [ -f "$WORKSHOP_DIR/web_interface_ultimate_final.html" ]; then
    cp "$WORKSHOP_DIR/web_interface_ultimate_final.html" assets/code/
    print_status "Web interface code copied"
fi

# Copy scripts
if [ -d "$WORKSHOP_DIR/scripts" ]; then
    cp -r "$WORKSHOP_DIR/scripts/"* assets/scripts/ 2>/dev/null || true
    print_status "Scripts copied"
fi

# Update repository description
print_info "Updating repository description..."
gh repo edit --description "🎨 Building Intelligent Image Analysis with AWS AI Services - A hands-on workshop using AWS Lambda, S3, and API Gateway"

# Add topics/tags
print_info "Adding repository topics..."
gh repo edit --add-topic "aws,workshop,lambda,image-analysis,serverless,ai,machine-learning,python"

# Create initial commit
print_info "Creating initial commit..."
git add .
git commit -m "🎨 Initial workshop setup

- Add comprehensive workshop content
- Include Lambda function for color analysis  
- Add professional web interface
- Include deployment scripts and documentation
- Ready for hands-on learning experience

Features:
✅ 7 workshop modules with hands-on labs
✅ Advanced K-Means++ color analysis algorithms
✅ Professional web interface with ultimate fixes
✅ Production-ready AWS serverless architecture
✅ Comprehensive documentation and troubleshooting guides"

# Push changes
print_info "Pushing changes to GitHub..."
git push origin main

print_status "Workshop repository setup complete!"

# Display summary
echo ""
echo "🎉 SUCCESS! Your workshop repository is ready:"
echo "=============================================="
echo "📁 Repository: https://github.com/$GITHUB_USER/$NEW_REPO_NAME"
echo "💻 Local directory: $CLONE_DIR"
echo "🌐 GitHub Pages: https://$GITHUB_USER.github.io/$NEW_REPO_NAME (enable in Settings)"
echo ""
echo "Next steps:"
echo "1. 🔧 Enable GitHub Pages in repository Settings"
echo "2. 🎨 Customize the workshop content as needed"
echo "3. 🚀 Share your workshop with participants"
echo "4. 📚 Follow the workshop modules to test everything"
echo ""
echo "Workshop modules available:"
echo "- Module 0: Prerequisites & Setup"
echo "- Module 1: Architecture Overview"  
echo "- Module 2: Backend Development"
echo "- Module 3: API Gateway Setup"
echo "- Module 4: Frontend Development"
echo "- Module 5: S3 Integration"
echo "- Module 6: Advanced Features"
echo "- Module 7: Testing & Wrap-up"
echo ""
print_status "Happy teaching! 🚀"
