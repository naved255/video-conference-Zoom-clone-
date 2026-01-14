import { NavLink } from 'react-router-dom'

const Navbar = ({title="Video Conference", links=[], color='white'}) => {
  return (
<nav className={`flex absolute ${color==='white'?'bg-transparent':'bg-white'} z-20 w-full top-0 justify-between px-4 py-2`}>
    <NavLink style={{textDecoration:"none"}} to={"/"}><p className={`text-2xl ${color === 'black'?'text-black':'text-white'} font-bold`}>{title}</p></NavLink>
    <ul className={`flex gap-2 ${color === 'black'?'text-black':'text-white'} opacity-75 items-center justify-center`}>
        {
            links.map((link, index) => (
                <li key={index} ><NavLink className='flex gap-1 items-center justify-center' key={index} to={link.path}>{link.svg}{link.title}</NavLink></li>
            ))
        }
    </ul>
</nav>
  )
}

export default Navbar