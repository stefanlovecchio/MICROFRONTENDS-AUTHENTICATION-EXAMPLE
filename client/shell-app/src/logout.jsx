 import { useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout 
    }
`;

function Logout() {
    console.log("Logout component rendered");

    const [logout] = useMutation(LOGOUT_MUTATION, {
        onCompleted: () => {
            // Dispatch custom event upon successful logout
            window.dispatchEvent(new CustomEvent('logoutSuccess', { detail: { isLoggedIn: false } }));
        },
        onError: (error) => console.error('Error logging out:', error.message),
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div className="logout">
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
export default Logout