import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import CharacterList from './components/CharacterList';
import PlanetExplorer from './components/PlanetExplorer';
import StarshipDatabase from './components/StarshipDatabase';
import FilmTimeline from './components/FilmTimeline';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('characters');

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>Star Wars GraphQL Explorer</h1>
          <p>Learn GraphQL with the Star Wars Universe</p>
        </header>
        
        <nav className="tab-nav">
          <button 
            className={activeTab === 'characters' ? 'active' : ''}
            onClick={() => setActiveTab('characters')}
          >
            Characters
          </button>
          <button 
            className={activeTab === 'planets' ? 'active' : ''}
            onClick={() => setActiveTab('planets')}
          >
            Planets
          </button>
          <button 
            className={activeTab === 'starships' ? 'active' : ''}
            onClick={() => setActiveTab('starships')}
          >
            Starships
          </button>
          <button 
            className={activeTab === 'films' ? 'active' : ''}
            onClick={() => setActiveTab('films')}
          >
            Films
          </button>
        </nav>

        <main className="main-content">
          {activeTab === 'characters' && <CharacterList />}
          {activeTab === 'planets' && <PlanetExplorer />}
          {activeTab === 'starships' && <StarshipDatabase />}
          {activeTab === 'films' && <FilmTimeline />}
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;