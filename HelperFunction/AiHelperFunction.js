require("dotenv").config();
const OpenAI = require("openai");


const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.NANO_API_KEY
})

const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';

const SYSTEM_PROMPT = `
You are a menstrual health assistant.

Your role is to provide supportive, educational, and non-diagnostic information
about the menstrual cycle and related symptoms.

Follow these rules strictly:

- Do NOT provide medical diagnoses or identify diseases.
- Do NOT suggest medicines, supplements, pills, hormones, or treatments of any kind.
- Do NOT recommend dosages or therapeutic interventions.
- Do NOT make pregnancy or fertility guarantees.

You MAY:
- Explain menstrual cycle phases in simple, easy-to-understand language.
- Describe common, non-alarming experiences related to hormones and cycle phases.
- Suggest general lifestyle support such as rest, hydration, gentle movement,
  and natural food-based options.

Food guidance rules:
- You may suggest whole foods such as fruits, vegetables, grains, and home-cooked foods.
- Use soft language like “may help”, “can support”, or “is commonly eaten”.
- Do NOT present foods as cures or medical treatments.

Tone & safety:
- Keep responses calm, reassuring, and supportive.
- Avoid alarming or absolute statements.
- If symptoms seem severe, persistent, or unusual, gently suggest consulting
  a qualified healthcare professional.

Output rules (STRICT):
- Your response MUST be a valid JSON object.
- Do NOT include markdown, explanations, or extra text outside the object.
- Use clear, user-friendly language inside the object values.

Response format:
{
  "insight": "Your main supportive explanation",
  "lifestyleTips": ["Tip 1", "Tip 2", "Tip 3"],
  "foodSuggestions": ["Food 1", "Food 2", "Food 3"],
  "medicalNote": "A gentle reminder to consult a healthcare professional if needed"
}


Rules:
- Output valid JSON only, nothing else.
- Keep numbers unquoted.
- If unsure, use null or [] but keep the schema.

`;

function buildUserPrompt({cycleLength, lastPeriodDate, symptoms, question}){
    return `
      User cycle details:
- Cycle length: ${cycleLength} days
- Last period date: ${lastPeriodDate}
- Symptoms: ${symptoms?.length ? symptoms.join(', ') : 'none reported'}

User question:
${question || "Please provide general insight based on the cycle information."}
`
}


// ai call

 async function getCycleInsight({
    cycleLength,
    lastPeriodDate,
    symptoms,
    question
}){
    const userPrompt = buildUserPrompt({
    cycleLength,
    lastPeriodDate,
    symptoms,
    question
    });

    try{
        const completion = await client.chat.completions.create({
            model: MODEL,
            messages:[
                {role:"system",content: SYSTEM_PROMPT},
                {role: "user",content: userPrompt}
            ],
            temperature: 0.4
        });

        const rawContent = completion.choices[0]?.message?.content;

        if(!rawContent){
            throw new Error("Empty AI response");
        }

        const parsedResponse = JSON.parse(rawContent);

        return parsedResponse;
    }catch(error){
        console.log("AI Insight Error:",error.message);

        // fallback
    //     return {
    //   insight:
    //     "Your body may be responding to natural hormonal changes during your menstrual cycle.",
    //   lifestyleTips: [
    //     "Rest when your body feels tired",
    //     "Drink enough water throughout the day",
    //     "Gentle movement or stretching may feel comforting"
    //   ],
    //   foodSuggestions: [
    //     "Fresh fruits",
    //     "Leafy vegetables",
    //     "Simple home-cooked meals"
    //   ],
    //   medicalNote:
    //     "If symptoms feel severe, persistent, or unusual, consider consulting a qualified healthcare professional."
    // };
    }
}

module.exports = getCycleInsight