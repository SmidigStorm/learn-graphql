import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_STARSHIPS, GET_CHARACTERS, ASSIGN_PILOT } from '../queries/starwars';

function StarshipDatabase() {
  const { loading: loadingShips, error: errorShips, data: shipsData } = useQuery(GET_STARSHIPS);
  const { data: charactersData } = useQuery(GET_CHARACTERS);
  const [assignPilot] = useMutation(ASSIGN_PILOT);
  const [selectedShip, setSelectedShip] = useState(null);

  const handleAssignPilot = async (starshipId, characterId) => {
    try {
      await assignPilot({
        variables: { starshipId, characterId }
      });
      setSelectedShip(null);
    } catch (err) {
      console.error('Error assigning pilot:', err);
    }
  };

  if (loadingShips) return <div className="loading">Loading starships...</div>;
  if (errorShips) return <div className="error">Error: {errorShips.message}</div>;

  return (
    <div className="starship-database">
      <h2>Starship Database</h2>
      <div className="starship-list">
        {shipsData.starships.map((ship) => (
          <div key={ship.id} className="starship-card">
            <h3>{ship.name}</h3>
            <div className="ship-specs">
              <p><strong>Model:</strong> {ship.model}</p>
              <p><strong>Manufacturer:</strong> {ship.manufacturer}</p>
              <p><strong>Length:</strong> {ship.length} meters</p>
              <p><strong>Crew:</strong> {ship.crew}</p>
              <p><strong>Passengers:</strong> {ship.passengers}</p>
            </div>
            <div className="pilots-section">
              <div className="pilots-header">
                <strong>Pilots:</strong>
                <button 
                  className="add-pilot-btn"
                  onClick={() => setSelectedShip(ship.id)}
                >
                  + Add Pilot
                </button>
              </div>
              {ship.pilots.length > 0 ? (
                <ul>
                  {ship.pilots.map((pilot) => (
                    <li key={pilot.id}>{pilot.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-pilots">No assigned pilots</p>
              )}
            </div>
            
            {selectedShip === ship.id && charactersData && (
              <div className="pilot-selector">
                <select onChange={(e) => {
                  if (e.target.value) {
                    handleAssignPilot(ship.id, e.target.value);
                  }
                }}>
                  <option value="">Select a pilot...</option>
                  {charactersData.characters
                    .filter(char => !ship.pilots.some(p => p.id === char.id))
                    .map(char => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))
                  }
                </select>
                <button onClick={() => setSelectedShip(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StarshipDatabase;