import React, { useEffect, useState } from "react";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export function WelcomeUser() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/course/allcourses`);
            setCourses(response.data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError(e.message);
            console.log("Error while fetching course from database", e);
        }
    }

    async function PurchaseCourse(courseId) {
        let token = localStorage.getItem('token').split(' ')[1];
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        console.log("User ID: ", userId);
    
        alert('Redirecting you to the Payment Page');
        
        try {
            // Step 1: Create order in the backend
            let response = await axios.post(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/User/purchase/${courseId}`, {
                userId: userId
            });
            response = response.data;
            console.log("Order Response: ", response);
    
            // Step 2: Get Razorpay API key from backend
            let keyResponse = await axios.get(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/User/getApiKey`);
            let key = keyResponse.data;
            console.log("Razorpay API Key: ", key);
    
            // Step 3: Prepare Razorpay options
            const options = {
                key: key,
                amount: response.order.amount, // in paise (100 paise = 1 INR)
                currency: response.order.currency,
                order_id: response.order.id, // Razorpay order ID
                callback_url: `${import.meta.env.VITE_ADMIN_BACKEND_URL}/verifypayment`, // Verification route
                prefill: {
                    name: "Your Name", // Prefill user data (optional)
                    email: "email@example.com", // Prefill user email
                },
                theme: {
                    color: "#3399cc",
                },
                handler: function (response) {
                    console.log("Payment handler response: ", response);
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
    
                    // Step 4: Call the backend to verify the payment
                    axios.post(`${import.meta.env.VITE_ADMIN_BACKEND_URL}/User/verifypayment`, {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        courseId, // Send courseId from the purchase step
                        userId    // Send userId for adding course
                    }).then((verifyResponse) => {
                        if (verifyResponse.data.success) {
                            alert("Payment successful and course added!");
                        } else {
                            alert("Payment verification failed");
                        }
                    }).catch((error) => {
                        console.error("Error in payment verification: ", error);
                        alert("Error verifying payment. Please try again.");
                    });
                },
            };
    
            // Step 5: Open Razorpay Checkout widget
            const rzp1 = new Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.log('Payment initiation failed: ', error);
            alert('Payment initiation failed. Please try again later.');
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
                        </div>
                    )
            }
        </>
    );
}
