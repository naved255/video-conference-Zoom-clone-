import { NavLink } from 'react-router-dom'

const Navbar = ({title, links=[]}) => {
  return (
<nav className='flex absolute z-20 w-full top-0 justify-between px-4 py-2'>
    <p className='text-2xl text-white font-bold'>{title}</p>
    <ul className='flex gap-2 text-white opacity-75'>
        {
            links.map(link => (
                <li><NavLink to={link.path}>{link.title}</NavLink></li>
            ))
        }
    </ul>
</nav>
  )
}

export default Navbar