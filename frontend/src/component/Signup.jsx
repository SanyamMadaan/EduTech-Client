import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const[btn,setBtn]=useState("Sign Up");

  const handleSubmit = (event) => {
    setBtn("Creating your account...");
    event.preventDefault();
        if (cpass !== password) {
      alert("Password and Confirm Password doesn't match");
    } else {
      async function CreateUser() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/signup`, {
            email: username,
            contact,
            password
          });
            if (response.status === 200) {
              const token=response.data.token;
              console.log("token received in frontend is ");
              console.log(token);
              localStorage.setItem("token","Bearer "+token);
            alert('Congratulations, Your account created Successfully');
            navigate('/Welcome');
          } else {
            alert('Error while creating user');
          }
        } catch (error) {
          setBtn("Sign Up");
          alert("Error while Creating account.Please try later");
        }
      }
      CreateUser();
    }
  }

  return (
    <div className="bg-black h-screen">
          <h1 className="text-center text-white font-serif">Sign Up </h1>
            <div className="lg:flex  mt-10 flex justify-center items-center">
            <div className="bg-white rounded-md  w-3/4 md:w-1/2 lg:w-1/3 ">
              <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                <input
                  className="border-2 border-black  rounded-md p-6 m-2 w-2/3 mt-6"
                  type="email"
                  placeholder="Enter email address"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // setEmail(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black  rounded-md p-6 mx-2  mt-3 w-2/3 "
                  type="text"
                  placeholder="Enter Conatct number"
                  onChange={(e) => {
                    setContact(e.target.value);
                    // setPassword(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black  rounded-md p-6 mx-2 mt-3  w-2/3 "
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // setPassword(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black  rounded-md p-6 mx-2 mt-3  w-2/3 "
                  type="password"
                  placeholder="Re-enter Password"
                  onChange={(e) => {
                    setCpass(e.target.value)
                    // setPassword(e.target.value);
                  }}
                  required
                />


                <button  type="submit">
                  {btn}
                </button>
                <br />
              </form>
              <div className="mb-1 flex justify-center">
                <p>Already a user?</p>
                <p className="path" onClick={() => navigate('/')}>
                  LOGIN
                </p>
              </div>
            </div>
          </div>
    </div>
  );
}