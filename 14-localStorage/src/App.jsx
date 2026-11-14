// import React from "react";

const App = () => {
  // localStorage.clear();
  localStorage.setItem("user", "abrar");
  const user = localStorage.getItem("user");

  const person = {
    age: 19,
    location: "kashmir",
    job: "developer",
  };
  localStorage.setItem("person", JSON.stringify(person));
  const persona = JSON.parse(localStorage.getItem("person"));

  console.log(user);
  console.log(persona);

  return <div></div>;
};

export default App;
