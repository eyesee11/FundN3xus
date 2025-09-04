#!/usr/bin/env python3
"""
Simple ML API Test Script
Tests all endpoints to ensure they're working correctly.
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:8000"

# Sample financial profile for testing
test_profile = {
    "age": 30,
    "income": 75000,
    "expenses": 3500,
    "savings": 25000,
    "debt": 15000,
    "employment_years": 8,
    "credit_score": 720,
    "num_dependents": 2,
    "investment_amount": 5000,
    "property_value": 200000
}

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health OK: Models loaded: {data.get('models_loaded', 0)}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_endpoint(endpoint, name):
    """Test a prediction endpoint"""
    try:
        response = requests.post(f"{BASE_URL}{endpoint}", json=test_profile, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {name} OK")
            # Print key result
            if 'risk_score' in data:
                print(f"   Risk Score: {data['risk_score']:.1f}, Category: {data['risk_category']}")
            elif 'affordability_amount' in data:
                print(f"   Affordability: ${data['affordability_amount']:,.0f}")
            elif 'health_score' in data:
                print(f"   Health Score: {data['health_score']:.1f}, Category: {data['health_category']}")
            elif 'recommended_scenario' in data:
                print(f"   Scenario: {data['recommended_scenario']}")
            return True
        else:
            print(f"❌ {name} failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ {name} error: {e}")
        return False

def main():
    """Run basic API tests"""
    print("🔍 Testing FundN3xus ML API...")
    print("-" * 40)
    
    # Wait a moment for server to be ready
    time.sleep(2)
    
    tests = [
        ("Health Check", test_health),
        ("Investment Risk", lambda: test_endpoint("/predict/investment-risk", "Investment Risk")),
        ("Affordability", lambda: test_endpoint("/predict/affordability", "Affordability")),
        ("Financial Health", lambda: test_endpoint("/predict/financial-health", "Financial Health")),
        ("Scenario Planning", lambda: test_endpoint("/predict/scenario", "Scenario Planning"))
    ]
    
    passed = 0
    for test_name, test_func in tests:
        if test_func():
            passed += 1
        print()
    
    print("-" * 40)
    print(f"📊 Result: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All ML endpoints working correctly!")
        return True
    else:
        print("⚠️ Some tests failed. Check server logs.")
        return False

if __name__ == "__main__":
    main()
