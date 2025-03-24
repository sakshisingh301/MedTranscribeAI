import requests
import uuid

class Translator:
    def __init__(self):
        self.subscription_key = ""
        self.region = "eastus"
        self.endpoint = "https://api.cognitive.microsofttranslator.com"
        self.pathforlandetection="/detect?api-version=3.0"
        self.pathforlanconversion="/translate?api-version=3.0&from=es&to=en"

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

        response = requests.post(self.endpoint+self.pathforlandetection, headers=headers, json=body)
        result = response.json()

        # Extract language
        language = result[0]["language"]
        confidence = result[0]["score"]

        print(f"🔍 Detected language: {language} (confidence: {confidence:.2f})")

        return language

    def translate_spanish_to_english(self,file_path):

        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key,
            "Ocp-Apim-Subscription-Region": self.region,
            "Content-type": "application/json",
            "X-ClientTraceId": str(uuid.uuid4())
        }
        body = [{"text": text}]
        response = requests.post(self.endpoint + self.pathforlanconversion, headers=headers, json=body)
        result = response.json()

        translated_text = result[0]["translations"][0]["text"]
        with open("translated_to_english.txt", "w", encoding="utf-8") as out_file:
            out_file.write(translated_text)







# Example usage
if __name__ == "__main__":
    detector = Translator()
    detected_lang = detector.detect_language("transcription.txt")

    if detected_lang == "en":
        print("english detected")

    elif detected_lang == "es":
        detector.translate_spanish_to_english("transcription.txt")


    else:
        print("❓ Unrecognized or unsupported language.")
