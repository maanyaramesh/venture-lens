import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "llama3.2:3b";

export async function POST(request: NextRequest) {
  try {
    const { idea, analysis } = await request.json();

    if (!idea?.trim()) {
      return NextResponse.json(
        { error: "No venture idea provided." },
        { status: 400 }
      );
    }

    const prompt = `
You are VentureLens, an aggressive startup stress-testing analyst.

Your job is NOT to encourage the founder.
Your job is to find realistic reasons this SPECIFIC startup could fail.

VENTURE IDEA:
${idea}

CURRENT VENTURE ANALYSIS:
${JSON.stringify(analysis, null, 2)}

Identify exactly 3 high-impact assumptions that could kill this venture.

For each one provide:
- title
- explanation
- severity: LOW, MEDIUM, or HIGH
- confidence: 0-100
- test: a cheap concrete experiment
- passCondition: a measurable result that would validate the assumption

Be highly specific to this venture.
Do not give generic startup advice.
Do not invent precise statistics.
Return ONLY JSON.

{
  "risks": [
    {
      "title": "...",
      "explanation": "...",
      "severity": "HIGH",
      "confidence": 80,
      "test": "...",
      "passCondition": "..."
    }
  ]
}
`;

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      180000
    );

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        format: {
          type: "object",
          properties: {
            risks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  explanation: { type: "string" },
                  severity: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH"],
                  },
                  confidence: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                  },
                  test: { type: "string" },
                  passCondition: { type: "string" },
                },
                required: [
                  "title",
                  "explanation",
                  "severity",
                  "confidence",
                  "test",
                  "passCondition",
                ],
              },
            },
          },
          required: ["risks"],
        },
            }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();

      return NextResponse.json(
        { error: `Ollama error: ${text}` },
        { status: 502 }
      );
    }

    const result = await response.json();

    const parsed =
      typeof result.response === "string"
        ? JSON.parse(result.response)
        : result.response;

    return NextResponse.json(parsed);
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Stress test timed out. Your local AI may be overloaded.",
        },
        { status: 504 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Could not run the stress test." },
      { status: 500 }
    );
  }
}