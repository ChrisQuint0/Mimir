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
2. Mix question types:
   - Activity 1: Conceptual understanding (explain a concept in your own words)
   - Activity 2: Practical application (apply the concept to a real scenario)
   - Activity 3: Code or problem-solving (if applicable to the lesson)
   - Activity 4: Critical thinking (compare, analyze, or synthesize concepts)
3. Make questions specific and actionable
4. Provide comprehensive answers with:
   - Clear explanations
   - Step-by-step reasoning when appropriate
   - Code examples if the question involves coding (use proper markdown code blocks)
   - Why the answer is correct
5. Progress from easier to more challenging
6. Ensure questions directly relate to the lesson content
7. Return ONLY the JSON array, nothing else

Generate the 4 activities now:`;
}
