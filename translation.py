import requests
import uuid

class Translator:
    def __init__(self):
        self.subscription_key = ""
        self.region = "eastus"
        self.endpoint = "https://api.cognitive.microsofttranslator.com/detect?api-version=3.0"

    def detect_language(self, file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        # Prepare request
        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Ocp-Apim-Subscription-Region": self.region,
            "Content-type": "application/json",
            "X-ClientTraceId": str(uuid.uuid4())
        }

        body = [{"text": text}]

        response = requests.post(self.endpoint, headers=headers, json=body)
        result = response.json()

        # Extract language
        language = result[0]["language"]
        confidence = result[0]["score"]

        print(f"🔍 Detected language: {language} (confidence: {confidence:.2f})")

        return language



# Example usage
if __name__ == "__main__":
    detector = Translator()
    detected_lang = detector.detect_language("transcription.txt")

    if detected_lang == "en":
        print("✅ It's in English. You can now simplify or summarize.")
    elif detected_lang == "es":
        print("✅ It's in Spanish. Use Spanish-specific processing.")
    else:
        print("❓ Unrecognized or unsupported language.")
