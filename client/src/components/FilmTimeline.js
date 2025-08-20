import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FILMS_BY_EPISODE } from '../queries/starwars';

function FilmTimeline() {
  const { loading, error, data } = useQuery(GET_FILMS_BY_EPISODE);

  if (loading) return <div className="loading">Loading films...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="film-timeline">
      <h2>Star Wars Film Timeline</h2>
      <div className="timeline">
        {data.filmsByEpisode.map((film) => (
          <div key={film.id} className="film-entry">
            <div className="episode-marker">
              Episode {film.episodeId}
            </div>
            <div className="film-details">
              <h3>{film.title}</h3>
              <p><strong>Released:</strong> {film.releaseDate}</p>
              <p><strong>Director:</strong> {film.director}</p>
              <div className="cast">
                <strong>Main Characters:</strong>
                <div className="character-chips">
                  {film.characters.map((character) => (
                    <span key={character.id} className="character-chip">
                      {character.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilmTimeline;