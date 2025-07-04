#!/bin/bash

echo "🔍 Zero Point Labs Authentication Diagnostic Tool"
echo "================================================"

# Check if container is running
echo "📦 Checking container status..."
if docker ps | grep -q "zeropoint-labs-app"; then
    echo "✅ zeropoint-labs-app container is running"
else
    echo "❌ zeropoint-labs-app container is not running"
    echo "Run: docker-compose up -d"
    exit 1
fi

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    echo "Contents:"
    cat .env.local
else
    echo "❌ .env.local file missing"
    echo "Creating .env.local file..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6861736a0007a58bac63
EOF
    echo "✅ Created .env.local file"
fi

# Test container logs
echo ""
echo "📋 Recent container logs:"
docker logs zeropoint-labs-app --tail 10

# Test local connectivity
echo ""
echo "🌐 Testing local connectivity..."
if command -v curl &> /dev/null; then
    echo "Testing localhost:3000..."
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" | grep -q "200\|301\|302"; then
        echo "✅ Application responds on localhost:3000"
    else
        echo "❌ Application not responding on localhost:3000"
        echo "Check if port is mapped correctly in docker-compose.yml"
    fi
else
    echo "ℹ️  curl not available for connectivity test"
fi

echo ""
echo "🔍 Next steps:"
echo "1. Open http://localhost:3000/debug-auth in your browser"
echo "2. Check browser console for errors"
echo "3. Test demo login with demo@zeropoint.com / demo123"
echo "4. Verify Appwrite Console platform settings"
echo ""
echo "📚 Debug URLs:"
echo "   • http://localhost:3000/debug-auth"
echo "   • http://localhost:3000/test-appwrite"
echo "   • http://localhost:3000/login"
echo ""
echo "🔧 Appwrite Console: https://cloud.appwrite.io"
echo "   Project ID: 6861736a0007a58bac63"
echo "" 