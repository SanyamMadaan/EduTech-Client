import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[btn,setBtn]=useState("Login");

  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault(); // Prevent form submission

    try {
      setBtn("Logging in...");
      console.log(import.meta.env.VITE_CLIENT_BACKEND_URL);
      const response = await axios.post(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/login`, {
        email,
        password
      });

      console.log(response);

      if (response) {
        const token=response.data.token;
        console.log(token);
        localStorage.setItem("token","Bearer "+token);
        navigate('/Welcome');
      }
      else{
        alert('no user exists');
      }
    } catch (error) {
      setBtn("Login");
      console.log(error);
      if(error.response.data.msg){
        alert(error.response.data.msg)
        return;
      }
      alert("Error while logging in..Please try later");
    }
  }

  return (
    <div className="bg-black h-screen">
          <h1 className="text-center text-white">Login </h1>
            <div className="lg:flex  mt-10 flex justify-center items-center">
            <div className="bg-white rounded-md  w-3/4 md:w-1/2 lg:w-1/3 ">
              <form className="flex flex-col justify-center items-center" onSubmit={loginUser}>
                <input
                  className="border-2 border-black mb-0  p-6 lg:mx-2 mx-1   w-4/5 lg:w-2/3 mt-6"
                  type="email"
                  placeholder="Enter registered email ID"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <br />
                <br />
                <input
                  className="border-2 border-black mb-0  p-6 lg:mx-2 mx-1   w-4/5 lg:w-2/3 "
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <br />

                <button className="bg-green-600 uppercase font-bold border-0 mb-0"  type="submit">
                  {btn}
                </button>
                <br />
              </form>
              <div className="mb-2 flex justify-center">
                <p>New user?</p>
                <p className="path" onClick={() => navigate('/Signup')}>
                  Create Account
                </p>
              </div>
            </div>
          </div>
    </div>
  );
}
