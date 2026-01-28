export function generateSyllabusPrompt(goal: string, duration: number): string {
  return `You are Mimir, an expert curriculum designer and learning guide. Create a comprehensive ${duration}-day learning bootcamp for the following goal:

GOAL: "${goal}"

Generate a detailed day-by-day curriculum that progressively builds knowledge from fundamentals to advanced concepts.

IMPORTANT: Return ONLY valid JSON in this exact format, with no markdown formatting, no backticks, and no additional text:

{
  "days": [
    {
      "day": 1,
      "title": "Day title here",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "description": "Brief description of what will be learned"
    }
  ]
}

Requirements:
1. Each day should have 3-5 specific topics
2. Start with fundamentals and progress to advanced concepts
3. Include practical, hands-on topics
4. Make titles engaging and clear
5. Ensure logical progression between days
6. Each day should build on previous knowledge
7. Include review/practice days if duration > 14 days
8. Return ONLY the JSON object, nothing else

Generate the ${duration}-day curriculum now:`;
}

export function generateLessonPrompt(
  goal: string,
  dayNumber: number,
  dayTitle: string,
  topics: string[],
): string {
  return `You are Mimir, an expert educator. Create a comprehensive lesson for Day ${dayNumber} of a bootcamp with this goal: "${goal}"

DAY ${dayNumber}: ${dayTitle}
TOPICS TO COVER: ${topics.join(", ")}

Create an engaging, detailed lesson in Markdown format that:
1. Starts with a brief overview of what will be learned
2. Explains each topic clearly with examples
3. Uses analogies and real-world applications
4. Includes code examples if relevant (use proper markdown code blocks)
5. Breaks down complex concepts into digestible parts
6. Ends with a summary of key takeaways

Write in a friendly, encouraging tone. Make it comprehensive but not overwhelming. The lesson should take about 20-30 minutes to read.

Generate the lesson content now (Markdown format):`;
}

export function generateActivitiesPrompt(lessonContent: string): string {
  return `Based on the following lesson content, generate 4 practice activities that reinforce the key concepts:

LESSON CONTENT:
${lessonContent}

Generate activities as a JSON array in this exact format (no markdown, no backticks):

[
  {
    "question": "Clear, specific question or task",
    "answer": "Detailed answer or solution with explanation"
  }
]

Requirements:
1. Create exactly 4 activities
2. Mix question types: conceptual understanding, practical application, problem-solving
3. Make questions specific and actionable
4. Provide comprehensive answers with explanations
5. Include code examples in answers if relevant
6. Progress from easier to more challenging
7. Return ONLY the JSON array, nothing else

Generate the 4 activities now:`;
}
