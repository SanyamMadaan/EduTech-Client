import React from "react";
import { useState } from "react";

export function PurchasedCourses() {
    const[purchases,setPurchases]=useState([]);
    return (
        <div className="purchased_courses">
            <ul>
                {purchases && purchases.length > 0 ? (
                    purchases.map(course => (
                        <li key={course._id}>{course.coursename}</li>
                    ))
                ) : (
                    <li className="text-red-800 text-2xl text-center mt-2 font-bold">No purchased courses yet</li>
                )}
            </ul>
        </div>
    );
}
