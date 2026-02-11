export function generateSyllabusPrompt(goal: string, duration: number): string {
  return `You are Mimir, an expert curriculum designer. create a structured ${duration}-day learning syllabus for the following goal:

GOAL: "${goal}"

Format the response as a JSON object with a "days" array. Each day should have:
- day: number (1 to ${duration})
- title: string (short, catchy title)
- description: string (brief overview of what will be learned)
- topics: string[] (3-5 specific key topics/concepts)

The syllabus should be progressive, starting with foundations and building up to complex topics.
Ensure the content is achievable in about 1-2 hours per existing day.

EXAMPLE JSON FORMAT:
{
  "days": [
    {
      "day": 1,
      "title": "Introduction to Concepts",
      "description": "Overview of the basics and setting up the environment.",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ]
}

RETURN ONLY THE JSON OBJECT. NO MARKDOWN, NO EXPLANATIONS.`;
}

export function generateLessonPrompt(
  goal: string,
  dayNumber: number,
  dayTitle: string,
  topics: string[],
): string {
  return `You are Mimir, an expert educator creating engaging learning content. Generate a comprehensive lesson for Day ${dayNumber} of a bootcamp.

BOOTCAMP GOAL: "${goal}"

DAY ${dayNumber}: ${dayTitle}

TOPICS TO COVER:
${topics.map((topic, i) => `${i + 1}. ${topic}`).join("\n")}

Create a detailed, engaging lesson in Markdown format that:

1. **Introduction (2-3 paragraphs)**
   - Start with a brief overview of what will be learned today
   - Explain why these topics are important
   - Connect to previous days if applicable

2. **Main Content (for each topic)**
   - Clear explanations with real-world examples
   - Use analogies to make complex concepts accessible
   - Include code examples if relevant (use proper markdown code blocks with language specification)
   - Break down complex ideas into digestible parts
   - Use headers (##, ###) to organize content

3. **Practical Examples**
   - At least 2-3 concrete examples demonstrating the concepts
   - Show both correct usage and common mistakes to avoid
   - Include comments in code examples

4. **Key Takeaways**
   - Summarize the most important points in a bulleted list
   - Highlight what learners should remember

5. **Next Steps Preview**
   - Brief mention of how this connects to future lessons
   - Encourage practice and experimentation

FORMATTING REQUIREMENTS:
- Use proper Markdown syntax
- Use ## for main sections, ### for subsections
- Use code blocks with language tags: \`\`\`javascript, \`\`\`python, etc.
- Use bullet points and numbered lists where appropriate
- Keep paragraphs concise (3-5 sentences max)
- Use **bold** for important terms
- Use \`inline code\` for variable names and short code snippets

TONE:
- Friendly and encouraging
- Clear and accessible (avoid unnecessary jargon)
- Enthusiastic but professional
- Use "you" to address the learner directly

The lesson should take approximately 20-30 minutes to read and understand.

Generate the lesson content now (Markdown format only, no JSON):`;
}

export function generateActivitiesPrompt(lessonContent: string): string {
  return `You are Mimir, an expert educator creating practice activities. Based on the following lesson content, generate 4 practice activities that reinforce key concepts.

LESSON CONTENT:
${lessonContent}

Generate activities as a JSON array in this EXACT format (no markdown, no backticks, no additional text):

[
  {
    "question": "Clear, specific question or task",
    "answer": "Detailed answer or solution with explanation"
  },
  {
    "question": "Clear, specific question or task",
    "answer": "Detailed answer or solution with explanation"
  },
  {
    "question": "Clear, specific question or task",
    "answer": "Detailed answer or solution with explanation"
  },
  {
    "question": "Clear, specific question or task",
    "answer": "Detailed answer or solution with explanation"
  }
]

REQUIREMENTS:
1. Create EXACTLY 4 activities
2. Mix question types based on the subject nature:
   - IF the subject is PRACTICAL (e.g., programming, design, engineering):
     - Activities 1, 2, and 3 MUST be practical/hands-on exercises (e.g., "Write a function to...", "Design a component that...", "Debug this code...").
     - Activity 4 should be a critical thinking or conceptual question (e.g., "Explain why...", "Compare X and Y...").
   - IF the subject is THEORETICAL/CONCEPTUAL:
     - Activity 1: Conceptual understanding
     - Activity 2: Practical application scenario
     - Activity 3: Analysis/Problem-solving
     - Activity 4: Critical thinking/Synthesis
3. Make questions specific and actionable
4. Provide comprehensive answers with:
   - Clear explanations
   - Step-by-step reasoning when appropriate
   - Code examples MUST use proper markdown code blocks (e.g., use triple backticks with language)
   - Why the answer is correct
5. Progress from easier to more challenging
6. Ensure questions directly relate to the lesson content
7. Return ONLY the JSON array, nothing else

Generate the 4 activities now:`;
}
