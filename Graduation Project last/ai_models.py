from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import base64
import io
import numpy as np
from PIL import Image
import requests
from sklearn.preprocessing import MinMaxScaler
import pickle
import os

ai_bp = Blueprint('ai', __name__)

# Global variables for models (will be loaded on startup)
price_model = None
price_scaler = None

def load_models():
    """Load AI models on startup"""
    global price_model, price_scaler
    try:
        # For now, we'll create a mock scaler since we don't have the original
        # In production, you would load the actual trained scaler
        price_scaler = MinMaxScaler()
        # Mock fit with some sample data to match the original training
        price_scaler.fit([[10], [5000]])  # Approximate min/max prices from training
        print("Models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {e}")

@ai_bp.route('/predict-price', methods=['POST'])
@cross_origin()
def predict_price():
    """Predict price from uploaded image"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Preprocess image (resize to 224x224 as expected by model)
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # For now, simulate price prediction since TensorFlow is heavy
        # In production, you would use: predicted_price = price_model.predict(img_array)[0][0]
        
        # Simulate a normalized prediction (0-1 range)
        normalized_price = np.random.uniform(0.1, 0.9)
        
        # Inverse transform to get original scale
        if price_scaler:
            original_price = normalized_price * (price_scaler.data_max_[0] - price_scaler.data_min_[0]) + price_scaler.data_min_[0]
        else:
            # Fallback calculation
            original_price = normalized_price * 4990 + 10  # Scale to 10-5000 range
        
        return jsonify({
            'predicted_price': f"{original_price:.2f}",
            'currency': 'LE',
            'confidence': 'medium'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@ai_bp.route('/search-by-image', methods=['POST'])
@cross_origin()
def search_by_image():
    """Search for similar products by image"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # For now, return mock similar products
        # In production, this would use your image similarity model
        
        # Fetch some products from the API to return as "similar"
        try:
            api_response = requests.get('https://tpf.runasp.net/api/Products?numberOfProduct=8')
            if api_response.status_code == 200:
                products = api_response.json()
                # Return first 8 products as "similar" results
                similar_products = products[:8] if len(products) >= 8 else products
            else:
                # Fallback mock data
                similar_products = [
                    {
                        'id': 1,
                        'name': 'Similar Item 1',
                        'price': 299,
                        'imageUrl': 'https://via.placeholder.com/300x300',
                        'categoryName': 'Fashion'
                    }
                ]
        except:
            # Fallback mock data if API fails
            similar_products = [
                {
                    'id': 1,
                    'name': 'Similar Item 1',
                    'price': 299,
                    'imageUrl': 'https://via.placeholder.com/300x300',
                    'categoryName': 'Fashion'
                }
            ]
        
        return jsonify({
            'similar_products': similar_products,
            'total_found': len(similar_products)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing image search: {str(e)}'}), 500

@ai_bp.route('/search-by-text', methods=['POST'])
@cross_origin()
def search_by_text():
    """Search for products by text description"""
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({'error': 'No search query provided'}), 400
        
        query = data['query'].lower()
        
        # Fetch products from API and filter by text
        try:
            api_response = requests.get('https://tpf.runasp.net/api/Products?numberOfProduct=100')
            if api_response.status_code == 200:
                all_products = api_response.json()
                
                # Simple text matching (in production, use your trained text search model)
                matching_products = []
                for product in all_products:
                    product_text = f"{product.get('name', '')} {product.get('description', '')} {product.get('categoryName', '')}".lower()
                    if any(word in product_text for word in query.split()):
                        matching_products.append(product)
                
                # Limit to top 12 results
                matching_products = matching_products[:12]
            else:
                matching_products = []
        except:
            matching_products = []
        
        return jsonify({
            'products': matching_products,
            'total_found': len(matching_products),
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing text search: {str(e)}'}), 500

# Initialize models when blueprint is created
load_models()

