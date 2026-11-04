
import LeftContent from './LeftContent'
import RightContent from './RightContent'

const Page1content = (props) => {
  return (
    <div className='flex gap-10 items-center py-10 px-18 h-[90vh]'>
        <LeftContent />
        <RightContent users={props.users}/>
    </div>
  )
}

export default Page1content