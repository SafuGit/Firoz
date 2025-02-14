exports.handler = async function (event, context) {
    try {
        const text = event.queryStringParameters.text;
        console.log("Received text: ", text);

        const userName = event.queryStringParameters.name;
        console.log("Received name: ", userName);

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("API Key length: ", apiKey.length);

        const requestBody = JSON.stringify({
            "contents": [{
                "parts": [{
                    "text": `Answer the following question, ${text} make sure this uses the system of the Class/Grade 8 of Bangladesh. You dont have to type the Class/Grade, make sure to start your answer with 'Heres your answer {name}', Here name = ${userName}`
                }]
            }]
        });
        console.log("Request body: ", requestBody);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response: ", result);

        const message = result["candidates"][0]["content"]["parts"][0]["text"];
        console.log("Extracted message: ", message);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ response: message, aiData: result }),
        };

    } catch (error) {
        console.error("Error occurred: ", error.message);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ error: "Internal Server Error", message: error.message }),
        };
    }
};
