import json
from pathlib import Path

KNOWLEDGE_FILE = Path(__file__).parent / "knowledge" / "ahmad.json"

def load_knowledge():
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def get_answer(question):
    data = load_knowledge()
    question = question.lower().strip()
    
    person = data["person"]
    brand = data["brand"]
    mentorship = data["mentorship"]
    contact = data["contact"]
    social = data["social_media"]
    
    # Personal information
    if any(word in question for word in ["who is", "who's", "tell me about", "introduce"]):
        return (
            f"{person['full_name']} is a {person['profession']} "
            f"from {person['hometown']}."
        )
    
    if any(word in question for word in ["hometown", "where is he from", "where does he belong"]):
        return f"Sir Ahmad belongs to {person['hometown']}."
    
    if any(word in question for word in ["profession", "job", "role", "what does he do"]):
        return f"Sir Ahmad is a {person['profession']}."
    
    # Brand information
    if any(word in question for word in ["ahmixen", "brand", "channel"]):
        return f"{brand['name']}: {brand['description']}"
    
    if any(word in question for word in ["topics", "what does it cover", "content"]):
        return "AhmiXen AI covers: " + ", ".join(brand["topics"]) + "."
    
    if "website" in question:
        return f"Visit the website: {brand['website']}"
    
    # Mentorship
    if any(word in question for word in ["mentorship", "mentoring"]):
        return f"Learn about {mentorship['name']} here: {mentorship['website']}"
    
    # Contact
    if any(word in question for word in ["email", "business inquiry", "contact"]):
        return f"For business inquiries, email {contact['business_email']}."
    
    # Social media
    if "youtube" in question:
        return social["youtube"]
    
    if "instagram" in question:
        return social["instagram"]
    
    if "facebook" in question:
        return social["facebook"]
    
    if "linkedin" in question:
        return (
            f"Personal LinkedIn: {social['personal_linkedin']}\n"
            f"AhmiXen company LinkedIn: {social['company_linkedin']}"
        )
    
    if any(word in question for word in ["social media", "socials", "social links"]):
        return (
            f"You can find Sir Ahmad and AhmiXen AI on:\n"
            f"YouTube: {social['youtube']}\n"
            f"Instagram: {social['instagram']}\n"
            f"Facebook: {social['facebook']}\n"
            f"Personal LinkedIn: {social['personal_linkedin']}\n"
            f"Company LinkedIn: {social['company_linkedin']}"
        )
    
    return (
        "I'm sorry, but I don't have that information "
        "about Sir Ahmad in my knowledge base."
    )
