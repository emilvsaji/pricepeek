# app.py (Python Flask Backend)
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import random
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production
CORS(app, supports_credentials=True)

# Mock user database (in production, use a real database)
users = {
    "test@example.com": {
        "password": "password123",
        "name": "Test User"
    }
}

# Mock product database (in production, you would scrape real sites)
products_db = {
    "iphone 16": [
        {
            "id": 1,
            "name": "iPhone 16 Pro Max 256GB",
            "description": "Latest Apple iPhone with A18 chip",
            "price": 1199,
            "original_price": 1299,
            "store": "Amazon",
            "rating": 4.5,
            "reviews": 2148,
            "coupon": "EXTRA10",
            "coupon_description": "Additional 10% off with code",
            "shipping": "Free shipping",
            "delivery": "Delivered by Sep 28",
            "return_policy": "30-day return policy"
        },
        {
            "id": 2,
            "name": "iPhone 16 Pro Max 256GB",
            "description": "Latest Apple iPhone with A18 chip",
            "price": 1179,
            "original_price": 1299,
            "store": "Best Buy",
            "rating": 4.0,
            "reviews": 1872,
            "coupon": "BESTBUY15",
            "coupon_description": "15% off for new customers",
            "shipping": "Free shipping",
            "delivery": "Delivered by Sep 30",
            "return_policy": "In-store pickup available"
        },
        {
            "id": 3,
            "name": "iPhone 16 Pro Max 256GB",
            "description": "Latest Apple iPhone with A18 chip",
            "price": 1189,
            "original_price": 1299,
            "store": "Walmart",
            "rating": 4.8,
            "reviews": 3045,
            "coupon": None,
            "coupon_description": None,
            "shipping": "Free shipping",
            "delivery": "Delivered by Sep 25",
            "return_policy": "90-day return policy"
        }
    ],
    "samsung tv": [
        {
            "id": 4,
            "name": "Samsung 65\" QLED 4K Smart TV",
            "description": "Quantum HDR with 100% Color Volume",
            "price": 899,
            "original_price": 1099,
            "store": "Amazon",
            "rating": 4.3,
            "reviews": 3421,
            "coupon": "TVDEAL20",
            "coupon_description": "$20 off with code",
            "shipping": "Free shipping",
            "delivery": "Delivered by Oct 5",
            "return_policy": "30-day return policy"
        },
        {
            "id": 5,
            "name": "Samsung 65\" QLED 4K Smart TV",
            "description": "Quantum HDR with 100% Color Volume",
            "price": 879,
            "original_price": 1099,
            "store": "Best Buy",
            "rating": 4.5,
            "reviews": 2876,
            "coupon": None,
            "coupon_description": None,
            "shipping": "Free shipping",
            "delivery": "Delivered by Oct 3",
            "return_policy": "In-store pickup available"
        }
    ],
    "macbook pro": [
        {
            "id": 6,
            "name": "MacBook Pro 16\" M3 Max",
            "description": "12-core CPU, 40-core GPU, 48GB RAM",
            "price": 3499,
            "original_price": 3899,
            "store": "Apple Store",
            "rating": 4.9,
            "reviews": 1254,
            "coupon": "EDU100",
            "coupon_description": "$100 off for students",
            "shipping": "Free shipping",
            "delivery": "Delivered by Sep 20",
            "return_policy": "14-day return policy"
        },
        {
            "id": 7,
            "name": "MacBook Pro 16\" M3 Max",
            "description": "12-core CPU, 40-core GPU, 48GB RAM",
            "price": 3399,
            "original_price": 3899,
            "store": "Amazon",
            "rating": 4.7,
            "reviews": 987,
            "coupon": "PRIME50",
            "coupon_description": "$50 off for Prime members",
            "shipping": "Free shipping",
            "delivery": "Delivered by Sep 22",
            "return_policy": "30-day return policy"
        }
    ]
}

# Routes
@app.route('/')
def home():
    return jsonify({"message": "PricePeek API", "status": "OK"})

@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').lower().strip()
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    # Find matching products
    results = []
    for keyword, products in products_db.items():
        if query in keyword:
            results.extend(products)
    
    # If no exact matches, try partial matching
    if not results:
        for keyword, products in products_db.items():
            if any(word in keyword for word in query.split()):
                results.extend(products)
    
    # If still no results, generate some random products based on query
    if not results:
        results = generate_mock_products(query)
    
    # Find best price
    best_price = None
    if results:
        best_price = min(results, key=lambda x: x['price'])
    
    return jsonify({
        "query": query,
        "results": results,
        "best_price": best_price,
        "count": len(results)
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    if email in users and users[email]['password'] == password:
        session['user'] = email
        return jsonify({
            "message": "Login successful",
            "user": {
                "email": email,
                "name": users[email]['name']
            }
        })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password', '')
    name = data.get('name', '')
    
    if not email or not password or not name:
        return jsonify({"error": "Name, email and password are required"}), 400
    
    if email in users:
        return jsonify({"error": "User already exists"}), 409
    
    users[email] = {
        "password": password,
        "name": name
    }
    
    session['user'] = email
    return jsonify({
        "message": "User created successfully",
        "user": {
            "email": email,
            "name": name
        }
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/user', methods=['GET'])
def get_user():
    if 'user' in session:
        email = session['user']
        return jsonify({
            "email": email,
            "name": users[email]['name']
        })
    
    return jsonify({"error": "Not logged in"}), 401

# Helper function to generate mock products for unknown queries
def generate_mock_products(query):
    stores = ["Amazon", "Best Buy", "Walmart", "Target", "Newegg", "eBay"]
    products = []
    
    for i in range(random.randint(2, 5)):
        base_price = random.randint(100, 2000)
        discount = random.randint(5, 30)
        price = base_price - (base_price * discount // 100)
        
        product = {
            "id": random.randint(100, 1000),
            "name": f"{query.title()} {random.choice(['Pro', 'Max', 'Plus', 'Elite', 'Premium'])}",
            "description": f"High-quality {query} with premium features",
            "price": price,
            "original_price": base_price,
            "store": random.choice(stores),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviews": random.randint(100, 5000),
            "shipping": random.choice(["Free shipping", "Free 2-day shipping", "Standard shipping"]),
            "delivery": f"Delivered by {(datetime.now() + timedelta(days=random.randint(1, 10))).strftime('%b %d')}",
            "return_policy": f"{random.randint(14, 90)}-day return policy"
        }
        
        # Add coupon for some products
        if random.random() > 0.5:
            product["coupon"] = f"SAVE{random.randint(5, 25)}"
            product["coupon_description"] = f"Save ${random.randint(10, 100)} with code"
        
        products.append(product)
    
    return products

if __name__ == '__main__':
    app.run(debug=True, port=5000)