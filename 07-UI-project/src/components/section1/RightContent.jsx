
import Rightcard from './Rightcard'

const RightContent = (props) => {
  return (
    <div id="right" className='flex overflow-x-auto flex-nowrap gap-10 h-full p-6 w-2/3'>
        {props.users.map(function (elem,idx) {
            return <Rightcard key={idx} id={idx} img={elem.img} tag={elem.tag} intro={elem.intro}/>
        })}
    </div>
  )
}

export default RightContent