from datasets import load_dataset
dataset = load_dataset("json", data_files="data.json")["train"]
split_dataset = dataset.train_test_split(test_size=0.2, seed=42)
train_dataset = split_dataset["train"]
test_dataset = split_dataset["test"]
from transformers import (
    GPT2Tokenizer, 
    GPT2LMHeadModel, 
    Trainer, 
    TrainingArguments
)

model_name = "Smaraa/gpt2-text-simplification_1e4_adafactor_biendata"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token
model = GPT2LMHeadModel.from_pretrained(model_name)
model.resize_token_embeddings(len(tokenizer))

def preprocess_function(examples):
    # e.g., format: "<simplify> <complex> <SEP> <simple>"
    # Then tokenize. For demonstration only:
    texts = []
    for c, s in zip(examples["complex_text"], examples["simple_text"]):
        text = f"<simplify> {c} <SEP> {s}"
        texts.append(text)
    
    model_inputs = tokenizer(
        texts,
        max_length=256,
        truncation=True,
        padding="max_length"
    )
    # Causal LM: labels = input_ids
    model_inputs["labels"] = model_inputs["input_ids"].copy()
    return model_inputs

train_dataset = train_dataset.map(preprocess_function, batched=True)
test_dataset = test_dataset.map(preprocess_function, batched=True)

# Remove extra columns, set format
keep_columns = ["input_ids", "attention_mask", "labels"]
train_dataset.set_format(type="torch", columns=keep_columns)
test_dataset.set_format(type="torch", columns=keep_columns)

training_args = TrainingArguments(
    output_dir="./gpt2_simplifier_finetuned",
    overwrite_output_dir=True,
    num_train_epochs=8,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    eval_strategy="epoch",
    logging_steps=50,
    save_steps=500,
    save_total_limit=1,
    learning_rate=1e-5,
    fp16=True
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

trainer.train()
# After training...
trainer.save_model("./gpt2_simplifier_finetuned")
tokenizer.save_pretrained("./gpt2_simplifier_finetuned")
# Now the directory has pytorch_model.bin, config.json, merges.txt, etc.

train_dataset.to_json("train.json")
test_dataset.to_json("test.json")


