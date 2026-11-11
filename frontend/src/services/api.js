const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function askAssistant(question) {
    const response = await fetch(`${API_URL}/ask/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }
    
    return data.answer;
}
