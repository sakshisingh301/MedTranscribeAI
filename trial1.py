from transformers import pipeline



# 1. Load the text-simplification pipeline
simplifier = pipeline(
    task="text2text-generation",
    model="Smaraa/gpt2-text-simplification_1e4_adafactor_biendata",
    
)

def simplify_medical_text(sentence: str) -> str:
    """
    Uses the pre-trained text-simplification model to convert
    medical jargon to simpler words/phrases.
    """
    # Prepend 'simplify:' to guide the model (model-dependent)
    prompt = "simplify: " + sentence
    output = simplifier(prompt, max_length=128, do_sample=False)
    generated_text=output[0]['generated_text']

    if generated_text.startswith("simplify:"):
        generated_text=generated_text[len("simplify:"):].strip()
    return generated_text
   

# 2. Example usage
if __name__ == "__main__":
    medical_sentence = (
        "The patient presents with significant tachyarrhythmia and concomitant hyperlipidemia necessitating an immediate lipid panel and ECG evaluation."
    )

    simplified_version = simplify_medical_text(medical_sentence)
    
    print("Original Sentence:")
    print(medical_sentence)
    print("\nSimplified Sentence:")
    print(simplified_version)
