// import React from 'react'
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const getdata = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/photos?_limit=30",
    );

    setData(response.data);
  };

  return (
    <div>
      <button onClick={getdata}>Get Data</button>
      <div>
        {data.map(function (elem) {
          return <h3>Hello {elem.title}</h3>;
        })}
      </div>
    </div>
  );
};

export default App;
