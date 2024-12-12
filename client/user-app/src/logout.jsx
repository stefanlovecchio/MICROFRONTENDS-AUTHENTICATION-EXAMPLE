import { useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout {
            message
        }
    }
`;

function Logout() {
     const [logout] = useMutation(LOGOUT_MUTATION, {
        onCompleted: () => {
            // Dispatch custom event upon successful logout
            window.dispatchEvent(new CustomEvent('logoutSuccess', { detail: { isLoggedIn: false } }));
        },
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
export default Logout