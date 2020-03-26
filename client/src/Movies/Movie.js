import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouteMatch, Link, useParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Button } from 'reactstrap';

function Movie({ addToSavedList, props }) {
    const [movie, setMovie] = useState(null);
    const match = useRouteMatch();
    const { id } = useParams();

    const fetchMovie = id => {
        axios
            .get(`http://localhost:5000/api/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(err => console.log(err.response));
    };

    const saveMovie = () => {
        addToSavedList(movie);
    };

    useEffect(() => {
        fetchMovie(match.params.id);
    }, [match.params.id]);

    if (!movie) {
        return <div>Loading movie information...</div>;
    }

    const handleDelete = e => {
        e.preventDefault();
        axios
            .delete(`http://localhost:5000/api/movies/${id}`)
            .then(res => {
                props.setMovieList(res.data);
                props.history.push('/movies')
            })
            .catch(err => console.log('Delete error', err));
    };

    return (
        <div className='save-wrapper'>
            <MovieCard movie={movie} />

            <div className='save-button' onClick={saveMovie}>
                Save
            </div>
            <Link to={`/update-movie/${id}`}>
                <Button>Update</Button>
            </Link>
            <Button onClick= {handleDelete} >Delete Movie</Button>
        </div>
    );
}

export default Movie;