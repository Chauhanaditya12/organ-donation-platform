from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# --- 1. Configure Gemini AI ---
GEMINI_API_KEY = "AIzaSyC_zHVKUZlxmjL_D1pafRmrjd96jzynKAA"
genai.configure(api_key=GEMINI_API_KEY)

# Diagnostic: List available models
print("--- Checking Available AI Models ---")
available_models = []
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Available: {m.name}")
            available_models.append(m.name)
except Exception as e:
    print(f"Error listing models: {e}")

# Selection Logic: Prefer Flash, then Pro, then anything available
selected_model_name = 'gemini-1.5-flash' # Default
if available_models:
    if 'models/gemini-1.5-flash' in available_models:
        selected_model_name = 'gemini-1.5-flash'
    elif 'models/gemini-pro' in available_models:
        selected_model_name = 'gemini-pro'
    else:
        # Just pick the first available one
        selected_model_name = available_models[0].replace('models/', '')

print(f"Using Model: {selected_model_name}")
chat_model = genai.GenerativeModel(selected_model_name)

# --- 2. Load the ML model ---
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("Error: model.pkl not found.")

@app.route('/predict-success', methods=['POST'])
def predict_success():
    try:
        data = request.get_json()
        features = np.array([[float(data.get('donor_age')), float(data.get('recipient_age')), int(data.get('blood_match')), float(data.get('health_score'))]])
        probabilities = model.predict_proba(features)
        return jsonify({'success_probability': round(probabilities[0][1] * 100, 2), 'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'failed'}), 400

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        if not user_message: return jsonify({'error': 'No message'}), 400

        prompt = f"You are VitaBot, an organ donation assistant. User: {user_message}\nVitaBot:"
        response = chat_model.generate_content(prompt)
        return jsonify({'reply': response.text, 'status': 'success'})
    except Exception as e:
        print(f"Chatbot Error: {str(e)}")
        return jsonify({'reply': f"Backend Error: {str(e)}", 'status': 'failed'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
