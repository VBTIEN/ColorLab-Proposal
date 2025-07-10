# Contributing to ColorLab

Thank you for your interest in contributing to ColorLab! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include detailed reproduction steps
- Provide system information (OS, Python version, AWS region)
- Include error messages and logs

### 💡 Feature Requests
- Describe the feature and its use case
- Explain how it would benefit users
- Consider implementation complexity
- Check existing issues to avoid duplicates

### 📖 Documentation
- Improve existing documentation
- Add examples and tutorials
- Fix typos and grammar
- Translate content to other languages

### 💻 Code Contributions
- Fix bugs and implement features
- Improve performance and algorithms
- Add tests and improve coverage
- Enhance user interface and experience

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- AWS Account (for testing)
- Git knowledge
- Basic understanding of serverless architecture

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/YOUR-USERNAME/ColorLab.git
cd ColorLab
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
pip install -e .  # Install in development mode
```

4. **Configure AWS**
```bash
aws configure
# Use region: ap-southeast-1
# Output format: json
```

5. **Run Tests**
```bash
pytest tests/
```

## 📝 Development Guidelines

### Code Style
- Follow PEP 8 Python style guide
- Use Black for code formatting
- Use type hints where appropriate
- Write descriptive variable and function names

### Code Formatting
```bash
# Format code
black src/ tests/

# Check linting
flake8 src/ tests/

# Type checking
mypy src/
```

### Testing
- Write tests for new features
- Maintain test coverage above 80%
- Include unit and integration tests
- Test with different image formats and sizes

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_color_analysis.py
```

### Documentation
- Update README.md for significant changes
- Add docstrings to functions and classes
- Include examples in documentation
- Update API documentation

## 🏗️ Project Structure

```
ColorLab/
├── src/
│   ├── lambda/           # AWS Lambda functions
│   ├── web/             # Web interface
│   └── config/          # Configuration files
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── docs/                # Documentation
├── tools/               # Development tools
└── workshop/            # Educational content
```

## 🔄 Pull Request Process

### Before Submitting
1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write clean, well-documented code
- Add tests for new functionality
- Update documentation as needed

3. **Test Thoroughly**
```bash
# Run all tests
pytest

# Test specific functionality
./tools/testing/test_colorlab.sh

# Manual testing with different images
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat: add new color analysis algorithm"
```

### Commit Message Format
Use conventional commits format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` adding tests
- `refactor:` code refactoring
- `perf:` performance improvements

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions and classes
- Mock external dependencies (AWS services)
- Use pytest fixtures for common test data

### Integration Tests
- Test complete workflows
- Use real AWS services in test environment
- Clean up resources after tests

### Performance Tests
- Test with various image sizes
- Measure processing time and memory usage
- Ensure scalability requirements are met

### Example Test Structure
```python
import pytest
from src.lambda.color_analysis import ColorAnalyzer

class TestColorAnalyzer:
    def test_extract_colors_basic(self):
        analyzer = ColorAnalyzer()
        colors = analyzer.extract_colors(test_image)
        assert len(colors) > 0
        assert all('hex' in color for color in colors)
    
    def test_kmeans_clustering(self):
        # Test K-means++ algorithm
        pass
    
    def test_lab_color_conversion(self):
        # Test LAB color space conversion
        pass
```

## 🔒 Security Guidelines

### Sensitive Information
- Never commit AWS credentials
- Use environment variables for secrets
- Review code for hardcoded sensitive data

### Input Validation
- Validate all user inputs
- Sanitize file uploads
- Check image format and size limits

### AWS Security
- Follow least privilege principle
- Use IAM roles instead of access keys
- Enable CloudTrail logging

## 📚 Resources

### Documentation
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Python Style Guide](https://pep8.org/)
- [Color Science Resources](https://en.wikipedia.org/wiki/Color_science)

### Tools
- [AWS CLI](https://aws.amazon.com/cli/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Black Code Formatter](https://black.readthedocs.io/)

## 🤝 Community

### Communication
- Use GitHub Issues for bug reports and feature requests
- Join discussions in GitHub Discussions
- Be respectful and constructive in all interactions

### Code of Conduct
- Be welcoming and inclusive
- Respect different viewpoints and experiences
- Focus on what's best for the community
- Show empathy towards other community members

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for major features

## 📞 Getting Help

### Development Questions
- Check existing GitHub Issues
- Create new issue with "question" label
- Join community discussions

### AWS-Specific Issues
- Consult AWS documentation
- Use AWS support channels
- Check AWS service status

## 🎉 Thank You!

Your contributions make ColorLab better for everyone. Whether you're fixing a typo, adding a feature, or improving documentation, every contribution is valuable and appreciated!

---

**Happy Contributing!** 🚀

For questions about contributing, please open an issue or start a discussion on GitHub.
