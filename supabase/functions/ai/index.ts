import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

/**
 * Supabase Edge Function: AI
 * Proxies requests to Grok Mini API with secure API key handling
 */

interface AIRequest {
    prompt: string;
    temperature?: number;
    max_tokens?: number;
}

interface AIResponse {
    choices: Array<{
        message: {
            content: string;
            role: string;
        };
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

serve(async (req) => {
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Verify authentication
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "Missing authorization header" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Parse request
        const { prompt, temperature = 0.7, max_tokens = 2000 }: AIRequest = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return new Response(
                JSON.stringify({ error: "Invalid prompt" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get API key from environment
        const apiKey = Deno.env.get("XAI_API_KEY");
        if (!apiKey) {
            console.error("XAI_API_KEY environment variable not set");
            return new Response(
                JSON.stringify({ error: "AI service configuration error" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Call Grok Mini API
        const startTime = Date.now();
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "grok-4-1-fast-non-reasoning",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature,
                max_tokens,
            }),
        });

        const responseTime = Date.now() - startTime;

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Grok API error:", response.status, errorText);
            return new Response(
                JSON.stringify({
                    error: "AI service error",
                    details: response.status === 429 ? "Rate limit exceeded" : "API request failed"
                }),
                { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const data: AIResponse = await response.json();

        // Return response with metadata
        return new Response(
            JSON.stringify({
                ...data,
                metadata: {
                    response_time_ms: responseTime,
                    timestamp: new Date().toISOString(),
                },
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error"
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
