import requests
import base64
import json

# Load an image file and convert to base64
with open('./cache_data/cache-001/reference.jpeg', 'rb') as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare the request data
data = {
    'cacheId': 'cache-001',
    'imageData': f'data:image/jpeg;base64,{encoded_string}'
}

# Send the request to the API
response = requests.post(
    'http://localhost:5000/api/validate',
    headers={'Content-Type': 'application/json'},
    json=data
)

# Print the response
print(f"Status code: {response.status_code}")
print(json.dumps(response.json(), indent=2))