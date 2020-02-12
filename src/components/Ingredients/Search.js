import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  //object restucturing
  const { onLoadIngredients } = props;
  //array destructuring
  const [enterFilter, setEnteredFilter] = useState("");

  useEffect(() => {
    const queryParams =
      enterFilter.length === 0
        ? ""
        : `?orderBy="title"&equalTo="${enterFilter}"`;
    fetch(
      "https://react-hooks-35b6b.firebaseio.com/ingredients.json" + queryParams
    )
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
        //onLoadIngredients(loadedIngredients);
      });
  }, [enterFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enterFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
