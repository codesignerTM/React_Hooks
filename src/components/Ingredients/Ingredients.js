import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setLoading(true);
    fetch("https://react-hooks-35b6b.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        setLoading(false);
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      })
      .catch(err => {
        setError("Something went wrong", err.message);
        console.log(err);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setLoading(true);
    fetch(
      `https://react-hooks-35b6b.firebaseio.com/ingredients/${ingredientId}.jon`,
      {
        method: "DELETE"
      }
    )
      .then(response => {
        setLoading(false);
        setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
      })
      .catch(error => {
        setError("Something went wrong", error.message);
        setLoading(false);
        console.log(error);
      });
  };

  const filteredIngredientsHandler = useCallback(
    filteredIngredients => {
      setUserIngredients(filteredIngredients);
    },
    [setUserIngredients]
  );

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddImgredient={addIngredientHandler}
        loading={loading}
      />
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
