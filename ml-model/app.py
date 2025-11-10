# app.py - Flask API for Crop Prediction

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

print("=" * 60)
print("🌾 CROP RECOMMENDATION FLASK API")
print("=" * 60)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Load trained model
MODEL_PATH = 'crop_model.pkl'
model = None

def load_model():
    """Load the trained ML model"""
    global model
    print("\n📦 Loading trained model...")
    
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Error: {MODEL_PATH} not found!")
        print("   Please run train_model.py first to create the model.")
        return False
    
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False

# Load model on startup
if not load_model():
    print("\n⚠️  WARNING: Running without model!")
    print("   Train model first: python train_model.py\n")

# ========== API ENDPOINTS ==========

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': '🌾 Crop Recommendation API is active!',
        'version': '1.0.0',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Crop prediction endpoint
    
    Expected JSON format:
    {
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 25.5,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 202.5
    }
    """
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded. Please train model first.'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Extract features
        features = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get prediction probability (confidence)
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities) * 100)
        
        # Log prediction
        print(f"\n🔮 Prediction made:")
        print(f"   Input: N={data['N']}, P={data['P']}, K={data['K']}, "
              f"Temp={data['temperature']}°C, Humidity={data['humidity']}%, "
              f"pH={data['ph']}, Rainfall={data['rainfall']}mm")
        print(f"   Result: {prediction} (Confidence: {confidence:.2f}%)")
        
        # Return prediction
        return jsonify({
            'success': True,
            'prediction': prediction,
            'confidence': round(confidence, 2),
            'input_data': data
        })
    
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid input data: {str(e)}'
        }), 400
    
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/crops', methods=['GET'])
def get_crops():
    """Get list of all possible crop predictions"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        # Get all unique classes (crops) from model
        crops = model.classes_.tolist()
        
        return jsonify({
            'success': True,
            'total_crops': len(crops),
            'crops': crops
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH,
        'model_exists': os.path.exists(MODEL_PATH),
        'endpoints': {
            'predict': '/predict (POST)',
            'crops': '/crops (GET)',
            'health': '/health (GET)'
        }
    })

# ========== ERROR HANDLERS ==========

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

# ========== RUN SERVER ==========

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 Starting Flask API Server...")
    print("=" * 60)
    print("\n📍 Server will run on: http://localhost:5001")
    print("📝 Available endpoints:")
    print("   GET  /          - API status")
    print("   POST /predict   - Make crop prediction")
    print("   GET  /crops     - List all crops")
    print("   GET  /health    - Health check")
    print("\n⚠️  Press CTRL+C to stop the server")
    print("=" * 60 + "\n")
    
    # Run Flask app
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=5001,       # Port 5001 (Node is on 5000)
        debug=True       # Auto-reload on code changes
    )
