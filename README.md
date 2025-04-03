# 🩺 MedTranscribe AI

**Bridging the gap between medical professionals and patients** — MedTranscribe AI converts complex doctor voice notes and medical jargon into clear, understandable summaries in multiple languages.

---



## 🧠 Overview

**MedTranscribe AI** empowers patients to better understand their healthcare by translating doctor speech into simplified summaries in the patient’s native language. It enhances medical accessibility and communication using cutting-edge AI tools.

---

## ✨ Features

- 🎙️ Converts doctor voice notes to text  
- 🌐 Detects language and translates accordingly  
- 🧾 Transforms medical jargon into simplified summaries  
- 🤖 Fine-tuned AI model using few-shot, chain-of-thought, and multi-task instruction  
- 🌍 Multilingual support

---

## 🧰 Tech Stack

- **🎤 Azure Speech-to-Text API** — Converts voice input to text  
- **🧠 Azure Language Service** — Detects spoken language  
- **🧪 HuggingFace + flan-t5-small (fine-tuned)** — Generates simplified summaries  
- **🛠 Fine-tuning Techniques:**  
  - Few-shot learning  
  - Chain-of-thought prompting  
  - Multi-task instruction tuning  

---

## 🔍 How It Works

1. **Doctor speaks** into the app.
2. **Azure Speech-to-Text** converts speech to text.
3. **Azure Language Service** detects the language of the input.
4. **flan-t5-small** model (fine-tuned with instructions) converts technical medical terms into simple summaries.
5. Summary is presented in the **language understood by the patient**.

---

## ⚙️ Setup

```bash
git clone https://github.com/sakshisingh301/medtranscribe-ai.git
Set up your Azure and API keys in a .env file.
AZURE_SPEECH_KEY=your_key
subscription_key=Y=your_key
cd medtranscribe-ai
cd backend
python manage.py runserver
cd frontend
npm install
npm start


