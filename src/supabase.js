import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to Update Search Count
export const updateSearchCount = async (searchMovie, movie) => {
    try {
        // Check if the movie exists
        const { data, error } = await supabase
            .from("search-movie")
            .select("*")
            .eq("movie_id", movie.id)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            // If the movie exists, update the count
            const { error: updateError } = await supabase
                .from("search-movie")
                .update({ count: data.count + 1 })
                .eq("movie_id", movie.id);

            if (updateError) throw updateError;
            console.log(`Count updated for ${searchMovie}`);
        } else {
            // Insert a new row if it doesn't exist
            const { error: insertError } = await supabase
                .from("search-movie")
                .insert([
                    {
                        movie_id: movie.id,
                        searchMovie,
                        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        count: 1,
                    },
                ]);

            if (insertError) throw insertError;
            console.log(`Inserted new movie: ${searchMovie}`);
        }
    } catch (error) {
        console.error("Supabase Error:", error.message || error);
    }
};

export const fetchTrendingMovies = async () => {
    try {
        let { data: searchMovieData, error } = await supabase
            .from("search-movie") // Table name
            .select("searchMovie, movie_id, poster_url")
            .order("count", { ascending: false })
            .limit(5);
        if (error) throw error;

        console.log("Trending Movies:", searchMovieData);
        return searchMovieData;
    } catch (error) {
        console.error("Trending Movies Error:", error.message || error);
        return null;
    }
};
