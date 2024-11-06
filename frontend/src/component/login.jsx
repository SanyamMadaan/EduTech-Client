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
      const response = await axios.post(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/User/login`, {
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
    <div className="bg-black h-screen flex justify-center items-center">
            <div className=" w-full mx-4 sm:mx-8 h-fit pt-2 lg:w-5/12  bg-slate-900 rounded-lg">
              <h1 className="font-semibold text-white ">Login</h1>
              <form className="flex flex-col justify-center items-center mt-2 lg:mt-0" onSubmit={loginUser}>
                <input
                  className="border-2 border-black sm:p-6 sm:w-1/2 p-7 w-2/3 lg:p-7 lg:w-3/4  rounded-md mt-4"
                  type="email"
                  placeholder="Enter registered email ID"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black sm:p-6 sm:w-1/2 p-7 w-2/3 rounded-md mt-8 lg:w-3/4 lg:p-7"
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <button className="bg-green-600 uppercase font-bold border-0 p-4 mt-6 lg:font-bold"  type="submit">
                  {btn}
                </button>
              </form>
              <div className="mt-4 flex justify-center mb-2">
                <p className="text-white p-2 text-xl">New user?</p>
                <p className="text-xl p-2 text-red-600 cursor-pointer" onClick={() => navigate('/Signup')}>
                  Create Account
                </p>
              </div>
            
          </div>
    </div>
  );
}
