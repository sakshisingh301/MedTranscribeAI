

import azure.cognitiveservices.speech as speechsdk

class SpeechToTextConversion:

    def convert_doctor_voice_to_text(self):
        speech_key = ""
        region = "eastus"

        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=region)
        speech_config.speech_recognition_language = "en-US"

        # Configure mic input
        audio_config = speechsdk.AudioConfig(use_default_microphone=True)

        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )
        should_stop = {"value": False}
        #if doctor says stop it will be stopped
        def handle_recognized(evt):
            recognized_text = evt.result.text.lower()
            print("Recognized:", recognized_text)
            #
            if "stop it" in recognized_text:

                should_stop["value"] = True
                speech_recognizer.stop_continuous_recognition()

        def handle_canceled(evt):
            print("Recognition canceled:", evt)

        speech_recognizer.recognized.connect(handle_recognized)
        speech_recognizer.canceled.connect(handle_canceled)

        speech_recognizer.start_continuous_recognition()

        # Wait until 'stop' is triggered
        import time
        while not should_stop["value"]:
            time.sleep(0.5)



# Run this section to test
if __name__ == "__main__":
    converter = SpeechToTextConversion()
    converter.convert_doctor_voice_to_text()
