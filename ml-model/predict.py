import joblib
import sys
import json
import os
import re

# Get absolute directory of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the saved model and vectorizer using full paths
model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))


def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


if len(sys.argv) < 2:
    print("Please provide a job description as input.")
    sys.exit(1)

raw_input = sys.argv[1]
clean_input = clean_text(raw_input)

vec_input = vectorizer.transform([clean_input])
prediction = model.predict(vec_input)[0]
probability = model.predict_proba(vec_input)[0][1] * 100

result = {
    "scam_probability": round(probability, 2),
    "flagged": bool(prediction)
}

print(json.dumps(result))
