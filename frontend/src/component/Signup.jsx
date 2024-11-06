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
      setBtn("Sign Up");
    }else if(contact.length<10){
      alert('Mobile number length should be atleast 10');
      setBtn("Sign Up");
    }
    else if(contact.length>10){
      alert('Mobile number length should not be greater than 10');
      setBtn("Sign Up");
    } 
    else {
      async function CreateUser() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/User/signup`, {
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
          }
        } 
        catch (error) {
          console.log(error);
          console.log(error.response);
          setBtn("Sign Up");
          if(error.response.data.msg){
            alert(error.response.data.msg);
          }
          else{
            alert("Error while Creating account.Please try later");
          }
        }
      }
      CreateUser();
    }
  }

  return (
    <div className="bg-black h-screen flex justify-center items-center">
            <div className=" w-full mx-6  sm:mx-8  h-fit pt-2 lg:pt-0 lg:w-5/12  bg-slate-900 rounded-lg">
              <h1 className="font-semibold text-white ">Sign UP</h1>
              <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                <input
                  className="border-2 border-black sm:py-6 sm:px-7 sm:w-2/3 p-6 w-3/4 lg:p-7 lg:w-2/3  rounded-md mt-4"
                  type="email"
                  placeholder="Please Enter your Email address"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black sm:py-6 sm:px-7 sm:w-2/3 p-6 w-3/4 lg:p-7 lg:w-2/3  rounded-md mt-4"
                  type="number"
                  placeholder="Please Enter Mobile number"
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                  required
                />
                <input
                  className="border-2 border-black sm:py-6 sm:px-7 sm:w-2/3 p-6 w-3/4 rounded-md mt-4 lg:p-7 lg:w-2/3"
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                  <input
                  className="border-2 border-black sm:py-6 sm:px-7 sm:w-2/3 p-6 w-3/4 rounded-md mt-4 lg:p-7 lg:w-2/3"
                  type="Re-enter the password"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setCpass(e.target.value);
                  }}
                  required
                />
                <button className="bg-green-600 uppercase font-bold border-0 p-3 mt-4 lg:font-bold"  type="submit">
                  {btn}
                </button>
              </form>
              <div className="flex justify-center mb-2 lg:mb-0">
                <p className="text-white p-2 lg:p-1 text-xl">Existing User?</p>
                <p className="text-xl p-2 lg:p-1 text-red-600 cursor-pointer" onClick={() => navigate('/')}>
                  Sign In
                </p>
              </div>
            
          </div>
    </div>
  );
}