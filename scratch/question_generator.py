import json
import random
import os

def generate_math_level1(count=1000):
    questions = []
    for i in range(count):
        a = random.randint(1, 50)
        b = random.randint(1, 50)
        op = random.choice(['+', '-'])
        if op == '+':
            ans = a + b
        else:
            a, b = max(a, b), min(a, b)
            ans = a - b
        
        q_text = f"{a} {op} {b} necha bo'ladi?"
        options = [str(ans), str(ans + random.randint(1, 10)), str(ans - random.randint(1, 10)), str(ans + 5)]
        random.shuffle(options)
        questions.append({
            "id": 1000 + i,
            "question": q_text,
            "options": options,
            "answer": str(ans)
        })
    return questions

def generate_physics_level1(count=1000):
    # Template-based generation
    templates = [
        ("Suvning qaynash harorati necha daraja?", ["100", "0", "50", "36.6"], "100"),
        ("Tezlik formulasi qaysi?", ["v = s / t", "v = s * t", "v = a * t", "v = m * g"], "v = s / t"),
        ("Kuchning o'lchov birligi nima?", ["Nyuton", "Joul", "Vatt", "Amper"], "Nyuton"),
        # ... add more templates
    ]
    # For now, just a demo
    return [{"id": 2000 + i, "question": t[0], "options": t[1], "answer": t[2]} for i, t in enumerate(templates)]

def save_questions(subject, level, questions):
    path = f"src/data/questions/{subject}/level{level}.json"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    # Example usage
    # save_questions('matematika', 1, generate_math_level1(1000))
    print("Generator script ready. Use functions to generate specific datasets.")
