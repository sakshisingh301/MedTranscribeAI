import os
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
import azure.cognitiveservices.speech as speechsdk
import uuid
import requests


class Utils:
    def __init__(self):
       
        base_model_id = "google/flan-t5-small"
        self.tokenizer = AutoTokenizer.from_pretrained(base_model_id)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            base_model_id,
            device_map="cpu",
            torch_dtype=torch.float32
        )
        self.summarizer = pipeline("text2text-generation", model=self.model, tokenizer=self.tokenizer)
        self.subscription_key_detect=""
        self.region_detect="eastus"
        self.endpoint_detect = "https://api.cognitive.microsofttranslator.com"
        self.pathforlandetection="/detect?api-version=3.0"
        self.pathforlanconversion="/translate?api-version=3.0&from=es&to=en"
        self.pathforentoespanish="/translate?api-version=3.0&from=en&to=es"

    def convert_audio_file_to_text(self, file_path):
        speech_key = ""
        region = "eastus"

        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=region)
        audio_config = speechsdk.AudioConfig(filename=file_path)
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )
    
        result = speech_recognizer.recognize_once()

        transcript_file_path = "transcript_file.txt"
        with open(transcript_file_path, "w", encoding="utf-8") as transcript_file:
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                transcript_file.write(result.text + "\n")
                return result.text
            else:
                transcript_file.write("Could not transcribe.\n")
                return "Could not transcribe."
    
    

    def detect_language(self, file_path):
       
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        path_for_detection = "/detect?api-version=3.0"
        url = self.endpoint_detect + path_for_detection

        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key_detect,
            "Ocp-Apim-Subscription-Region": self.region_detect,
            "Content-type": "application/json",
            "X-ClientTraceId": str(uuid.uuid4())
        }

        body = [{"text": text}]

        try:
            response = requests.post(url, headers=headers, json=body)
            result = response.json()
            language = result[0]["language"]
            
            return language

        except requests.exceptions.RequestException as e:
            print("Network or HTTP error during API request:", e)
            raise
        except Exception as e:
            print("Some other exception occurred:", e)
            raise
            
        
    def translate_spanish_to_english(self,file_path):
       

        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key_detect,
            "Ocp-Apim-Subscription-Region": self.region_detect,
            "Content-type": "application/json",
            "X-ClientTraceId": str(uuid.uuid4())
        }
        body = [{"text": text}]
        response = requests.post(self.endpoint_detect + self.pathforlanconversion, headers=headers, json=body)
        result = response.json()

        translated_text = result[0]["translations"][0]["text"]
        with open("translated_to_english.txt", "w", encoding="utf-8") as out_file:
            out_file.write(translated_text)
    
    def translate_english_to_spanish(self,text):
        print("text to be translated",text)
       

        headers = {
            "Ocp-Apim-Subscription-Key": self.subscription_key_detect,
            "Ocp-Apim-Subscription-Region": self.region_detect,
            "Content-type": "application/json",
            "X-ClientTraceId": str(uuid.uuid4())
        }
        body = [{"text": text}]
        response = requests.post(self.endpoint_detect + self.pathforentoespanish, headers=headers, json=body)
        result = response.json()

        translated_text = result[0]["translations"][0]["text"]
        return translated_text


    def summarise_text(self, text):

        # Few-shot example for prompting
        example_doctor_note = """

        Patient exhibits mild congestive heart failure (CHF) symptoms including
        shortness of breath and minor edema in ankles. Echocardiogram indicates
        reduced ejection fraction at 40%. We'll adjust ACE inhibitor dosage
        and recommend limiting sodium intake.
        """

        example_patient_friendly = """
        You have mild heart failure, which can cause shortness of breath and swelling
        in your ankles. An ultrasound of your heart shows it's not pumping as strongly
        as usual. We’ll change one of your medicines and ask you to lower salt in
        your diet to help reduce symptoms.
        """

        few_shot_prompt = f"""
        Below is an example of how to translate a complex doctor note into 
        simple, compassionate language for the patient:

        [EXAMPLE ORIGINAL NOTE]
        {example_doctor_note}

        [EXAMPLE PATIENT-FRIENDLY EXPLANATION]
        {example_patient_friendly}

        Now, please use the same style to explain the following doctor note in 
        patient-friendly, easy-to-understand language:

        [NEW DOCTOR NOTE]
        {text}

        [PATIENT-FRIENDLY EXPLANATION]
        """
        # print(few_shot_prompt)

        result = self.summarizer(
            few_shot_prompt,
            max_length=120,
            min_length=40,
            do_sample=True,
            temperature=0.2,
            top_p=0.9,
            num_return_sequences=1
        )
        generated_text= result[0]["generated_text"]
        spanish_translate= self.translate_english_to_spanish(generated_text)
        return  {
        "english": generated_text,
        "spanish": spanish_translate
    }
