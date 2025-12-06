# Adding New AI Features - Template Guide

This template provides a step-by-step guide for adding new AI-powered features to UniPlanner.

---

## Quick Reference: Files to Modify

| Step | File | Purpose |
|------|------|---------|
| 1 | `lib/types.ts` | Add feature type enum + result interface |
| 2 | `lib/utils/ai.ts` | Add prompt generator function |
| 3 | `managers/AIManager.ts` | Add orchestration method |
| 4 | `components/ai/YourFeature.tsx` | Create UI component |
| 5 | `app/ai/your-feature/page.tsx` | Create route page |
| 6 | `views/AIToolsView.tsx` | Add to tools grid |

---

## Step 1: Define Types

Add to [lib/types.ts](file:///Users/abhimanyumalik/Desktop/UniPlanner/Ai-Portfolio-App-main/lib/types.ts):

```typescript
// Add to AIFeatureType enum (~line 245)
export enum AIFeatureType {
    // ...existing types...
    YourFeature = 'your_feature',
}

// Add result interface (~after line 361)
export interface YourFeatureResult {
    // Define the structure Grok should return
    mainOutput: string;
    suggestions: string[];
    confidence: number;
}
```

---

## Step 2: Create Prompt Generator

Add to [lib/utils/ai.ts](file:///Users/abhimanyumalik/Desktop/UniPlanner/Ai-Portfolio-App-main/lib/utils/ai.ts):

```typescript
/**
 * Generate prompt for [your feature description]
 */
export function generateYourFeaturePrompt(data: {
    input1: string;
    input2: number;
}): string {
    return `You are an expert at [domain]. Analyze the following:

Input 1: ${data.input1}
Input 2: ${data.input2}

Return a JSON response with this exact structure:
{
    "mainOutput": "your main response here",
    "suggestions": ["suggestion 1", "suggestion 2"],
    "confidence": 0-100
}

Be specific and actionable in your recommendations.`;
}
```

> [!TIP]
> **Prompt Best Practices:**
> - Always specify JSON output format explicitly
> - Include example structure for complex responses
> - Set clear expectations about tone and detail level
> - Lower `temperature` (0.3-0.5) for factual outputs
> - Higher `temperature` (0.6-0.8) for creative outputs

---

## Step 3: Add AIManager Method

Add to [managers/AIManager.ts](file:///Users/abhimanyumalik/Desktop/UniPlanner/Ai-Portfolio-App-main/managers/AIManager.ts):

```typescript
import { generateYourFeaturePrompt } from '@/lib/utils/ai';
import type { YourFeatureResult } from '@/lib/types';

/**
 * [Description of what this feature does]
 */
static async yourFeature(
    userId: UUID,
    data: {
        input1: string;
        input2: number;
    }
): Promise<YourFeatureResult> {
    const prompt = generateYourFeaturePrompt(data);

    try {
        const response = await callAIWithRetry(prompt, {
            featureType: AIFeatureType.YourFeature,
            temperature: 0.6,  // Adjust based on use case
            max_tokens: 2000,  // Adjust if more/less output needed
        });

        const result = parseAIResponse<YourFeatureResult>(response);

        // Cache result in database
        await AIRecommendationsRepository.create({
            user_id: userId,
            feature_type: AIFeatureType.YourFeature,
            input_data: data as Record<string, unknown>,
            output_data: JSON.parse(JSON.stringify(result)),
            confidence_score: result.confidence,
        });

        return result;
    } catch (error) {
        console.error('Your feature error:', error);
        throw new Error(
            error instanceof Error
                ? `Failed: ${error.message}`
                : 'Failed to process request'
        );
    }
}
```

---

## Step 4: Create UI Component

Create `components/ai/YourFeature.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { AIManager } from '@/managers/AIManager';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import type { YourFeatureResult } from '@/lib/types';

export function YourFeature() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<YourFeatureResult | null>(null);
    const [formData, setFormData] = useState({
        input1: '',
        input2: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Please log in to use this feature');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await AIManager.yourFeature(user.id, {
                input1: formData.input1,
                input2: parseInt(formData.input2),
            });

            setResult(response);
            toast.success('Analysis complete');
        } catch (error) {
            console.error(error);
            toast.error('Failed to process request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Your Feature Name</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Description of what this feature does
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Input 1 *</label>
                    <input
                        type="text"
                        required
                        value={formData.input1}
                        onChange={(e) => setFormData({ ...formData, input1: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter value..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Analyze
                        </>
                    )}
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Results</h3>
                    <p>{result.mainOutput}</p>
                    <ul className="mt-4 space-y-2">
                        {result.suggestions.map((s, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                • {s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
```

---

## Step 5: Create Route Page

Create `app/ai/your-feature/page.tsx`:

```typescript
'use client';

import { YourFeature } from '@/components/ai/YourFeature';

export default function YourFeaturePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <YourFeature />
        </div>
    );
}
```

---

## Step 6: Add to AI Tools View

Update [views/AIToolsView.tsx](file:///Users/abhimanyumalik/Desktop/UniPlanner/Ai-Portfolio-App-main/views/AIToolsView.tsx):

```typescript
const tools = [
    // ...existing tools...
    {
        title: 'Your Feature Name',
        description: 'Short description of what it does',
        icon: Sparkles,  // Import from lucide-react
        href: '/ai/your-feature',
        color: 'from-orange-500 to-red-500',
        textColor: 'text-orange-600 dark:text-orange-400',
    },
];
```

---

## Optional: Database Constraint Update

If the database has a strict CHECK constraint on `feature_type`:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE ai_recommendations 
DROP CONSTRAINT ai_recommendations_feature_type_check;

ALTER TABLE ai_recommendations 
ADD CONSTRAINT ai_recommendations_feature_type_check 
CHECK (feature_type IN (
    'course_extraction',
    'acceptance_prediction',
    'portfolio_advice',
    'course_recommendation',
    'grade_analysis',
    'your_feature'  -- Add new type
));
```

---

## AI Configuration Reference

| Parameter | Default | When to Adjust |
|-----------|---------|----------------|
| `temperature` | 0.7 | Lower (0.3-0.5) for facts, higher (0.6-0.8) for creativity |
| `max_tokens` | 2000 | Increase for longer responses, decrease to save costs |

---

## Checklist

Before testing your new feature:

- [ ] Type added to `AIFeatureType` enum
- [ ] Result interface defined in `lib/types.ts`
- [ ] Prompt function added to `lib/utils/ai.ts`
- [ ] Manager method added to `managers/AIManager.ts`
- [ ] Component created in `components/ai/`
- [ ] Page created in `app/ai/`
- [ ] Tool added to `AIToolsView.tsx`
- [ ] (Optional) Database constraint updated
