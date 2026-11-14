// import React from 'react'
import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [num, setnum] = useState(0);
  const [num2, setnum2] = useState(100)

  useEffect(function () {
    console.log("use effetc is running");
  }, [num]);

  return (
    <div>
      <h1>value of num is {num}</h1>
      <h1>value of num2 is {num2}</h1>
      <button
        onMouseEnter={() => {
          setnum(num+1);
        }}

        onMouseLeave={()=>{
          setnum2(num2+10)
        }}
      >
        Hover
      </button>
    </div>
  );
};

export default App;
