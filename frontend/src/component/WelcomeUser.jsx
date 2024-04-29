import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

export function WelcomeUser() {
  const[courses,setCourses]=useState([]);
  const[loading,setLoading]=useState(true);
  const[isError,setIsError]=useState(false);
  const[error,setError]=useState("");

  const navigate=useNavigate();
  
  const fetchcourse =async ()=>{
    try{
      const response=await axios.get('http://localhost:3002/allcourses');
      console.log(response.data);
      setCourses(response.data);
      setLoading(false);
    }catch(e){
      setLoading(false);
      setIsError(true);
      setError(e);
      console.log("error while fetching course from database",e);
    }    
  }

  useEffect(()=>{
    fetchcourse();
  },[])

  async function PurchaseCourse(courseId){
    // alert(courseId);
    alert('Course purchased successfully');
    const token=localStorage.getItem('token');
    console.log(token);
    const response=await axios.post(`http://localhost:3000/purchase/:${courseId}`,{
      headers:{
        token
      }
    })

    if(response.status===200){
      alert('Course purchased successfully');
      // navigate('/purchases')
    }
    else{
      alert('error while purchasing course');
    }
    
  }

  return (
    <>
    {loading?
    (<div className="loading_msg">LOADING...</div>)
    :isError?
    (<div className="error_msg">{(error.message==="Network Error")?<><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhCz_7R8H3elkwLcQ_zYP_J55iOLZ3VQL9S8lAqZCNXA&s"/></>:<>{error.message}</>}</div>)
    :(
    <div className="dashboard">
    <div className="purchase_navbar">
      <h1>Welcome to Edutech</h1>
      <button id="purchased_courses" onClick={()=>navigate('/purchases')}>PURCHASED COURSES</button>
    </div>
    <h2 id="courseheading">What would you like to <span id="highlight">learn?</span></h2>
    <div className="displayCourses">
  {courses.map((course) => (
   <div className="coursedetails" key={course._id}>
   <img id="course_img" src={course.image}></img>
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
    )}
    </>
  );
}
