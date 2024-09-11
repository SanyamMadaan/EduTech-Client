import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PurchasedCourses() {
    const[purchases,setPurchases]=useState([]);
    const navigate=useNavigate();
    
    useEffect(()=>{
        async function PurchasedCourse(){
            const courses=await axios.get(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/User/purchases`,{
                headers:{
                    authorization:localStorage.getItem('token')
                }
            })
            setPurchases(courses.data);
            console.log(courses.data);
        }
        PurchasedCourse();
    },[]);

    return (
        <div className="purchased_courses">
            <ul>
                {purchases && purchases.length > 0 ? (
                    purchases.map(course => (
                        //////////////
                        <div key={course._id} className="bg-white h-fit m-2 mb-4 rounded-lg radius p-4 border-2 border-black ">
                        <div className="mb-5" >
                            <img className="h-48 w-full" src={course.image} alt={course.coursename} />
                        <hr/>
                        <h1 className="text-3xl m-2 overflow-visible break-words">{course.coursename}</h1>
                        <p className="overflow-visible m-2 break-words">{course.description}</p>
                        </div>
                        <div className="flex mt-4 justify-center items-center">
                            <div className="w-1/2">
                                <button className="border-2 border-black ml-1 p-2  text-white bg-blue-950 rounded-md" onClick={() => navigate(`/course/${course._id}`)}>View Content</button>
                            </div>
                            
                        </div>
                    </div>
                        
                        /////////////
                    ))
                ) : (
                    <li className="text-red-800 text-2xl text-center mt-2 font-bold">No purchased courses yet</li>
                )}
            </ul>
        </div>
    );
}
