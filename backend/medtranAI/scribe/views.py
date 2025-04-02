from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .util import Utils
from .util import Utils
from pathlib import Path
import uuid
import requests


import os
import uuid

@api_view(['POST'])
@parser_classes([MultiPartParser])
def transcribe_api(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "No audio file provided"}, status=400)

  
    filename = f"temp_{uuid.uuid4().hex}.wav"
    
    file_path = os.path.join("temp_audio", filename)
    print(file_path)
    os.makedirs("temp_audio", exist_ok=True)

    with open(file_path, 'wb') as f:
        for chunk in audio_file.chunks():
            f.write(chunk)
    
    converter = Utils() 
    #convert audio file to text
    text = converter.convert_audio_file_to_text(file_path)
    transcript_file_dir = Path(__file__).resolve().parent.parent
    #check language if it is english then simply call model for summarization and when it is spanish then call translation service to convert
    #it into english and then call model for summarization
    language = converter.detect_language(transcript_file_dir /"transcript_file.txt")
    print("language detected",language)
    if language == "es":
        converter.translate_spanish_to_english(transcript_file_dir /"transcript_file.txt")
        summary= converter.summarise_text(text)
        
    else:
        summary = converter.summarise_text(text)
       
    
    return Response({"summary": summary}, status=200)