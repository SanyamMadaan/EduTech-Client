import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';

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

    async function PurchaseCourse(courseId) {
        alert('Redirecting you to payment page');
        const stripe=await loadStripe('pk_test_51PdRbPHu5f6jTXuNEhdNnYWdPHOA30nHPfJfHx2ViFxE9t1kNPVUNx9glblushKtdZ9BJvbdHXgSKBFlHRZ82Yl300Af88XG6Q');   
        const token = localStorage.getItem('token');
    
        const courseResponse = await axios.get(`https://edu-tech-admin-xh5s.vercel.app/course/${courseId}`);
        const course = courseResponse.data;
        console.log(course);
    
        if (!course) {
            console.log("Course not found");
            return;
        }
    
        const response = await axios.post(`https://edu-tech-admin-xh5s.vercel.app/purchase/${courseId}`, {
            coursename: course.coursename,
            price: course.price
        }, {
            headers: {
                token
            }
        });
    
        const session = response.data; // Access the data directly from response
        console.log("session "+session);

        const result = stripe.redirectToCheckout({
            sessionId: session.sessionId
        });
    
        if (result.error) {
            console.log(result.error);
        }
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
                                            <button className="purchasebtn" id="PurchaseBtn" onClick={() => PurchaseCourse(course._id)}>Buy Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Render PurchasedCourses component with purchasedCourses state
                            <PurchasedCourses purchasedCourses={purchasedCourses} /> */}
                        </div>
                    )
            }
        </>
    );
}
