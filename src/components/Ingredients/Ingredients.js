import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  /*   useEffect(() => {
    fetch("https://react-hooks-35b6b.firebaseio.com/ingredients.json")
      .then(response => response.json())
      .then(resonseData => {
        const loadedIngredients = [];
        for (let key in resonseData) {
          loadedIngredients.push({
            id: key,
            title: resonseData[key].title,
            amount: resonseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []); */

  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-35b6b.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeIngredientHandler = ingredientId => {
    fetch(
      `https://react-hooks-35b6b.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    ).then(response => {
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    });
  };

  const filteredIngredientsHandler = useCallback(
    filteredIngredients => {
      setUserIngredients(filteredIngredients);
    },
    [setUserIngredients]
  );

  return (
    <div className="App">
      <IngredientForm onAddImgredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
