# Contributing to Customer Segmentation Analytics System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Ways to Contribute

- 🐛 Report bugs
- ✨ Suggest features
- 📝 Improve documentation
- 🧪 Add tests
- 🔧 Fix issues
- 📚 Add examples

## Getting Started

### Prerequisites
- Python 3.8+
- Git
- Virtual environment

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/yourusername/Customer-Segmentation-Analytics-System.git
cd Customer-Segmentation-Analytics-System

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies (including dev)
pip install -r requirements.txt
pip install pytest pytest-cov flask-testing

# Verify setup
python verify_requirements.py
```

## Development Workflow

### 1. Create a Feature Branch
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bug
```

### 2. Make Changes
- Follow the code style (see below)
- Write or update tests
- Update documentation

### 3. Test Your Changes
```bash
# Run tests
pytest tests.py -v

# Check coverage
pytest tests.py --cov=. --cov-report=html

# Run the app
python app.py
```

### 4. Commit Your Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add new clustering algorithm

- Add DBSCAN clustering option
- Add algorithm selection dropdown
- Update API documentation"
```

### 5. Push and Create PR
```bash
# Push branch
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Code Style Guidelines

### Python Code
```python
"""
Module docstring explaining the file's purpose.
"""

import os
import sys
from typing import Dict, List, Tuple

import pandas as pd
import numpy as np


def function_name(param1: str, param2: int) -> Dict[str, float]:
    """
    Clear docstring with description.
    
    Args:
        param1: Description of parameter
        param2: Description of parameter
    
    Returns:
        Description of return value
    
    Raises:
        ValueError: When something is invalid
    """
    # Implementation
    return {}
```

### HTML/CSS
```html
<!-- Use semantic HTML -->
<section class="feature-section">
    <div class="card">
        <h2>Title</h2>
        <p>Description</p>
    </div>
</section>
```

```css
/* Use CSS variables and clear naming */
.card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow);
}
```

### JavaScript
```javascript
// Use clear variable names and comments
function processData(data) {
    // Transform data
    const processed = data.map(item => ({
        id: item.id,
        value: item.value * 2
    }));
    
    return processed;
}
```

## Commit Message Format

Use conventional commit format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/setup

### Examples
```
feat(clustering): Add DBSCAN algorithm support

- Implement DBSCAN clustering
- Add parameter configuration
- Update API endpoint

Closes #123
```

```
fix(ui): Fix responsive design on mobile

- Fix navbar wrapping
- Adjust grid columns for small screens
- Test on iPhone and Android
```

## Testing Guidelines

### Write Tests For
- New functions/methods
- Bug fixes (test case first)
- Edge cases
- Error handling

### Test Structure
```python
import unittest
from utils.preprocessing import process_data

class TestPreprocessing(unittest.TestCase):
    """Test data preprocessing functions."""
    
    def setUp(self):
        """Set up test data."""
        self.sample_data = pd.DataFrame({...})
    
    def test_function_behavior(self):
        """Test specific behavior."""
        result = process_data(self.sample_data)
        self.assertEqual(len(result), 10)
    
    def test_error_handling(self):
        """Test error cases."""
        with self.assertRaises(ValueError):
            process_data(invalid_data)
```

### Run Tests
```bash
# All tests
pytest tests.py -v

# Specific test file
pytest tests.py::TestPreprocessing -v

# With coverage
pytest tests.py --cov=. --cov-report=term-missing
```

## Documentation

### Update Documentation For
- New features
- API changes
- Installation updates
- Configuration changes

### Files to Update
- `README.md` - Main documentation
- `API.md` - API endpoint documentation
- Code comments and docstrings
- Inline comments for complex logic

## Pull Request Process

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Commit messages are clear

### PR Description Template
```markdown
## Description
Describe the changes and why they're needed.

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Breaking change

## Testing
Describe testing performed.

## Screenshots (if applicable)
Add screenshots for UI changes.
```

## Reporting Bugs

### Bug Report Template
```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: Windows 10 / macOS / Linux
- Python: 3.8 / 3.9 / 3.10
- Flask: 2.3.3

## Screenshots
If applicable.

## Error Message
Full error message or traceback.
```

## Feature Requests

### Feature Request Template
```markdown
## Description
Clear description of requested feature.

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives
Other approaches considered.
```

## Project Structure

- `app.py` - Main Flask application
- `utils/` - Utility modules
  - `preprocessing.py` - Data preprocessing
  - `clustering.py` - Clustering algorithms
  - `logger.py` - Logging setup
- `templates/` - HTML templates
- `static/` - CSS and JavaScript
- `tests.py` - Unit tests
- `docs/` - Documentation files

## Adding New Features

### Example: Add a New Clustering Algorithm

1. **Update utils/clustering.py**
```python
def perform_dbscan(df: pd.DataFrame, eps: float = 0.5) -> Tuple[np.ndarray, DBSCAN]:
    """Perform DBSCAN clustering."""
    dbscan = DBSCAN(eps=eps)
    labels = dbscan.fit_predict(df)
    return labels, dbscan
```

2. **Add tests in tests.py**
```python
def test_perform_dbscan(self):
    """Test DBSCAN clustering."""
    labels, model = perform_dbscan(self.sample_data)
    self.assertGreater(len(np.unique(labels)), 0)
```

3. **Update API endpoint in app.py**
```python
@app.route('/api/cluster-dbscan', methods=['POST'])
def cluster_dbscan():
    """Perform DBSCAN clustering."""
    # Implementation
```

4. **Update documentation**
- Add to API.md
- Update README.md
- Add examples

5. **Commit**
```bash
git commit -m "feat(clustering): Add DBSCAN algorithm support"
```

## Code Review Process

When your PR is reviewed:
- Reviewers will provide feedback
- Make requested changes
- Respond to comments
- Re-request review

## Questions?

- Check existing issues
- Review documentation
- Start a discussion
- Email the maintainers

## Recognition

Contributors are recognized in:
- Commit history
- Repository contributors list
- Release notes (for significant contributions)

Thank you for contributing! 🎉
