const App = () => {
  // function btnclick() {
  //   console.log("button is clicked!");
  // }

  // function mouseEnter(){
  //   console.log("mouse has entered");
  // }

  return (
    <div>
      <div
        onMouseMove={(elem) => {
          console.log(elem.clientX, elem.clientY);
        }}
        className="box"
      ></div>
    </div>
  );
};

export default App;
