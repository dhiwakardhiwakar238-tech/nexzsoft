// import "./CustomerDetails.css";

// import {
//     RiPhoneFill,
//     RiMailFill,
//     RiVipCrownFill,
//     RiRobot2Fill,
//     RiStickyNoteFill
// } from "react-icons/ri";

// function CustomerDetails({ selectedCustomer }) {

//     if (!selectedCustomer) {

//         return (

//             <div className="customer-details empty">

//                 <h3>Select a Customer</h3>

//                 <p>Customer details will appear here.</p>

//             </div>

//         );

//     }

//     return (

//         <div className="customer-details">

//             <div className="profile-section">

//                 <div className="profile-avatar">

//                     {selectedCustomer[0].toUpperCase()}

//                 </div>

//                 <h2>{selectedCustomer}</h2>

//                 <span className="premium-badge">

//                     <RiVipCrownFill />

//                     Premium Customer

//                 </span>

//             </div>

//             <div className="detail-card">

//                 <h4>Contact Information</h4>

//                 <div className="detail-row">

//                     <RiPhoneFill />

//                     <span>{selectedCustomer}</span>

//                 </div>

//                 <div className="detail-row">

//                     <RiMailFill />

//                     <span>customer@nexzsoft.com</span>

//                 </div>

//             </div>

//             <div className="detail-card">

//                 <h4>

//                     <RiRobot2Fill />

//                     AI Summary

//                 </h4>

//                 <p>

//                     This customer frequently asks about
//                     pricing, subscription plans and demo booking.

//                 </p>

//             </div>

//             <div className="detail-card">

//                 <h4>Tags</h4>

//                 <div className="tag-list">

//                     <span>Premium</span>

//                     <span>Lead</span>

//                     <span>WhatsApp</span>

//                 </div>

//             </div>

//             <div className="detail-card">

//                 <h4>

//                     <RiStickyNoteFill />

//                     Internal Notes

//                 </h4>

//                 <textarea
//                     placeholder="Write internal notes..."
//                 ></textarea>

//             </div>

//         </div>

//     );

// }

// export default CustomerDetails;