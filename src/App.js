import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TABLE_HEADER_VALUES = ['Name', 'Climate', 'Residents', 'Terrain', 'Population', 'H20 Surface Area'];

const AppWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ErrorWrapper = styled.div`
  color: red;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Table = styled.table`
  border-spacing: 0;
  border: 1px solid black;

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  th, td {
    padding: 0.5rem;
    border-bottom: 1px solid gray;
    border-right: 1px solid gray;

    :last-child {
      border-right: 0;
    }
  }

  th {
    background: gray;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    fontWeight: bold;
    text-align: left;
  }
`;

const App = () => {
  const [planets, setPlanets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets/')
      .then(resp => {
        if (!resp.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${resp.status}`
          );
        }
        return resp.json();
      })
      .then(data => {
        setPlanets(data?.results);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
      })
  }, []);

  const formatNumber = (int) => {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const calculateSurfaceArea = (diameter, surfaceWater) => {
    if (surfaceWater === 'unknown') return (<td>?</td>);
    const radius = diameter / 2;
    const waterSurfaceArea = Math.round(4 * Math.PI * (radius * radius) * (parseFloat(surfaceWater) / 100));
    return (<td>{formatNumber(waterSurfaceArea)} km<sup>2</sup></td>);
  };

  const planetsFormatted = planets?.map((planet) => ({
    name: planet.name,
    climate: planet.climate,
    diameter: planet.diameter,
    residents: planet.residents.length,
    terrain: planet.terrain,
    population: formatNumber(planet.population.replace("unknown", "?")),
    surfaceWater: planet.surface_water,
    url: planet.url,
  })).sort((a,b) => a.name.localeCompare(b.name));

  const renderError = (
    <ErrorWrapper>
      <h3>{error}</h3>
    </ErrorWrapper>
  )

  const renderLoadingState = (
    <LoadingWrapper>
      <h1>Loading...</h1>
    </LoadingWrapper>
  );

  return (
    <AppWrapper>
      <h1>Truss Star Wars Planets API</h1>
      {loading && renderLoadingState}
      {error && renderError}
      {!loading && planets && (
        <Table>
          <thead>
            <tr>
              {TABLE_HEADER_VALUES.map((value, index) => (
                <th key={`${value}-${index}`}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planetsFormatted?.map((planet, index) => {
              const {name, climate, diameter, population, residents, surfaceWater, terrain, url} = planet;
              return (
                <tr key={`${name} - ${index}`} style={{ border: '1px solid gray'}}>
                  <td>
                    <a 
                      href={url}
                      rel="noreferrer"
                      target="_blank"
                    >{name}</a>
                  </td>
                  <td>{climate}</td>
                  <td>{residents}</td>
                  <td>{terrain}</td>
                  <td>{population}</td>
                  {calculateSurfaceArea(diameter, surfaceWater)}
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </AppWrapper>
  );
}

export default App;
