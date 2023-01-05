import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { useContext } from "react";
import Popup from './Popup';


import '../App.css';

function Result(props) {
  const [isFavourite, setIsFavourite] = useState(props.isFavourite);
  const [recipeId, setRecipeId] = useState(props.id);
  const  userInfo  = useContext(UserContext);
  const [popup, setPopup] = useState({
    show: false, // initial values set to false and null
    id: recipeId,
  });

  function handleFavourite(){

    if (!isFavourite){
      let ingredients = [""]
      if(props.ingredients != null)
      {
        ingredients = props.ingredients.map(element => 
          element.components.map(subElement => subElement.raw_text))
      }
      console.log("these are the ingredients to post", ingredients)
      let recipe ={
        title: props.name,
        ingredients: ingredients.flat(Infinity),
        instructions: props.instructions != null? props.instructions.map(element => element.display_text): [""],
        imageUrl: props.image,
        imageAltText: props.name,
        cookingTime: 0,
        nutrition: "null",
        userId: userInfo.id
      }

      console.log(recipe)
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify(recipe),
      };
      fetch('https://final-project-backend-api.azurewebsites.net/user/favourite', requestOptions)
        .then(res => res.json())  
        .then(data => {setRecipeId(data.recipeId); console.log("this is the new id", data)})
        .catch(err => console.log("this is the error",err))

        setIsFavourite(!isFavourite)
    }else{
      handleDelete()
      // setRecipeId(props.id)
    }
  }

  const requestDelete = {
    method: 'DELETE',
    headers: {  'accept': '*/*' }
  };

  function deleteFromFav(){
    fetch(`https://final-project-backend-api.azurewebsites.net/User/${userInfo.id}/${recipeId}`, requestDelete)
    .then(res => console.log(res))
    .catch(err => console.log(err))
    if (props.deleteFromState !== undefined){
      props.deleteFromState(recipeId)
    }
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
      setIsFavourite(!isFavourite) 
    };
  
    // This will just hide the Confirmation Box when user clicks "No"/"Cancel"  
    const handleDeleteFalse = () => {
      setPopup({
        show: false,
      });
    };

  return (
    <div className='result-recipe'> 
      {isFavourite?
      <Link to = {`/Recipe/Favourites/${recipeId}`}>
        <img src = {props.image} className = "result-image" alt = {props.name} />
      </Link>:
      <Link to = {`/Recipe/${recipeId}`}>
        <img src = {props.image} className = "result-image"  alt = {props.name}/>
      </Link>}
      <div className='image-footer'>
        <p className='result-name'>{props.name}</p>     
        <div className='heart-container'>
          <span className={isFavourite? 'liked' : 'unliked'} onClick = {handleFavourite}><i class="fa-solid fa-heart"></i></span>
        </div>
      </div>  
      {popup.show && (
        <Popup
          handleDeleteTrue={handleDeleteTrue}
          handleDeleteFalse={handleDeleteFalse}
        />
      )}
    </div>
  );
}

export default Result;