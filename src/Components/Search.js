import '../App.css';
import Result from './Result';
import {useState, useEffect} from 'react';
import  PuffLoader  from 'react-spinners/PuffLoader'

function Search() {
  let initialState = JSON.parse(localStorage.getItem("last-search-items") || "[]");
  const [recipes, setRecipes] = useState(initialState);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    localStorage.setItem("last-search-items", JSON.stringify(recipes));
  }, [recipes])


  const getRecipe = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${query}`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b91f8e3918msh09091d981c40f5ep1bb458jsna7cb3ea58d57',
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => { setRecipes(json.results.map(recipe => recipe.recipes === undefined? recipe : recipe.recipes[1] )); setIsLoading(false); console.log(json)})
      .catch(err => console.error('error:' + err));
  };

  function handleChange(e) {
    setQuery(e.target.value)
  }

  return (
    <div className="search">
      <form onSubmit={getRecipe}>
        <input
          className='search-input'
          type='text'
          value={query}
          onChange={handleChange}/>
        <button className='search-button' type='submit'>Search</button>
      </form>
      {recipes.length < 1 && !isLoading ? <h2 className='placeholder'>What do you fancy? <br/> Search for yummy ideas!</h2> :
      isLoading? <PuffLoader
                      size={150}
                      className = "spinner"
                      aria-label="Loading Spinner"
                      data-testid="loader"/> : 
      <div className='recipes-container'>
        {recipes && recipes.map((recipe, index) =>
          <div key={index}>
            <Result instructions={recipe.instructions} name={recipe.name} image={recipe.thumbnail_url}
                    id={recipe.id} ingredients={recipe.sections} isFavourite={false}/>
          </div>
        )}
      </div>}
    </div>
  );
}

export default Search;


/* 
  

*/
