#!/bin/bash

# 🚀 ColorLab Workshop - GitHub Pages Auto Setup
# Automatically makes repo public and enables GitHub Pages

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}"
    echo "🎨 =============================================="
    echo "   ColorLab Workshop - GitHub Pages Setup"
    echo "   Direct deployment from GitHub repository"
    echo "===============================================${NC}"
}

print_success() {
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

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

check_requirements() {
    print_step "Checking requirements..."
    
    # Check if gh CLI is available
    if ! command -v gh > /dev/null; then
        print_error "GitHub CLI (gh) not found. Please install it first:"
        echo "  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
        echo "  echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
        echo "  sudo apt update && sudo apt install gh"
        exit 1
    fi
    
    print_success "GitHub CLI found: $(gh --version | head -1)"
    
    # Check if authenticated
    if ! gh auth status > /dev/null 2>&1; then
        print_error "Not authenticated with GitHub. Please run:"
        echo "  gh auth login"
        exit 1
    fi
    
    print_success "GitHub authentication verified"
}

check_repository() {
    print_step "Checking repository status..."
    
    # Get repository info
    REPO_INFO=$(gh repo view VBTIEN/ColorLab-Workshop --json visibility,url,name 2>/dev/null || echo "")
    
    if [ -z "$REPO_INFO" ]; then
        print_error "Repository VBTIEN/ColorLab-Workshop not found or not accessible"
        exit 1
    fi
    
    VISIBILITY=$(echo "$REPO_INFO" | grep -o '"visibility":"[^"]*"' | cut -d'"' -f4)
    
    print_info "Repository: https://github.com/VBTIEN/ColorLab-Workshop"
    print_info "Current visibility: $VISIBILITY"
    
    if [ "$VISIBILITY" = "PRIVATE" ]; then
        print_warning "Repository is currently PRIVATE"
        print_info "GitHub Pages requires PUBLIC repository for free tier"
        return 1
    else
        print_success "Repository is PUBLIC"
        return 0
    fi
}

make_repository_public() {
    print_step "Making repository public..."
    
    print_warning "This will make your repository visible to everyone on GitHub"
    print_info "Repository: https://github.com/VBTIEN/ColorLab-Workshop"
    
    read -p "Do you want to make the repository public? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Repository visibility unchanged. You can use GitHub Codespaces instead."
        show_codespaces_instructions
        exit 0
    fi
    
    print_step "Changing repository visibility to public..."
    
    if gh repo edit VBTIEN/ColorLab-Workshop --visibility public; then
        print_success "Repository is now PUBLIC"
        sleep 2  # Wait for GitHub to process the change
    else
        print_error "Failed to make repository public"
        exit 1
    fi
}

enable_github_pages() {
    print_step "Enabling GitHub Pages..."
    
    print_info "GitHub Pages will be configured with:"
    echo "  - Source: Deploy from branch"
    echo "  - Branch: master"
    echo "  - Folder: / (root)"
    
    print_warning "Note: GitHub Pages setup must be done manually via web interface"
    print_info "Opening GitHub Pages settings..."
    
    # Try to open browser
    PAGES_URL="https://github.com/VBTIEN/ColorLab-Workshop/settings/pages"
    
    if command -v xdg-open > /dev/null; then
        xdg-open "$PAGES_URL" 2>/dev/null &
    elif command -v open > /dev/null; then
        open "$PAGES_URL" 2>/dev/null &
    else
        print_info "Please manually open: $PAGES_URL"
    fi
    
    echo -e "${YELLOW}"
    echo "📋 Manual steps in GitHub Pages settings:"
    echo "1. Source: Deploy from a branch"
    echo "2. Branch: master (or main)"
    echo "3. Folder: / (root)"
    echo "4. Click Save"
    echo -e "${NC}"
    
    read -p "Press Enter after you've enabled GitHub Pages..." -r
}

show_final_instructions() {
    print_success "GitHub Pages setup initiated!"
    
    echo -e "${GREEN}"
    echo "🌐 Your workshop will be available at:"
    echo "   https://vbtien.github.io/ColorLab-Workshop/"
    echo ""
    echo "📚 Workshop modules will be at:"
    echo "   https://vbtien.github.io/ColorLab-Workshop/01-prerequisites/"
    echo "   https://vbtien.github.io/ColorLab-Workshop/02-architecture/"
    echo "   https://vbtien.github.io/ColorLab-Workshop/03-backend-development/"
    echo "   [... and other modules]"
    echo ""
    echo "⏱️  Note: It may take 5-10 minutes for GitHub to build and deploy"
    echo "🔄 Check the Actions tab for build progress:"
    echo "   https://github.com/VBTIEN/ColorLab-Workshop/actions"
    echo -e "${NC}"
}

show_codespaces_instructions() {
    echo -e "${BLUE}"
    echo "💻 Alternative: GitHub Codespaces (for private repos)"
    echo "=================================================="
    echo "1. Go to: https://github.com/VBTIEN/ColorLab-Workshop"
    echo "2. Click 'Code' button"
    echo "3. Select 'Codespaces' tab"
    echo "4. Click 'Create codespace on master'"
    echo "5. Wait for environment to load (2-3 minutes)"
    echo "6. In terminal, run: hugo server --bind 0.0.0.0 --port 1313"
    echo "7. Click the port 1313 notification to open website"
    echo ""
    echo "✅ This works with private repositories"
    echo "⚠️  Limited to 60 hours/month on free tier"
    echo -e "${NC}"
}

test_pages_deployment() {
    print_step "Testing GitHub Pages deployment..."
    
    PAGES_URL="https://vbtien.github.io/ColorLab-Workshop/"
    
    print_info "Waiting for deployment to complete..."
    print_info "This may take 5-10 minutes for the first deployment"
    
    for i in {1..30}; do
        if curl -s --head "$PAGES_URL" | head -1 | grep -q "200 OK"; then
            print_success "GitHub Pages is live!"
            print_success "Workshop available at: $PAGES_URL"
            return 0
        fi
        
        echo -n "."
        sleep 20
    done
    
    print_warning "Deployment is taking longer than expected"
    print_info "Please check manually: $PAGES_URL"
    print_info "Or check build status: https://github.com/VBTIEN/ColorLab-Workshop/actions"
}

# Main execution
main() {
    print_header
    
    check_requirements
    
    if check_repository; then
        print_info "Repository is already public"
    else
        make_repository_public
    fi
    
    enable_github_pages
    show_final_instructions
    
    read -p "Would you like to test the deployment? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        test_pages_deployment
    fi
    
    print_success "Setup complete! Your ColorLab Workshop is ready on GitHub Pages!"
}

# Run main function
main "$@"
