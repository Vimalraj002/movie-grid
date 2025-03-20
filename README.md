## 🎬 Movie Search App

A React-based movie search app that fetches movie data from The Movie Database (TMDB) and tracks trending searches using Supabase.

## 🚀 Features

- 🔎 Search for Movies using TMDB API
- 📊 Track Popular Searches with a search count stored in Supabase
- 🎥 Trending Movies Section based on user searches
- 💡 Debounced Search to optimize API calls
- ⚡ Fast and Responsive UI


## 🛠 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/movie-search-app.git
cd movie-search-app
```
## 2️⃣ Install Dependencies
```bash
npm install
```
## 3️⃣ Set Up Environment Variables
Create a .env file in the project root and add:
```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
````
## 4️⃣ Run the Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.
## 📝 How It Works
**1. User Searches for a Movie**
- Calls TMDB API to fetch movie details.
- If a valid movie is found, updateSearchCount() updates the search count in Supabase.
**2. Trending Movies**
- fetchTrendingMovies() retrieves the top 5 most searched movies from Supabase.
- Movies are sorted by count in descending order.

## ⚙️ Technologies Used
- **React** (Frontend UI)
- **Supabase** (Database & API for tracking searches)
- **TMDB API** (Movie data source)
- **Vite** (Development environment)

