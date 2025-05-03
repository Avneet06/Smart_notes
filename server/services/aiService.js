import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// For demo purposes, fallback if no API key is available
const mockAiResponse = (content, type) => {
  if (type === 'summary') {
    // Return a simple summary by extracting first sentence and truncating content
    const firstSentence = content.split('.')[0];
    return `${firstSentence}. ${content.substring(0, 100)}...`;
  } else if (type === 'tags') {
    // Extract potential keywords from content
    const words = content.toLowerCase().split(/\W+/);
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 4) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 3);
    
    return sortedWords;
  }
};

// Generate summary for a note
export const generateSummary = async (content) => {
  try {
    if (!openai) {
      console.log('OpenAI API key not provided, using mock response');
      return mockAiResponse(content, 'summary');
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text concisely in 1-2 sentences.',
        },
        {
          role: 'user',
          content: `Summarize the following note in 1-2 sentences:\n\n${content}`,
        },
      ],
      max_tokens: 100,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI summary generation error:', error);
    // Fallback to simple summary if API fails
    return mockAiResponse(content, 'summary');
  }
};

// Suggest tags for a note
export const suggestTags = async (title, content) => {
  try {
    if (!openai) {
      console.log('OpenAI API key not provided, using mock response');
      return mockAiResponse(content, 'tags');
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that suggests relevant tags for notes. Provide exactly 3 tags.',
        },
        {
          role: 'user',
          content: `Suggest 3 tags for a note with the title "${title}" and content:\n\n${content}\n\nProvide only the tags separated by commas, no explanations.`,
        },
      ],
      max_tokens: 50,
    });
    
    const tagString = response.choices[0].message.content.trim();
    return tagString.split(',').map(tag => tag.trim());
  } catch (error) {
    console.error('AI tag suggestion error:', error);
    // Fallback to simple tag extraction if API fails
    return mockAiResponse(content, 'tags');
  }
};