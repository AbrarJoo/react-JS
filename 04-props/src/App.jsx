import React from "react";
import Card from "./components/Card";

const App = () => {
  return (
    <div className="parent">
      <Card user="Sarthak" age={18} img="https://images.unsplash.com/photo-1792696802162-8a792aab67a7?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"/>
      
      <Card user="aman" age={16} img="https://plus.unsplash.com/premium_photo-1784774884057-ce701a15d061?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"/>
    </div>
  );
};

export default App;
