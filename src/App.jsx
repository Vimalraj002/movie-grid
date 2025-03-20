import React, {useState, useEffect} from 'react';
import Search from "./Components/Search.jsx";
import Loader from "./Components/Loader.jsx";
import MovieCard from "./Components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {updateSearchCount, fetchTrendingMovies} from "./supabase.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {

    const [searchMovie, setSearchMovie] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchMovie, setDebounceSearchMovie] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([])

    useDebounce( ()=> setDebounceSearchMovie(searchMovie), 1000, [searchMovie])

    const fetchMovies = async(query = '') => {
        try{
            setIsLoading(false);
            setErrorMessage('');

            const endpoint = query
                ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok){
                throw new Error('Failed to fetch movie results.');
            }
            const data = await response.json();
            if(data.Response === 'False' ){
                setErrorMessage(data.Error || 'Failed to fetch movie results.');
                setMovieList([]);
                return;
            }
            console.log(data.results);
            setMovieList(data.results || []);
            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error){
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async() => {
        try {
            const movies = await fetchTrendingMovies();
            setTrendingMovies(movies);
        } catch (error){
            console.log(error);
        }
    }

    useEffect( () => {
        loadTrendingMovies();
    }, []);

    useEffect( () => {
        fetchMovies(debounceSearchMovie);
    }, [debounceSearchMovie]);

    return (
        <main>
            <div className="Pattern"/>

            <div className="Wrapper">
                <header>
                    <img src="./hero.png" alt="Hero" className="max-w-[720px] h-auto object-contain mx-auto w-full" />
                    <h1>Find <span className= "text-gradient" >Movies</span> You'll Enjoy Without The Hassle</h1>
                    <Search searchMovie={searchMovie} setSearchMovie={setSearchMovie} />
                </header>
            </div>

            {trendingMovies.length > 0 && (
                <section className="trending">
                    <h2>Trending Movies</h2>

                    <ul className="mt-1">
                        {trendingMovies.map((movie,index) => (
                            <li key={movie.$id}>
                                <p>{index+1}</p>
                                <img src={movie.poster_url} alt={movie.title} />
                            </li>
                        )) }
                    </ul>
                </section>
            )}

            <section className="all-movies">
                <h2>Popular</h2>

                {isLoading? (
                    <Loader />
                ): errorMessage? (
                    <p className="text-red">Error: {errorMessage}</p>
                ) : (
                    <ul>
                        {movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie}/>
                        ))};
                    </ul>
                )};
            </section>
        </main>

    )
}

export default App;