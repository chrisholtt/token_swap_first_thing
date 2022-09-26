import { useMoralis } from "react-moralis";
import { useEffect } from 'react';

function LoginMetamask({ handleUserSignIn, userAddress }) {
    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    useEffect(() => {
        if (isAuthenticated) {
            // add your logic here
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);



    const login = async () => {
        if (!isAuthenticated) {

            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    handleUserSignIn(user.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const logOut = async () => {
        await logout();
        handleUserSignIn("");
        console.log("logged out");
    }

    const userAddressString = `${userAddress[0]}${userAddress[1]}${userAddress[2]}${userAddress[3]}...${userAddress[userAddress.length - 4]}${userAddress[userAddress.length - 3]}${userAddress[userAddress.length - 2]}${userAddress[userAddress.length - 1]}`

    return (
        <div>
            {user ? <button onClick={logOut} disabled={isAuthenticating}>{userAddressString}</button> : <button className="login-btn" onClick={login}>Metamask Login</button>}
        </div>
    );
}

export default LoginMetamask;
