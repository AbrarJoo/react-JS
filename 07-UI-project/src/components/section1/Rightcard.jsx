import Rightcardcontent from "./Rightcardcontent";


const Rightcard = (props) => {
  return (
    <div className="shrink-0 h-full w-80 rounded-4xl overflow-hidden relative">
      <img className="h-full w-full object-cover"
        src={props.img}
        alt=""
      />

      <Rightcardcontent id={props.id} tag={props.tag} intro={props.intro}/>
    </div>
  );
};

export default Rightcard;
