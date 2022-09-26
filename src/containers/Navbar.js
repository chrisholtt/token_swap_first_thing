import React from 'react'
import LoginMetamask from '../components/LoginMetamask'

const Navbar = ({ handleUserSignIn, user }) => {
    return (
        <nav className='navbar'>
            <h1>PoolBuddies</h1>
            <LoginMetamask handleUserSignIn={handleUserSignIn} userAddress={user} />
        </nav>
    )
}

export default Navbar