import axios from 'axios';
import './UsersTable.css';

function UsersTable({ users, onSuccessfulUserDeletion }) {
  const deleteUser = (userId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then(() => onSuccessfulUserDeletion());
  };

  return (
    <div>
      <table className="users-table">
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
