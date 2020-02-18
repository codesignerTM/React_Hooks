import React, { useState, useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentState, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentState, action.ingredient];
    case "DELETE":
      return currentState.filter(ing => ing.id !== action.id);
    default:
      throw new Error("Error");
  }
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Error");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  //const [userIngredients, setUserIngredients] = useState([]);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);

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
    dispatchHttp({ type: "SEND" });
    //setLoading(true);
    fetch("https://react-hooks-35b6b.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        //setLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then(responseData => {
        /* setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]); */
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient }
        });
      })
      .catch(err => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong" });
        //setError("Something went wrong", err.message);
        console.log(err);
      });
  };

  const removeIngredientHandler = ingredientId => {
    //setLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-35b6b.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE"
      }
    )
      .then(response => {
        dispatchHttp({ type: "RESPONSE" });
        //setLoading(false);
        /*  setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        ); */
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong" });
        //setError("Something went wrong", error.message);
        //setLoading(false);
        console.log(error);
      });
  };

  const filteredIngredientsHandler = useCallback(
    filteredIngredients => {
      //setUserIngredients(filteredIngredients);
      dispatch({ type: "SET", ingredients: filteredIngredients });
    },
    [dispatch]
  );

  const clearError = () => {
    //setError(null);
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddImgredient={addIngredientHandler}
        loading={httpState.loading}
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
