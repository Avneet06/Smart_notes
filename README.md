# Smart Notes Web Application

## Overview

Smart Notes is a web application that allows users to create, edit, and manage notes. It integrates AI to generate summaries and suggest tags automatically.

## Tech Stack

- **Frontend**: React (or Preact/NextJS)
- **State Management**: Any preferred system (e.g., Redux, Context API)
- **Styling**: Tailwind CSS (optional)
- **Backend**: Supabase (for authentication and DB)
- **Database**: Supabase
- **AI**: Hugging Face's Transformers or OpenAI's GPT API

## Features

- **Login/Signup**: User authentication via Supabase.
- **Dashboard**: Display notes in a paginated format.
- **CRUD Operations**: Create, read, update, and delete notes.
- **AI Summary**: Automatically generate a summary for each note.
- **Search**: Search notes by title or tags.
- **Manual Tagging**: Add custom tags to notes.

## Setup Instructions

### Prerequisites

- **Supabase API Key**: You need a Supabase project to run the app.
  - Sign up at [Supabase](https://supabase.io/) and create a new project.
  - Add the Supabase credentials (URL and API key) to your `.env` file.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-notes.git
   cd smart-notes
   
2.Install dependencies:
    npm install

3.Create a .env file in the root directory and add your Supabase credentials:

    SUPABASE_URL=your_supabase_url
    SUPABASE_API_KEY=your_supabase_api_key
    
4. Run the development server:
   npm run dev
   
5.Open the app in your browser at http://localhost:3000.
