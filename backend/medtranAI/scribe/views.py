from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .util import Utils
from .util import Utils

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
    text = converter.convert_audio_file_to_text(file_path) 
    summary= converter.summarise_text(text)
    

    
    return Response({"summary": summary}, status=200)