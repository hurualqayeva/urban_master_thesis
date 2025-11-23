from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
import numpy as np
from PIL import Image
import cv2
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

print("Loading ResNet50 model...")
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')
print("Model loaded successfully.")

CACHE_DATA_DIR = 'cache_data'

# ------------------------ Image Processing (PIL -> OpenCV-aligned) ------------------------

def apply_clahe(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

def align_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 200)
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return img
    largest_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    angle = rect[-1]
    if angle < -45:
        angle += 90
    (h, w) = img.shape[:2]
    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

def preprocess_cv_image_from_pil(pil_img):
    # Convert PIL to OpenCV BGR format (to match cv2.imread behavior)
    img = np.array(pil_img.convert("RGB"))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    img = align_image(img)
    img = apply_clahe(img)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    img = cv2.resize(img, (224, 224), interpolation=cv2.INTER_AREA)
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return preprocess_input(img_array)

def extract_features_from_pil(pil_img):
    preprocessed = preprocess_cv_image_from_pil(pil_img)
    return model.predict(preprocessed, verbose=0)

def cosine_similarity_score(f1, f2):
    return float(cosine_similarity(f1, f2)[0][0] * 100)

# ------------------------ Validation Logic ------------------------

def validate_image(uploaded_image, cache_id, threshold=75.0):
    cache_dir = os.path.join(CACHE_DATA_DIR, str(cache_id))
    reference_path = os.path.join(cache_dir, "reference.jpg")

    if not os.path.exists(reference_path):
        return {
            "success": 0,
            "accuracy": 0.0,
            "message": "Reference image not found for this cache.",
            "threshold": threshold
        }

    try:
        uploaded_features = extract_features_from_pil(uploaded_image)
        reference_features = extract_features_from_pil(Image.open(reference_path))

        similarity = cosine_similarity_score(uploaded_features, reference_features)
        success = 1 if similarity >= threshold else 0
        message = "Image succesfully validated !✅" if success else "❌ Not a valid match."

        return {
            "success": success,
            "accuracy": round(similarity, 2),
            "message": message,
            "threshold": threshold
        }

    except Exception as e:
        print(f"[VALIDATION ERROR]: {str(e)}")
        return {
            "success": 0,
            "accuracy": 0.0,
            "message": f"Error during validation: {str(e)}",
            "threshold": threshold
        }

# ------------------------ Flask API ------------------------

@app.route('/api/validate', methods=['POST'])
def validate_image_endpoint():
    data = request.json
    cache_id = data.get("cacheId")
    image_data_url = data.get("imageData")

    if not cache_id or not image_data_url:
        return jsonify({"error": "Missing cacheId or imageData"}), 400

    try:
        image_data = image_data_url.split(',')[1] if ',' in image_data_url else image_data_url
        img_bytes = base64.b64decode(image_data)
        uploaded_image = Image.open(io.BytesIO(img_bytes))

        result = validate_image(uploaded_image, cache_id)

        return jsonify({
            "success": int(result["success"]),
            "accuracy": result["accuracy"],
            "message": result["message"],
            "threshold": result["threshold"]
        })

    except Exception as e:
        print(f"[SERVER ERROR]: {str(e)}")
        return jsonify({
            "success": 0,
            "accuracy": 0.0,
            "message": f"Internal server error: {str(e)}",
            "threshold": 75.0
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "ok", "message": "Validation API is running."})

@app.route('/', methods=['GET'])
def home():
    return "Image Validation Server is live. Use POST /api/validate."

# ------------------------ Startup ------------------------

if __name__ == '__main__':
    os.makedirs(CACHE_DATA_DIR, exist_ok=True)
    for test_id in ['cache-001', 'cache-002', 'cache-003']:
        os.makedirs(os.path.join(CACHE_DATA_DIR, test_id), exist_ok=True)
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True, port=5000)
