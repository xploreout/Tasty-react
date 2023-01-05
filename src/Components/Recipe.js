import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../App';
import { useContext } from "react";
import  PuffLoader  from 'react-spinners/PuffLoader'
import '../App.css';


function Recipe() {
    const RecipeId = useParams();
    const [recipe, setRecipe] = useState({});
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [ingredients, setIngredients] = useState([])
    const [steps, setSteps] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFavourite, setIsFavourite] = useState(false);
    const  userInfo  = useContext(UserContext)
    

    useEffect(() =>{
        const url = `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${RecipeId.recipeParam}`;

        const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8694d2a99fmshb67a187776fc3f9p150d94jsn55965acf1bc7',
            'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                setRecipe(json)
                setName(json.name)
                setImage(json.thumbnail_url)
                let ingredients = json.sections.map(element => element.components.map(subElement => subElement))
                setIngredients(ingredients.flat(Infinity))
                setSteps(json.instructions)
                setIsLoading(false)
            })
            .catch(err => console.error('error:' + err));
    }, [RecipeId.recipeParam])


    function handleFavourite(){
        let ingredientsDTO = ingredients.map(element => element.raw_text)
        let instructionsDTO = steps.map(element => element.display_text) 
                             
        if (!isFavourite){
          let recipe ={
            title: name,
            ingredients: ingredientsDTO,
            instructions: instructionsDTO,
            imageUrl: image,
            imageAltText: name,
            cookingTime: 0,
            nutrition: "null",
            userId: userInfo.id
          }
          
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
            body: JSON.stringify(recipe),
          };

          fetch('https://final-project-backend-api.azurewebsites.net/user/favourite', requestOptions)
            .then(function(response) {                      
                if(response.ok)
                {
                return response.json();         
                }
        
                throw new Error('Something went wrong.');
            })
            .catch(err => console.log("this is the error",err))
        }else{
          deleteFromFav()
        }
        setIsFavourite(!isFavourite)
    }

    const requestDelete = {
        method: 'DELETE',
        headers: {  'accept': '*/*' }
    };

    function deleteFromFav(){
        fetch(`https://final-project-backend-api.azurewebsites.net/User/${userInfo.id}/${RecipeId.recipeParam}`, requestDelete)
        .then(res => console.log(res))
    }

    return (
        <div className="recipe">
            {isLoading? <PuffLoader
                      size={150}
                      className = "spinner"
                      aria-label="Loading Spinner"
                      data-testid="loader"/>: 
            <div className="recipe">
                <h2>{recipe.name}</h2>
                <div className='recipe-top-wrapper'>
                    <img src = {recipe.thumbnail_url} alt = {recipe.name} className = "recipe-img"/>
                </div>
                <div className='heart-container'>
                    <span className={isFavourite? 'liked' : 'unliked'} onClick = {handleFavourite}><i class="fa-solid fa-heart"></i></span>
                </div> 
                <div className='ingredients-wrapper'>
                    <div className='ingredients-title-container' >
                        <h4 className='recipe-subtitle-ingredients'>Ingredients:</h4>
                    </div>
                    <div className='ingredients-list-container' >
                        {ingredients && ingredients.map(function (element, index) {
                                return (<div key = {index}>
                                            <p>{element.raw_text}</p>
                                        </div>)
                            })}
                    </div>
                </div>   
                <ol className='steps-list'>
                    <h4 className='recipe-subtitle-instructions'>Instructions:</h4>
                    {steps && steps.map(function (element, index) {
                            return (<li key = {index}>
                                        {element.display_text} 
                                    </li>)
                        })}
                </ol> 
            </div>} 
        </div>
  );
}
// {notes ?? notes.map(note => <p>{note}</p>)}   
export default Recipe;