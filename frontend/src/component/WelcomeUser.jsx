import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export function WelcomeUser() {
    const [courses, setCourses] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/allcourses`);
            setCourses(response.data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError(e.message);
            console.log("Error while fetching course from database", e);
        }
    }

    async function PurchaseCourse(courseId,price) {
    
        //get order
        let response=await axios.post(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/purchase/${courseId}`,{price});
        response=response.data; 
        console.log(response);
        
        let key=await axios.get(`${import.meta.env.VITE_CLIENT_BACKEND_URL}/getApiKey`);
        key=key.data;
        console.log(key);

        const options = {
            key:key,
            amount: price,
            currency: "INR",
            order_id: response.order.id,
            // callback_url: `${import.meta.env.VITE_CLIENT_BACKEND_URL}/verifyPayment, //this route will verify the payment
            theme: {
                "color": "#3399cc"
            }
        };

        const rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();

        
    }
    
    return (
        <>
            {loading ?
                (<div className="loading_msg">LOADING...</div>) :
                error ?
                    (<div className="error_msg">{(error === "Network Error") ? <><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCz_7R8H3elkwLcQ_zYP_J55iOLZ3VQL9S8lAqZCNXA&s"/></> : <>{error}</>}</div>) :
                    (
                        <div className="dashboard">
                            <div className="flex justify-between">
                            <h2 className="p-1 text-white text-xl ml-2  font-bold">Welcome to Edutech</h2>
                          
                            <button id="purchased_courses" className="w-fit h-fit p-1 mr-2" onClick={() => navigate('/purchases')}>PURCHASED COURSES</button>
                            </div>
                                
                                
                                
                                                                 
                            <h2 id="courseheading">What would you like to <span id="highlight">learn?</span></h2>
                            <div className="displayCourses">
                                {courses.map((course) => (
                                    <div className="coursedetails" key={course._id}>
                                        <img id="course_img" src={course.image} alt="course"></img>
                                        <h1 id="course_title">{course.coursename}</h1>
                                        <p id="coursedescription">{course.description}</p>
                                        <h3 id="courseprice">₹{course.price}</h3>
                                        <div className="purchasesection">
                                            <button className="purchasebtn" id="PurchaseBtn" onClick={() => PurchaseCourse(course._id,course.price)}>Buy Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
            }
        </>
    );
}
