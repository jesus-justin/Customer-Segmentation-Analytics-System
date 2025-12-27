#!/usr/bin/env python3
"""
Verify that all required packages are installed with correct versions.
Run this before starting the application.
"""

import sys
import importlib
from packaging import version

REQUIRED_PACKAGES = {
    'flask': '2.3.3',
    'pandas': '2.0.3',
    'numpy': '1.24.3',
    'sklearn': '1.3.0',  # scikit-learn
    'plotly': '5.16.1',
    'dotenv': '1.0.0',  # python-dotenv
    'werkzeug': '2.3.7',
    'joblib': '1.3.1',
}

# Mapping for import names that differ from package names
IMPORT_NAMES = {
    'sklearn': 'scikit-learn',
    'dotenv': 'python-dotenv',
}

def check_requirements():
    """Check if all required packages are installed."""
    missing = []
    outdated = []
    
    print("Verifying Python dependencies...")
    print("-" * 50)
    
    for import_name, min_version in REQUIRED_PACKAGES.items():
        try:
            module = importlib.import_module(import_name)
            installed_version = module.__version__
            
            if version.parse(installed_version) >= version.parse(min_version):
                status = "✓"
                print(f"{status} {import_name}: {installed_version}")
            else:
                status = "✗"
                package_name = IMPORT_NAMES.get(import_name, import_name)
                outdated.append((package_name, min_version, installed_version))
                print(f"{status} {import_name}: {installed_version} (requires >= {min_version})")
        except ImportError:
            status = "✗"
            package_name = IMPORT_NAMES.get(import_name, import_name)
            missing.append((package_name, min_version))
            print(f"{status} {import_name}: NOT INSTALLED")
    
    print("-" * 50)
    
    if missing or outdated:
        print("\n⚠️  Issues detected:\n")
        
        if missing:
            print("Missing packages:")
            for package, min_ver in missing:
                print(f"  - {package} >= {min_ver}")
        
        if outdated:
            print("\nOutdated packages:")
            for package, min_ver, current in outdated:
                print(f"  - {package}: {current} (needs >= {min_ver})")
        
        print("\n📦 Install/update with:")
        print("  pip install -r requirements.txt")
        return False
    else:
        print("\n✅ All dependencies are correctly installed!")
        return True

def check_directories():
    """Check if required directories exist."""
    import os
    
    print("\nVerifying directory structure...")
    print("-" * 50)
    
    directories = ['data', 'model', 'logs', 'templates', 'static', 'utils']
    
    for directory in directories:
        if os.path.isdir(directory):
            print(f"✓ {directory}/")
        else:
            print(f"✗ {directory}/ (creating...)")
            os.makedirs(directory, exist_ok=True)
            print(f"✓ {directory}/ (created)")
    
    print("-" * 50)
    return True

def main():
    """Run all verification checks."""
    print("\n" + "=" * 50)
    print("CUSTOMER SEGMENTATION ANALYTICS SYSTEM")
    print("Dependency Verification Tool")
    print("=" * 50 + "\n")
    
    deps_ok = check_requirements()
    dirs_ok = check_directories()
    
    print("\n" + "=" * 50)
    if deps_ok and dirs_ok:
        print("✅ System is ready! You can run: python app.py")
    else:
        print("❌ Please fix the issues above and try again.")
    print("=" * 50 + "\n")
    
    return 0 if (deps_ok and dirs_ok) else 1

if __name__ == '__main__':
    sys.exit(main())
