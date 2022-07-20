import React,{useEffect,useState} from 'react'
import { getRelatedMovies } from '../api/movie'
import { useNotification } from '../hooks';
import { parseError } from '../utils/helper';
import MovieList from '../feature/user/MovieList'
export default function RelatedMovies({movieId}) {
    const [movies,setMovies] = useState([]);

    const {updateNotification} = useNotification()

    const fetchRalatedMovies = async() =>{
        try {
            const {movies} = await getRelatedMovies(movieId);
            setMovies([...movies])
        } catch (error) {
            updateNotification('error',parseError(error));      
        }
    }

    useEffect(() =>{
        if(movieId) fetchRalatedMovies()
    },[movieId])

    return (
    <MovieList title="Related Movies" movies={movies} />
  )
}

