import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Data() {
  const [users, setUsers] = useState({}); // State to hold the fetched data

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://learner-dc009-default-rtdb.asia-southeast1.firebasedatabase.app/users.json'
      );
      const data = await response.json();
      if (data) {
        setUsers(data); // Set fetched data to state
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data only once after the component mounts
  }, []);

  // Function to delete a user from Firebase
  const handleDelete = async (key) => {
    try {
      await fetch(
        `https://learner-dc009-default-rtdb.asia-southeast1.firebasedatabase.app/users/${key}.json`,
        {
          method: 'DELETE',
        }
      );

      // Optimistically update the state by removing the deleted user locally
      const updatedUsers = { ...users };
      delete updatedUsers[key];
      setUsers(updatedUsers);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <Link to="/" className="text-blue-500 text-xl">Return</Link>
      <div>
        {Object.entries(users).map(([key, user]) => (
          <div key={key} className="grid grid-cols-3 mx-40 gap-3 items-center justify-evenly mt-3 border">
            <span>{user.Name}</span>  
            <span>{user.Age}</span>
            <button onClick={() => handleDelete(key)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
