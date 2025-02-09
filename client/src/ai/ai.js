async function query(inputText) {
    try {
        const API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";
        const hag = "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";

        if (!hag) {
            throw new Error("Missinhg API key. Please check your .env file.");
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${hag}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: inputText }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result[0]?.generated_text || "I dont get your question";
    } catch (error) {
        console.error("Error querying AI:", error.message);
        return "error querying AI";
    }
}

module.exports = { query };
