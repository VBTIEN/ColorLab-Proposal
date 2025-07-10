# 🔧 Manual GitHub CLI Commands

## Step-by-step GitHub CLI workflow

### 1. Authenticate
```bash
gh auth login
# Follow the prompts to authenticate
```

### 2. Fork the template repository
```bash
gh repo fork AWS-First-Cloud-Journey/Workshop-template --repo-name ai-image-analyzer-workshop
```

### 3. Clone your forked repository
```bash
gh repo clone [YOUR-USERNAME]/ai-image-analyzer-workshop
cd ai-image-analyzer-workshop
```

### 4. Copy workshop content
```bash
# Copy workshop modules
cp -r /mnt/d/project/ai-image-analyzer-workshop/workshop-content/* ./content/

# Copy main files
cp /mnt/d/project/ai-image-analyzer-workshop/WORKSHOP-README.md ./README.md
cp /mnt/d/project/ai-image-analyzer-workshop/workshop-config.yaml ./config.yaml

# Create assets directory
mkdir -p assets/code assets/scripts assets/images

# Copy source code
cp /mnt/d/project/ai-image-analyzer-workshop/lambda_function_colorlab_complete.py ./assets/code/
cp /mnt/d/project/ai-image-analyzer-workshop/web_interface_ultimate_final.html ./assets/code/

# Copy scripts
cp -r /mnt/d/project/ai-image-analyzer-workshop/scripts/* ./assets/scripts/
```

### 5. Update repository metadata
```bash
# Set description
gh repo edit --description "🎨 Building Intelligent Image Analysis with AWS AI Services - A hands-on workshop"

# Add topics
gh repo edit --add-topic "aws,workshop,lambda,image-analysis,serverless,ai,python"
```

### 6. Commit and push changes
```bash
git add .
git commit -m "🎨 Initial workshop setup with comprehensive content"
git push origin main
```

### 7. Enable GitHub Pages
```bash
# Enable GitHub Pages (requires web interface)
gh repo view --web
# Go to Settings > Pages > Source: Deploy from a branch > main
```

### 8. View your workshop
```bash
# Open repository
gh repo view --web

# Your workshop will be available at:
# https://[YOUR-USERNAME].github.io/ai-image-analyzer-workshop
```

## Useful GitHub CLI Commands

### Repository management
```bash
# View repository info
gh repo view

# List your repositories
gh repo list

# Create a new repository
gh repo create

# Delete repository
gh repo delete [REPO-NAME] --confirm
```

### Issues and PRs
```bash
# Create an issue
gh issue create --title "Bug report" --body "Description"

# List issues
gh issue list

# Create pull request
gh pr create --title "Feature" --body "Description"
```

### Releases
```bash
# Create a release
gh release create v1.0.0 --title "Workshop v1.0" --notes "Initial release"

# List releases
gh release list
```

### Collaboration
```bash
# Add collaborator
gh api repos/:owner/:repo/collaborators/USERNAME -X PUT

# View contributors
gh api repos/:owner/:repo/contributors
```
