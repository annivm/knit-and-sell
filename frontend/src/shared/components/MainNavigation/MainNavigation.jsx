import { Link } from 'react-router-dom';
import { useState } from 'react'
import './MainNavigation.css'
import Backdrop from '../Backdrop/Backdrop';
import SideDrawer from '../Navigation/SideDrawer';
import NavLinks from '../Navigation/NavLinks';
import MainHeader from '../Navigation/MainHeader';


const MainNavigation = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    }
    const closeDrawerHandler = () => {
        setDrawerIsOpen(false)
    }

    return (
        <>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className='main-navigation__title'>
                    <Link to="/">🧶Knit&Sell</Link>
                </h1>
                <nav className='main-navigation__header-nav'>
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    )
}

export default MainNavigation;