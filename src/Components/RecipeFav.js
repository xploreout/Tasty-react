import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../App';
import { useContext } from "react";
import Popup from './Popup';
import  PuffLoader  from 'react-spinners/PuffLoader'
import '../App.css';


function RecipeFav() {
    const RecipeId = useParams();
    const [recipe, setRecipe] = useState({});
    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMakingNote, setIsMakingNote] = useState(false)
    const [doubleFetch, setDoubleFetch] = useState(!isMakingNote)
    const [isFavourite, setIsFavourite] = useState(true);
    const [popup, setPopup] = useState({
        show: false, // initial values set to false and null
        id: RecipeId.recipeParam,
      });
    const  userInfo  = useContext(UserContext)
    

    useEffect(() =>{
        const url = `https://final-project-backend-api.azurewebsites.net/user/favourite/recipe/${RecipeId.recipeParam}`;

        fetch(url)
            .then(res => res.json())
            .then(json => {
                setRecipe(json)
                setIsLoading(false)
            })
            .catch(err => console.error('error:' + err));
        
    }, [])

    useEffect(() =>{        
      fetch(`https://final-project-backend-api.azurewebsites.net/user/notes/${userInfo.id}/${RecipeId.recipeParam}`)
      .then(res => res.json())
      .then(json => {
          setNotes(json); 
      })
      .catch(err => console.log("error: ", err))  
    }, [isMakingNote, doubleFetch])


    function addNote(e){
        setIsMakingNote(false)
        setDoubleFetch(!doubleFetch)
        let note ={
            noteText: e.target[0].value,
            userId: userInfo.id,
            recipeId: RecipeId.recipeParam
          }

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
            body: JSON.stringify(note),
          };
    
        fetch("https://final-project-backend-api.azurewebsites.net/user/note/", requestOptions)
            .then(res => console.log(res))
            .catch(err => console.log(err))

        fetch(`https://final-project-backend-api.azurewebsites.net/user/notes/${userInfo.id}/${RecipeId.recipeParam}`)
        .then(res => res.json())
        .then(json => {
            setNotes(json) ; 
        })
        .catch(err => console.log("error: ", err))       
    }

    function handleFavourite(){
        if (!isFavourite){
          let recipe ={
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            imageUrl: recipe.imageUrl,
            imageAltText: recipe.title,
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
          handleDelete()
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

    // This will show the Cofirmation Box
    const handleDelete = () => {
        setPopup({
          show: true,
        });
      };
    
      // This will perform the deletion and hide the Confirmation Box  
      const handleDeleteTrue = () => {       
        setPopup({
          show: false,
        });
        deleteFromFav();  
      };
    
      // This will just hide the Confirmation Box when user clicks "No"/"Cancel"  
      const handleDeleteFalse = () => {
        setPopup({
          show: false,
        });
      };

      function deleteNote(noteIdParam){
        fetch(`https://final-project-backend-api.azurewebsites.net/User/note/${noteIdParam}`, requestDelete)
        .then(res => console.log(res))

        setNotes((current) =>
            current.filter((note) => note.noteId !== noteIdParam)
        );
      }
    return (
        <div className="recipe">
            {isLoading? <PuffLoader
                      size={150}
                      className = "spinner"
                      aria-label="Loading Spinner"
                      data-testid="loader"/>: 
            <div className="recipe">
                <h2>{recipe.title}</h2>
                <div className='recipe-top-wrapper'>
                    <img src = {recipe.imageUrl} alt = {recipe.name} className = "recipe-img"/>
                </div> 
                <div className='heart-container'>
                    <span className={isFavourite? 'liked' : 'unliked'} onClick = {handleFavourite}><i class="fa-solid fa-heart"></i></span>
                </div>
                <div className='ingredients-wrapper'>
                    <div className='ingredients-title-container' >
                        <h4 className='recipe-subtitle-ingredients'>Ingredients:</h4>
                    </div>
                    <div className='ingredients-list-container' >
                        {recipe.ingredients && recipe.ingredients.map(function (element, index) {
                                return (<div key = {index}>
                                            <p>{element} </p>
                                        </div>)
                            })}
                    </div>
                </div>   
                <ol className='steps-list'>
                    <h4 className='recipe-subtitle-instructions'>Instructions:</h4>
                    {recipe.instructions && recipe.instructions.map(function (element, index) {
                            return (<li key = {index}>
                                        {element} 
                                    </li>)
                        })}
                </ol> 
                <div className = "note-form-container">
                    {isMakingNote?  
                        <form className = "note-form" onSubmit={addNote}>
                            <textarea rows="4" cols="30"></textarea>
                            <button type = "submit" className = "search-button">Submit Note</button>
                        </form>:<span onClick={() => setIsMakingNote(true)}><span className="add-note-icon"><i class="fa-solid fa-pencil"></i></span>Add Note</span>}        
                </div>  
                <div className = "note-items-container">
                    {notes && notes.map(note => 
                    <div className='note-container'>
                        <span onClick = {() => deleteNote(note.noteId)}><i class="fa-solid fa-trash"></i></span><p className="note-item">{note.noteText}</p>
                    </div>)} 
                </div>      
            </div>} 
            {popup.show && (
                <Popup
                handleDeleteTrue={handleDeleteTrue}
                handleDeleteFalse={handleDeleteFalse}
                />
            )}
        </div>
  );
}

export default RecipeFav;

/*
 
*/