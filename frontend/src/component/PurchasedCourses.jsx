import { useState } from "react"
export function PurchasedCourses(){
    const[purchases,setPurchases]=useState([]);
    return(
        <>
        {(purchases.length<1)?(
            <div>
                <h1>No Course Purchased Yet</h1>
            </div>
        ):(
         <h1>Your Purchased Courses</h1>
        )}
        
        </>
    )
}