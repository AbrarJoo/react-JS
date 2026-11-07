import React, { useState } from "react";

const App = () => {
  const [num, setNum] = useState(0);

  function increaseNum() {
    setNum(num + 1);
  }

  function decreaseNum() {
    setNum(num - 1);
  }

  function Jump() {
    setNum(num + 5);
  }

  return (
    <div className=" bg-red-400 min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="bg-amber-200 w-[526px] max-w-[90vw] h-[550px] flex items-center justify-center text-4xl font-bold rounded-2xl">
        {num}
      </h1>

      <div className="flex flex-row flex-wrap justify-center gap-1">
        <button
          onClick={increaseNum}
          className="px-10 py-4 bg-gray-300 rounded-full"
        >
          Increase
        </button>

        <button
          onClick={decreaseNum}
          className="px-10 py-4 bg-gray-300 rounded-full"
        >
          Decrese
        </button>

        <button onClick={Jump} className="px-10 py-4 bg-gray-300 rounded-full">
          Jump by 5
        </button>
      </div>
    </div>
  );
};

export default App;
