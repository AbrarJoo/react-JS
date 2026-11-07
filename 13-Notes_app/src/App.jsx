
import React, { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [task, setTask] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) return;

    const copyTask = [...task];
    copyTask.push({ title, details });

    setTask(copyTask);

    setTitle("");
    setDetails("");
  };

  const delNote = (idx) => {
    const copyTask = task.filter((_, index) => index !== idx);
    setTask(copyTask);
  };

  return (
    <div className="min-h-screen lg:flex bg-black text-white p-10">
      <form
        onSubmit={submitHandler}
        className="flex p-10 gap-4 flex-col items-start"
      >
        <h1 className="text-3xl font-bold">Add Notes</h1>

        <input
          className="px-5 w-full py-2 border-2 outline-none rounded font-medium"
          type="text"
          placeholder="Enter Notes Heading"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="px-5 w-full h-32 font-medium py-2 border-2 outline-none rounded"
          placeholder="Write details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <button className="active:scale-75 w-full bg-white outline-none text-black px-5 py-2 rounded font-medium">
          Add Notes
        </button>
      </form>

      <div className="lg:w-1/2 lg:border-l-2 p-10">
        <h1 className="text-xl font-bold mb-5">Recent Notes</h1>

        <div className="flex gap-5 flex-wrap items-start justify-start mt-5 overflow-auto">
          {task.map((elem, idx) => {
            return (
              <div
                key={idx}
                className="flex justify-between flex-col items-start relative min-h-52 px-4 pt-9 pb-5 w-40 rounded-2xl text-black bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsshP2j8B2BrzFxPWuzhhO-LsKvYR80aT7q_-1XOm4w&s=10')] bg-cover bg-center overflow-hidden"
              >
                <div className="w-full rounded-lg bg-white/75 p-2">
                  <h3 className="leading-tight text-xl font-bold text-black wrap-break-word">
                    {elem.title}
                  </h3>

                  <p className="mt-1.5 leading-tight font-medium text-gray-900 wrap-break-word">
                    {elem.details}
                  </p>
                </div>

                <button
                  onClick={() => delNote(idx)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
