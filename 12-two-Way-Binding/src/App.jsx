import React, { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");

  const submitHandler = (elem) => {
    elem.preventDefault();
    console.log("form submitted by ", title);

    setTitle("");
  };

  return (
    <div>
      <form
        onSubmit={(elem) => {
          submitHandler(elem);
        }}
      >
        <input
          type="text"
          placeholder="enter your name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default App;
