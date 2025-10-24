#!/bin/bash

# Remove unnecessary markdown files
echo "🧹 Gereksiz dosyalar temizleniyor..."
rm -f SETUP.md QUICK_FIX.md PROJECT_*.md FINAL_TEST_REPORT.md DEVELOPMENT.md DEPLOYMENT.md COMPREHENSIVE_TEST_REPORT.md MANUAL_TEST_CHECKLIST.md IMPLEMENTATION_GUIDE.md

# Remove old README and rename the new one
if [ -f "README_NEW.md" ]; then
    rm -f README.md
    mv README_NEW.md README.md
fi

# Make scripts executable
chmod +x setup.sh cleanup.sh

echo "✅ Temizlik tamamlandı!"
