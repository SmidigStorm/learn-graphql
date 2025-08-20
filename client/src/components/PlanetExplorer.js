import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PLANETS, UPDATE_PLANET_POPULATION } from '../queries/starwars';

function PlanetExplorer() {
  const { loading, error, data } = useQuery(GET_PLANETS);
  const [updatePopulation] = useMutation(UPDATE_PLANET_POPULATION);

  const handlePopulationUpdate = async (planetId, currentPopulation) => {
    const newPopulation = prompt('Enter new population:', currentPopulation);
    if (newPopulation && !isNaN(newPopulation)) {
      try {
        await updatePopulation({
          variables: {
            planetId,
            population: parseFloat(newPopulation)
          }
        });
      } catch (err) {
        console.error('Error updating population:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading planets...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="planet-explorer">
      <h2>Planets of the Galaxy</h2>
      <div className="planet-grid">
        {data.planets.map((planet) => (
          <div key={planet.id} className="planet-card">
            <h3>{planet.name}</h3>
            <div className="planet-info">
              <p><strong>Climate:</strong> {planet.climate}</p>
              <p><strong>Terrain:</strong> {planet.terrain}</p>
              <div className="population">
                <strong>Population:</strong> {planet.population?.toLocaleString() || 'Unknown'}
                <button 
                  className="edit-btn"
                  onClick={() => handlePopulationUpdate(planet.id, planet.population)}
                  title="Update population"
                >
                  ✏️
                </button>
              </div>
            </div>
            {planet.residents.length > 0 && (
              <div className="residents">
                <strong>Notable Residents:</strong>
                <ul>
                  {planet.residents.map((resident) => (
                    <li key={resident.id}>{resident.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanetExplorer;