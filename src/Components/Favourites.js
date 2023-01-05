import '../App.css';
import {useState, useEffect} from 'react';
import { useContext } from "react";
import  PuffLoader  from 'react-spinners/PuffLoader'
import { UserContext } from '../App';
import Result from './Result';


function Favourites() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const  userInfo  = useContext(UserContext);


  useEffect(() => {
    setIsLoading(true)
    fetch(`https://final-project-backend-api.azurewebsites.net/user/favourites/${userInfo.id}`)
      .then(res => res.json())
      .then(json => {setRecipes(json); setIsLoading(false)})
  }, [])

  function removeRecipe(id){
    setRecipes((current) =>
      current.filter((recipe) => recipe.recipeId !== id)
    );
  }


  return (
    <div className="favourites">
      {recipes.length == 0 && !isLoading? <h2 className='placeholder'>Looks empty here... <br/> Search for recipes and give them a heart!</h2> :
        isLoading? <PuffLoader
        size={150}
        className = "spinner"
        aria-label="Loading Spinner"
        data-testid="loader"/> :
      <div className='recipes-container'>
        {recipes && recipes.map((recipe, index) =>
          <div key={index}>
            <Result instructions={recipe.instructions} name={recipe.title} image={recipe.imageUrl} id={recipe.recipeId}
                    ingredients={recipe.ingredients} isFavourite={true} deleteFromState = {removeRecipe}/> 
          </div>
        )}
      </div>}
    </div>
  );
}
  
export default Favourites;