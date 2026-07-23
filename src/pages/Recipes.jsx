import { useEffect, useState } from "react";
import { getRecipes, searchRecipes } from "../api/recipes";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    const data = await getRecipes();
    setRecipes(data.recipes || []);
    setLoading(false);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSearch = async () => {
    if (!query) return loadRecipes();
    setLoading(true);
    const data = await searchRecipes(query);
    setRecipes(data.results || []);
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Recipes</h2>
      </div>
      <div className="card controls">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <div className="loading">Loading recipes...</div>}
      <div className="grid grid-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card list-item">
            <h3>{recipe.title || recipe.name}</h3>
            <div>Servings: {recipe.servings || recipe.serves}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;
