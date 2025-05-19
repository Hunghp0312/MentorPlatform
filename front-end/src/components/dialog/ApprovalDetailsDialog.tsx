// import { ApprovalType } from "./ListApproval"; // Giả định ApprovalType được định nghĩa trong ListApproval hoặc một file types riêng

// interface ApprovalDetailsDialogProps {
//   approvalData: ApprovalType;
//   onClose: () => void;
//   onApprove: () => void;
//   onReject: () => void;
// }

// const ApprovalDetailsDialog = ({
//   approvalData,
//   onClose,
//   onApprove,
//   onReject,
// }: ApprovalDetailsDialogProps) => {
//   return (
//     <div className="p-6 bg-gray-800 text-gray-200">
//       <div className="flex items-center space-x-4 mb-6">
//         <img
//           src={approvalData.profileImage}
//           alt={approvalData.name}
//           className="w-16 h-16 rounded-full object-cover"
//         />
//         <div>
//           <h4 className="text-lg font-medium">{approvalData.name}</h4>
//           <p className="text-gray-400">{approvalData.email}</p>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {/* Expertise Areas */}
//         <div>
//           <h5 className="text-sm font-medium text-gray-400 mb-1">Expertise Areas</h5>
//           <div className="flex flex-wrap gap-2">
//             {approvalData.expertise.map((skill, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Professional Experience */}
//         <div>
//           <h5 className="text-sm font-medium text-gray-400 mb-1">Professional Experience</h5>
//           <p className="text-sm">{approvalData.experience}</p>
//         </div>

//         {/* Application Timeline */}
//         <div>
//           <h5 className="text-sm font-medium text-gray-400 mb-1">Application Timeline</h5>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs mr-2">
//                 1
//               </span>
//               <span className="text-sm">Submitted on {approvalData.submittedDate}</span>
//             </div>
//           </div>
//         </div>

//         {/* Uploaded Documents */}
//         <div>
//           <h5 className="text-sm font-medium text-gray-400 mb-1">Uploaded Documents</h5>
//           <div className="space-y-2">
//             {approvalData.documents.map((doc, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between bg-gray-600 p-2 rounded"
//               >
//                 <div className="flex items-center">
//                   <span
//                     className={`mr-2 ${
//                       doc.type === "PDF" ? "text-red-400" : "text-blue-400"
//                     }`}
//                   >
//                     {doc.type}
//                   </span>
//                   <span className="text-sm">{doc.name}</span>
//                 </div>
//                 <a
//                   href={doc.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-400 text-sm hover:underline"
//                 >
//                   View
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Admin Notes */}
//         <div>
//           <h5 className="text-sm font-medium text-gray-400 mb-1">Admin Notes</h5>
//           <textarea
//             className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm text-gray-200"
//             rows={3}
//             placeholder="Add notes about this application..."
//           />
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-2 mt-6">
//         <button
//           onClick={onApprove}
//           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
//         >
//           Approve
//         </button>
//         <button
//           onClick={onReject}
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//         >
//           Reject
//         </button>
//         <button
//           onClick={onClose}
//           className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ApprovalDetailsDialog;
