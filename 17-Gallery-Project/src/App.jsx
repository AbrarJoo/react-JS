import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [userData, setuserData] = useState([]);

  const getData = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/photos?_limit=30",
    );
    setuserData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-black min-h-screen p-4 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {userData.map((item) => (
          <div
            className="mb-5 h-40 w-44 bg-black overflow-hidden"
            key={item.id}
          >
            <img
              className="h-32 object-cover rounded-2xl"
              src={`https://i.pravatar.cc/300?img=${item.id}`}
              alt={item.title}
              width="300"
              height="200"
            />
            <h3 className="text-sm mt-2">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
