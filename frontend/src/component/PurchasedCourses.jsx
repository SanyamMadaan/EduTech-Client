import React from "react";

export function PurchasedCourses({ purchasedCourses }) {
    return (
        <div className="purchased_courses">
            <ul>
                {purchasedCourses && purchasedCourses.length > 0 ? (
                    purchasedCourses.map(course => (
                        <li key={course._id}>{course.coursename}</li>
                    ))
                ) : (
                    <li className="text-red-800 text-2xl text-center mt-2 font-bold">No purchased courses yet</li>
                )}
            </ul>
        </div>
    );
}
