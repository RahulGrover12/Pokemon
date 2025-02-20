import { useEffect, useState } from "react";
import PokemonCards from "./PokemonCards";

const Pokemon = () => {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=31";

  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState("");

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      //   console.log(data);
      const detailedData = data.results.map(async (poke) => {
        // console.log(poke.url);
        const res = await fetch(poke.url);
        const data = await res.json();
        return data;
      });
      const fullData = await Promise.all(detailedData);
      setPokemonData(fullData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const filteredData = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  //   if (filteredData.length === 0) {
  //     return <h2>No Pokemon Found</h2>;
  //   }

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }
  let errorMsg = "";
  if (error) {
    errorMsg = error;
  }

  return (
    <>
      <section className="container">
        <header>
          <h1>Lets Catch Pokemon</h1>
        </header>

        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search for Pokemon"
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
          />
        </div>

        <div>
          <ul className="cards">
            {errorMsg}
            {filteredData.length === 0 ? (
              <h2>No data Found</h2>
            ) : (
              filteredData.map((pokemon) => {
                return <PokemonCards key={pokemon.id} pokemon={pokemon} />;
              })
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Pokemon;
