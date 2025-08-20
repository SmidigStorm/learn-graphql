import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTERS, ADD_CHARACTER } from '../queries/starwars';

function CharacterList() {
  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS);
  const [addCharacter] = useMutation(ADD_CHARACTER);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    height: '',
    mass: '',
    homeworldId: ''
  });

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    try {
      await addCharacter({
        variables: {
          input: {
            name: newCharacter.name,
            height: parseInt(newCharacter.height) || null,
            mass: parseInt(newCharacter.mass) || null,
            homeworldId: newCharacter.homeworldId || null
          }
        }
      });
      refetch();
      setShowAddForm(false);
      setNewCharacter({ name: '', height: '', mass: '', homeworldId: '' });
    } catch (err) {
      console.error('Error adding character:', err);
    }
  };

  if (loading) return <div className="loading">Loading characters...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="character-list">
      <div className="header">
        <h2>Star Wars Characters</h2>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Character'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCharacter} className="add-form">
          <input
            type="text"
            placeholder="Name"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={newCharacter.height}
            onChange={(e) => setNewCharacter({ ...newCharacter, height: e.target.value })}
          />
          <input
            type="number"
            placeholder="Mass (kg)"
            value={newCharacter.mass}
            onChange={(e) => setNewCharacter({ ...newCharacter, mass: e.target.value })}
          />
          <select
            value={newCharacter.homeworldId}
            onChange={(e) => setNewCharacter({ ...newCharacter, homeworldId: e.target.value })}
          >
            <option value="">Select Homeworld</option>
            <option value="1">Tatooine</option>
            <option value="2">Alderaan</option>
            <option value="3">Corellia</option>
            <option value="4">Hoth</option>
            <option value="5">Dagobah</option>
          </select>
          <button type="submit">Add Character</button>
        </form>
      )}

      <div className="cards">
        {data.characters.map((character) => (
          <div key={character.id} className="character-card">
            <h3>{character.name}</h3>
            <p>Height: {character.height || 'Unknown'} cm</p>
            <p>Mass: {character.mass || 'Unknown'} kg</p>
            <p>Homeworld: {character.homeworld?.name || 'Unknown'}</p>
            {character.starships.length > 0 && (
              <div className="starships">
                <strong>Starships:</strong>
                <ul>
                  {character.starships.map((ship) => (
                    <li key={ship.id}>{ship.name}</li>
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

export default CharacterList;