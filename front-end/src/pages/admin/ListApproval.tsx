import React, { useEffect, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
// import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import useDebounce from "../../hooks/usedebounce";
import { ApprovalType } from "../../types/approval";
// Components

const mockApprovals: ApprovalType[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    expertiseAreas: ["Data Science", "Machine Learning", "Python"],
    status: "pending",
    submittedDate: "2023-09-10",
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    experience: "5 years at Tech Corp, 3 years teaching",
    documents: [
      { type: "PDF", name: "Resume.pdf", url: "#" },
      { type: "JPG", name: "Certification.jpg", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    expertiseAreas: ["UX Design", "UI Prototyping", "User Research"],
    status: "pending",
    submittedDate: "2023-09-12",
    profileImage: "https://randomuser.me/api/portraits/men/42.jpg",
    experience: "4 years at Design Studio",
    documents: [{ type: "PDF", name: "Portfolio.pdf", url: "#" }],
  },
  {
    id: "3",
    name: "Alex Rodriguez",
    email: "alex.r@example.com",
    expertiseAreas: ["Leadership", "Business Strategy", "Marketing"],
    status: "pending",
    submittedDate: "2023-09-14",
    profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
    experience: "10 years in corporate leadership",
    documents: [{ type: "PDF", name: "CV.pdf", url: "#" }],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    expertiseAreas: ["Web Development", "React", "Node.js"],
    status: "approved",
    submittedDate: "2023-09-08",
    profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    experience: "6 years as full-stack developer",
    documents: [{ type: "PDF", name: "Resume.pdf", url: "#" }],
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james.w@example.com",
    expertiseAreas: ["Cybersecurity", "Network Security"],
    status: "rejected",
    submittedDate: "2023-09-07",
    profileImage: "https://randomuser.me/api/portraits/men/23.jpg",
    experience: "3 years in IT security",
    documents: [{ type: "PDF", name: "Certifications.pdf", url: "#" }],
  },
  {
    id: "6",
    name: "James Oswel",
    email: "james.w@examples.com",
    expertiseAreas: ["Cybersecurity", "Network Security"],
    status: "rejected",
    submittedDate: "2023-09-07",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    experience: "3 years in IT security",
    documents: [{ type: "PDF", name: "Certifications.pdf", url: "#" }],
  },
];
const ListApproval = () => {
  const [approvals, setApprovals] = useState<ApprovalType[]>(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [errors, setErrors] = useState<string | undefined>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const searchDebounced = useDebounce(searchTerm, 500);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];
  // Mock data fetching
  useEffect(() => {
    setLoading(true);
    const filtered = mockApprovals.filter((approval) => {
      const matchesSearch = approval.name
        .toLowerCase()
        .includes(searchDebounced.toLowerCase());
      const matchesStatus = statusFilter
        ? approval.status === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    });
    const start = (pageIndex - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    setApprovals(paginated);
    setTotalItems(filtered.length);
    setLoading(false);
  }, [searchDebounced, statusFilter, pageIndex, pageSize]);

  // Define columns for CustomTable
  const columns: DataColumn<ApprovalType>[] = [
    {
      header: "",
      accessor: (row) => (
        <div className="flex items-center space-x-4">
          <img
            src={row.profileImage}
            alt={row.name}
            className="w-13 h-13 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-white">{row.name}</p>
            <p className="text-sm text-gray-400 truncate pt-0.5">
              {row.expertiseAreas.join(", ")}
            </p>
            <div className="flex items-center mt-1">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  row.status === "pending"
                    ? "bg-yellow-500"
                    : row.status === "approved"
                    ? "bg-green-500"
                    : row.status === "rejected"
                    ? "bg-red-500"
                    : ""
                }`}
              ></span>
              <span className="text-xs text-gray-400 capitalize">
                {row.status}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-xs text-gray-400">
                Submitted: {row.submittedDate}
              </span>
            </div>
          </div>
        </div>
      ),
      align: "left",
    },
  ];

  // Handle search input
  const handleChangeSearch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if ("value" in e.target && e.target instanceof HTMLInputElement) {
      if (e.target.value.length > 1000) {
        setErrors("Search term must not exceed 1000 characters.");
        return;
      }
      setErrors(undefined);
      setSearchTerm(e.target.value);
      setPageIndex(1);
    }
  };

  // Handle row selection
  const handleSelectRow = (row: ApprovalType) => {
    setSelectedApproval(row);
  };

  // Mock action handlers
  const handleApprove = (approval: ApprovalType) => {
    if (window.confirm(`Approve application for "${approval.name}"?`)) {
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === approval.id ? { ...item, status: "approved" } : item
        )
      );
      setTotalItems(mockApprovals.length);
      toast.success(`Application for ${approval.name} approved`);
      if (selectedApproval?.id === approval.id) {
        setSelectedApproval({ ...approval, status: "approved" });
      }
    }
  };

  const handleReject = (approval: ApprovalType) => {
    if (window.confirm(`Reject application for "${approval.name}"?`)) {
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === approval.id ? { ...item, status: "rejected" } : item
        )
      );
      setTotalItems(mockApprovals.length);
      toast.success(`Application for ${approval.name} rejected`);
      if (selectedApproval?.id === approval.id) {
        setSelectedApproval({ ...approval, status: "rejected" });
      }
    }
  };

  const handleRequestInfo = () => {
    if (selectedApproval) {
      console.log(`Requesting info for ${selectedApproval.name}`);
    }
  };
  const handleSelectApproval = (approval: ApprovalType) => {
    setSelectedApproval(approval);
  };
  const handleSearch = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.value.length <= 1000) {
      setSearchTerm(e.target.value);
      setPageIndex(1);
    }
  };
  const actions = [
    {
      icon: <span className="text-xs">Approve</span>,
      onClick: handleApprove,
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    {
      icon: <span className="text-xs">Reject</span>,
      onClick: handleReject,
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      icon: <span className="text-xs">Request Info</span>,
      onClick: handleRequestInfo, // Trigger handleSelectApproval on row click
      className: "bg-blue-600 hover:bg-blue-700 text-white", // Hide the button
    },
    // {
    //   icon: <span className="text-xs">Request Info</span>,
    //   onClick: handleSelectApproval, // Trigger handleSelectApproval on row click
    //   className: "bg-yellow-600 hover:bg-yellow-700 text-white", // Hide the button
    // },
  ];
  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <main className="p-4 container mx-auto">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Mentor Applications</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6 pt-6">
            <div className="flex-grow relative">
              <InputCustom
                name="search"
                type="text"
                value={searchTerm}
                icon={<Search size={20} className="text-gray-500" />}
                onChange={handleSearch}
                placeholder="Search applicants..."
              />
            </div>
            <select
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageIndex(1);
              }}
            >
              {statusOptions.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium">Applications Awaiting Review</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto pb-4">
                  <DataTable
                    data={approvals}
                    columns={columns}
                    keyField="id"
                    className="bg-gray-700"
                    rowClassName="p-4 hover:bg-gray-600 cursor-pointer transition duration-150 border-b border-gray-600 last:border-b-0"
                    cellClassName="p-0"
                    headerClassName="hidden"
                    emptyMessage="No applications available"
                    pagination
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    totalItems={totalItems}
                    paginationClassName="pr-3 pl-3"
                    onRowClick={handleSelectApproval}
                  />
                </div>
              </div>
            </div>
            {/* <div className="w-1/2">
              <div className="bg-gray-700 rounded-lg p-8 text-center text-gray-400">
                <div className="flex flex-col items-center pb-2">
                  {<ClipboardList size={40} className="text-gray-500" />}
                  <p className="pt-3 text-[14px]">
                    Select an Applications to view detail
                  </p>
                </div>
              </div>
            </div> */}
            <div className="w-1/2">
              {selectedApproval ? (
                <div className="bg-gray-700 rounded-lg p-4 text-gray-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedApproval.profileImage}
                        alt={selectedApproval.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {selectedApproval.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {selectedApproval.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleApprove(selectedApproval)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedApproval)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Reject
                      </button>
                      <button
                        onClick={handleRequestInfo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                      >
                        Request Info
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Expertise Areas
                      </h4>
                      <p className="text-sm">
                        {selectedApproval.expertiseAreas.join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Professional Experience
                      </h4>
                      <p className="text-sm">{selectedApproval.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Application Timeline
                      </h4>
                      <p className="text-sm">
                        Submitted on {selectedApproval.submittedDate}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Uploaded Documents
                      </h4>
                      {selectedApproval.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="text-sm flex items-center space-x-2"
                        >
                          <span>
                            {doc.type}: {doc.name}
                          </span>
                          <a
                            href={doc.url}
                            className="text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Admin Notes
                      </h4>
                      <textarea
                        className="w-full bg-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Add notes about this application..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-8 text-center text-gray-400">
                  <div className="flex flex-col items-center pb-2">
                    <ClipboardList size={40} className="text-gray-500" />
                    <p className="pt-3 text-[14px]">
                      Select an application to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
  // return (
  //   <main className="p-4 container mx-auto">
  //     <div className="flex gap-6">
  //       {/* Left Side: Applications List */}
  //       <div className="w-1/2">
  //         <div className="bg-gray-700 rounded-lg shadow-lg">
  //           <div className="px-4 py-3 border-b border-gray-600">
  //             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  //               <h2 className="text-2xl font-bold text-white">
  //                 Applications Awaiting Review
  //               </h2>
  //               <div className="flex flex-col md:flex-row gap-4">
  //                 <div className="flex-grow relative">
  //                   <InputCustom
  //                     name="search"
  //                     type="text"
  //                     value={searchTerm}
  //                     icon={<Search size={20} className="text-gray-500" />}
  //                     onChange={handleChangeSearch}
  //                     placeholder="Search applications..."
  //                     errorMessage={errors}
  //                   />
  //                 </div>
  //                 <select
  //                   className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
  //                   value={statusFilter}
  //                   onChange={(e) => {
  //                     setStatusFilter(e.target.value);
  //                     setPageIndex(1);
  //                   }}
  //                 >
  //                   {statusOptions.map((option) => (
  //                     <option key={option.value} value={option.value}>
  //                       {option.label}
  //                     </option>
  //                   ))}
  //                 </select>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="max-h-[600px] overflow-y-auto">
  //             <DataTable
  //               data={approvals}
  //               columns={columns}
  //               keyField="id"
  //               className="bg-gray-700"
  //               rowClassName="p-4 hover:bg-gray-600 cursor-pointer transition duration-150 border-b border-gray-600 last:border-b-0"
  //               cellClassName="p-0"
  //               headerClassName="hidden"
  //               emptyMessage="No applications available"
  //               pagination
  //               //selectable

  //               pageSize={pageSize}
  //               setPageSize={setPageSize}
  //               pageIndex={pageIndex}
  //               setPageIndex={setPageIndex}
  //               totalItems={totalItems}
  //             />
  //           </div>
  //         </div>
  //       </div>

  //       {/* Right Side: Application Details */}
  //       <div className="w-1/2">
  //         {selectedApproval ? (
  //           <div className="bg-gray-700 rounded-lg overflow-hidden">
  //             <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
  //               <h3 className="font-medium text-white">Application Details</h3>
  //               {/* <div className="flex space-x-2">
  //                 <button
  //                   onClick={handleApprove}
  //                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
  //                 >
  //                   Approve
  //                 </button>
  //                 <button
  //                   onClick={handleReject}
  //                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
  //                 >
  //                   Reject
  //                 </button>
  //                 <button
  //                   onClick={handleRequestInfo}
  //                   className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
  //                 >
  //                   Request Info
  //                 </button>
  //               </div> */}
  //             </div>
  //             <div className="p-4">
  //               <div className="flex items-center space-x-4 mb-6">
  //                 {/* <img
  //                   src={`https://randomuser.me/api/portraits/women/${selectedApproval.id}.jpg`}
  //                   alt={selectedApproval.name}
  //                   className="w-16 h-16 rounded-full object-cover"
  //                 />
  //                 <div>
  //                   <h4 className="text-lg font-medium text-white">
  //                     {selectedApproval.name}
  //                   </h4>
  //                   <p className="text-gray-400">{selectedApproval.email}</p>
  //                 </div>
  //               </div>
  //               <div className="space-y-4">
  //                 <div>
  //                   <h5 className="text-sm font-medium text-gray-400 mb-1">
  //                     Expertise Areas
  //                   </h5>
  //                   <div className="flex flex-wrap gap-2">
  //                     {selectedApproval.expertiseAreas.map((area, index) => (
  //                       <span
  //                         key={index}
  //                         className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
  //                       >
  //                         {area}
  //                       </span>
  //                     ))}
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <h5 className="text-sm font-medium text-gray-400 mb-1">
  //                     Professional Experience
  //                   </h5>
  //                   <p className="text-sm text-white">
  //                     {selectedApproval.professionalExperience}
  //                   </p>
  //                 </div>
  //                 <div>
  //                   <h5 className="text-sm font-medium text-gray-400 mb-1">
  //                     Application Timeline
  //                   </h5>
  //                   <div className="space-y-2">
  //                     <div className="flex items-center">
  //                       <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs mr-2 text-white">
  //                         1
  //                       </span>
  //                       <span className="text-sm text-white">
  //                         Submitted on {selectedApproval.submittedDate}
  //                       </span>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <h5 className="text-sm font-medium text-gray-400 mb-1">
  //                     Uploaded Documents
  //                   </h5>
  //                   <div className="space-y-2">
  //                     {selectedApproval.documents.map((doc, index) => (
  //                       <div
  //                         key={index}
  //                         className="flex items-center justify-behind bg-gray-600 p-2 rounded"
  //                       >
  //                         <div className="flex items-center">
  //                           <span
  //                             className={`mr-2 ${
  //                               doc.type === "PDF"
  //                                 ? "text-red-400"
  //                                 : "text-blue-400"
  //                             }`}
  //                           >
  //                             {doc.type}
  //                           </span>
  //                           <span className="text-sm text-white">
  //                             {doc.name}
  //                           </span>
  //                         </div>
  //                         <a
  //                           href={doc.url}
  //                           className="text-blue-400 text-sm hover:underline"
  //                           target="_blank"
  //                           rel="noopener noreferrer"
  //                         >
  //                           View
  //                         </a>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <h5 className="text-sm font-medium text-gray-400 mb-1">
  //                     Admin Notes
  //                   </h5>
  //                   <textarea
  //                     className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm text-white"
  //                     rows={3}
  //                     placeholder="Add notes about this application..."
  //                     value={selectedApproval.adminNotes || ""}
  //                     onChange={handleNotesChange}
  //                   />
  //                 </div> */}
  //               </div>
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="bg-gray-700 rounded-lg p-8 text-center text-gray-400">
  //             <svg
  //               className="mx-auto h-12 w-12 text-gray-500 mb-4"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="1.5"
  //                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  //               />
  //             </svg>
  //             <p className="text-lg">Select an application to view details</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // );
};

export default ListApproval;
// import React, { useEffect, useState } from "react";
// import { Search } from "lucide-react";
// import DataTable, { DataColumn } from "../../components/table/CustomTable";
// import InputCustom from "../../components/input/InputCustom";
// import LoadingOverlay from "../../components/loading/LoadingOverlay";
// import useDebounce from "../../hooks/usedebounce";
// import { ApprovalType } from "../../types/approval";

// const ListApproval = () => {
//   const [approvals, setApprovals] = useState<ApprovalType[]>([]);
//   const [selectedApproval, setSelectedApproval] = useState<ApprovalType | null>(
//     null
//   );
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [totalItems, setTotalItems] = useState(0);
//   const [errors, setErrors] = useState<string | undefined>();
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const searchDebounced = useDebounce(searchTerm, 500);

//   // Mock data fetching
//   useEffect(() => {
//     const fetchApprovals = async () => {
//       setLoading(true);
//       try {
//         const mockApprovals: ApprovalType[] = [
//           {
//             id: "1",
//             name: "Sarah Johnson",
//             email: "sarah.j@example.com",
//             skills: "Data Science, Machine Learning, Python",
//             expertiseAreas: ["Data Science", "Machine Learning", "Python"],
//             professionalExperience: "5 years at Tech Corp, 3 years teaching",
//             status: 1,
//             submittedDate: "9/10/2023",
//             documents: [
//               { name: "Resume.pdf", type: "PDF", url: "#" },
//               { name: "Certification.jpg", type: "JPG", url: "#" },
//             ],
//             adminNotes: "",
//           },
//           {
//             id: "2",
//             name: "Michael Chen",
//             email: "michael.c@example.com",
//             skills: "UX Design, UI Prototyping, User Research",
//             expertiseAreas: ["UX Design", "UI Prototyping", "User Research"],
//             professionalExperience:
//               "4 years at Design Inc, 2 years freelancing",
//             status: 1,
//             submittedDate: "9/12/2023",
//             documents: [{ name: "Portfolio.pdf", type: "PDF", url: "#" }],
//             adminNotes: "",
//           },
//           {
//             id: "3",
//             name: "Alex Rodriguez",
//             email: "alex.r@example.com",
//             skills: "Leadership, Business Strategy, Marketing",
//             expertiseAreas: ["Leadership", "Business Strategy", "Marketing"],
//             professionalExperience: "7 years at Global Corp, 1 year consulting",
//             status: 1,
//             submittedDate: "9/14/2023",
//             documents: [
//               { name: "CV.pdf", type: "PDF", url: "#" },
//               { name: "Award.jpg", type: "JPG", url: "#" },
//             ],
//             adminNotes: "",
//           },
//         ];

//         // Filter by search term and status
//         const filteredData = mockApprovals.filter(
//           (item) =>
//             (item.name.toLowerCase().includes(searchDebounced.toLowerCase()) ||
//               item.skills
//                 .toLowerCase()
//                 .includes(searchDebounced.toLowerCase())) &&
//             (statusFilter === "" || item.status.toString() === statusFilter)
//         );

//         // Paginate
//         const start = (pageIndex - 1) * pageSize;
//         const end = start + pageSize;
//         const paginatedData = filteredData.slice(start, end);

//         setApprovals(paginatedData);
//         setTotalItems(filteredData.length);

//         // Select the first approval by default if none is selected
//         if (!selectedApproval && filteredData.length > 0) {
//           setSelectedApproval(filteredData[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching approvals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApprovals();
//   }, [searchDebounced, statusFilter, pageIndex, pageSize, selectedApproval]);

//   // Define columns for CustomTable
//   const columns: DataColumn<ApprovalType>[] = [
//     {
//       header: "",
//       accessor: (row) => (
//         <div className="flex items-center space-x-4">
//           <div className="flex-1 min-w-0">
//             <p className="font-medium truncate text-white">{row.name}</p>
//             <p className="text-sm text-gray-400 truncate">{row.skills}</p>
//             <div className="flex items-center mt-1">
//               <span
//                 className={`inline-block w-2 h-2 rounded-full mr-2 ${
//                   row.status === 1 ? "bg-yellow-500" : "bg-green-500"
//                 }`}
//               ></span>
//               <span className="text-xs text-gray-400 capitalize">
//                 {row.status === 1 ? "pending" : "approved"}
//               </span>
//               <span className="mx-2 text-gray-500">•</span>
//               <span className="text-xs text-gray-400">
//                 Submitted: {row.submittedDate}
//               </span>
//             </div>
//           </div>
//         </div>
//       ),
//       align: "left",
//     },
//   ];

//   // Status filter options
//   const statusOptions = [
//     { value: "", label: "All" },
//     { value: "1", label: "Pending" },
//     { value: "2", label: "Approved" },
//     { value: "3", label: "Rejected" },
//     { value: "4", label: "Request Info" },
//   ];

//   // Handle search input
//   const handleChangeSearch = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     if ("value" in e.target && e.target instanceof HTMLInputElement) {
//       if (e.target.value.length > 1000) {
//         setErrors("Search term must not exceed 1000 characters.");
//         return;
//       }
//       setErrors(undefined);
//       setSearchTerm(e.target.value);
//       setPageIndex(1);
//     }
//   };

//   // Mock action handlers
//   const handleApprove = () => {
//     if (selectedApproval) {
//       console.log(`Approving ${selectedApproval.name}`);
//       setApprovals((prev) =>
//         prev.map((item) =>
//           item.id === selectedApproval.id ? { ...item, status: 2 } : item
//         )
//       );
//       setSelectedApproval({ ...selectedApproval, status: 2 });
//     }
//   };

//   const handleReject = () => {
//     if (selectedApproval) {
//       console.log(`Rejecting ${selectedApproval.name}`);
//     }
//   };

//   const handleRequestInfo = () => {
//     if (selectedApproval) {
//       console.log(`Requesting info for ${selectedApproval.name}`);
//     }
//   };

//   const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     if (selectedApproval) {
//       setSelectedApproval({ ...selectedApproval, adminNotes: e.target.value });
//     }
//   };

//   if (loading) {
//     return <LoadingOverlay />;
//   }

//   return (
//     <main className="p-4 container mx-auto ">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-3xl font-bold ">Mentor Applications</h2>
//         </div>
//       </div>
//     </main>
//     // <main className="p-4 container mx-auto">
//     //   <style>
//     //     {`
//     //       /* Hide checkbox column */
//     //       table th:first-child,
//     //       table td:first-child {
//     //         display: none;
//     //       }
//     //     `}
//     //   </style>
//     //   <div className="flex gap-6">
//     //     {/* Left Side: Applications List */}
//     //     <div className="w-1/2">
//     //       <div className="bg-gray-700 rounded-lg shadow-lg">
//     //         <div className="px-4 py-3 border-b border-gray-600">
//     //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//     //             <h2 className="text-2xl font-bold text-white">
//     //               Applications Awaiting Review
//     //             </h2>
//     //             <div className="flex flex-col md:flex-row gap-4">
//     //               <div className="flex-grow relative">
//     //                 <InputCustom
//     //                   name="search"
//     //                   type="text"
//     //                   value={searchTerm}
//     //                   icon={<Search size={20} className="text-gray-500" />}
//     //                   onChange={handleChangeSearch}
//     //                   placeholder="Search applications..."
//     //                   errorMessage={errors}
//     //                 />
//     //               </div>
//     //               <select
//     //                 className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//     //                 value={statusFilter}
//     //                 onChange={(e) => {
//     //                   setStatusFilter(e.target.value);
//     //                   setPageIndex(1);
//     //                 }}
//     //               >
//     //                 {statusOptions.map((option) => (
//     //                   <option key={option.value} value={option.value}>
//     //                     {option.label}
//     //                   </option>
//     //                 ))}
//     //               </select>
//     //             </div>
//     //           </div>
//     //         </div>
//     //         <div className="max-h-[600px] overflow-y-auto">
//     //           <DataTable
//     //             data={approvals}
//     //             columns={columns}
//     //             keyField="id"
//     //             className="bg-gray-700"
//     //             rowClassName="p-4 hover:bg-gray-600 cursor-pointer transition duration-150 border-b border-gray-600 last:border-b-0"
//     //             cellClassName="p-0"
//     //             headerClassName="hidden"
//     //             emptyMessage="No applications available"
//     //             pagination
//     //             selectable
//     //             maxSelectable={1}
//     //             selectedRows={selectedApproval ? [selectedApproval] : []}
//     //             setSelectedRows={(rows) => setSelectedApproval(rows[0] || null)}
//     //             pageSize={pageSize}
//     //             setPageSize={setPageSize}
//     //             pageIndex={pageIndex}
//     //             setPageIndex={setPageIndex}
//     //             totalItems={totalItems}
//     //           />
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Right Side: Application Details */}
//     //     <div className="w-1/2">
//     //       {selectedApproval ? (
//     //         <div className="bg-gray-700 rounded-lg overflow-hidden">
//     //           <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
//     //             <h3 className="font-medium text-white">Application Details</h3>
//     //             <div className="flex space-x-2">
//     //               <button
//     //                 onClick={handleApprove}
//     //                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
//     //               >
//     //                 Approve
//     //               </button>
//     //               <button
//     //                 onClick={handleReject}
//     //                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//     //               >
//     //                 Reject
//     //               </button>
//     //               <button
//     //                 onClick={handleRequestInfo}
//     //                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//     //               >
//     //                 Request Info
//     //               </button>
//     //             </div>
//     //           </div>
//     //           <div className="p-4">
//     //             <div className="flex items-center space-x-4 mb-6">
//     //               <img
//     //                 src={`https://randomuser.me/api/portraits/women/${selectedApproval.id}.jpg`}
//     //                 alt={selectedApproval.name}
//     //                 className="w-16 h-16 rounded-full object-cover"
//     //               />
//     //               <div>
//     //                 <h4 className="text-lg font-medium text-white">
//     //                   {selectedApproval.name}
//     //                 </h4>
//     //                 <p className="text-gray-400">{selectedApproval.email}</p>
//     //               </div>
//     //             </div>
//     //             <div className="space-y-4">
//     //               <div>
//     //                 <h5 className="text-sm font-medium text-gray-400 mb-1">
//     //                   Expertise Areas
//     //                 </h5>
//     //                 <div className="flex flex-wrap gap-2">
//     //                   {selectedApproval.expertiseAreas.map((area, index) => (
//     //                     <span
//     //                       key={index}
//     //                       className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
//     //                     >
//     //                       {area}
//     //                     </span>
//     //                   ))}
//     //                 </div>
//     //               </div>
//     //               <div>
//     //                 <h5 className="text-sm font-medium text-gray-400 mb-1">
//     //                   Professional Experience
//     //                 </h5>
//     //                 <p className="text-sm text-white">
//     //                   {selectedApproval.professionalExperience}
//     //                 </p>
//     //               </div>
//     //               <div>
//     //                 <h5 className="text-sm font-medium text-gray-400 mb-1">
//     //                   Application Timeline
//     //                 </h5>
//     //                 <div className="space-y-2">
//     //                   <div className="flex items-center">
//     //                     <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs mr-2 text-white">
//     //                       1
//     //                     </span>
//     //                     <span className="text-sm text-white">
//     //                       Submitted on {selectedApproval.submittedDate}
//     //                     </span>
//     //                   </div>
//     //                 </div>
//     //               </div>
//     //               <div>
//     //                 <h5 className="text-sm font-medium text-gray-400 mb-1">
//     //                   Uploaded Documents
//     //                 </h5>
//     //                 <div className="space-y-2">
//     //                   {selectedApproval.documents.map((doc, index) => (
//     //                     <div
//     //                       key={index}
//     //                       className="flex items-center justify-between bg-gray-600 p-2 rounded"
//     //                     >
//     //                       <div className="flex items-center">
//     //                         <span
//     //                           className={`mr-2 ${
//     //                             doc.type === "PDF"
//     //                               ? "text-red-400"
//     //                               : "text-blue-400"
//     //                           }`}
//     //                         >
//     //                           {doc.type}
//     //                         </span>
//     //                         <span className="text-sm text-white">
//     //                           {doc.name}
//     //                         </span>
//     //                       </div>
//     //                       <a
//     //                         href={doc.url}
//     //                         className="text-blue-400 text-sm hover:underline"
//     //                         target="_blank"
//     //                         rel="noopener noreferrer"
//     //                       >
//     //                         View
//     //                       </a>
//     //                     </div>
//     //                   ))}
//     //                 </div>
//     //               </div>
//     //               <div>
//     //                 <h5 className="text-sm font-medium text-gray-400 mb-1">
//     //                   Admin Notes
//     //                 </h5>
//     //                 <textarea
//     //                   className="w-full bg-gray-600 border border-gray-500 rounded-md p-2 text-sm text-white"
//     //                   rows={3}
//     //                   placeholder="Add notes about this application..."
//     //                   value={selectedApproval.adminNotes || ""}
//     //                   onChange={handleNotesChange}
//     //                 />
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       ) : (
//     //         <div className="bg-gray-700 rounded-lg p-8 text-center text-gray-400">
//     //           <svg
//     //             className="mx-auto h-12 w-12 text-gray-500 mb-4"
//     //             fill="none"
//     //             viewBox="0 0 24 24"
//     //             stroke="currentColor"
//     //           >
//     //             <path
//     //               strokeLinecap="round"
//     //               strokeLinejoin="round"
//     //               strokeWidth="1.5"
//     //               d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//     //             />
//     //           </svg>
//     //           <p className="text-lg">Select an application to view details</p>
//     //         </div>
//     //       )}
//     //     </div>
//     //   </div>
//     // </main>
//   );
// };

// export default ListApproval;
// import { Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// // import Button from "../../components/ui/Button";
// import DataTable, { DataColumn } from "../../components/table/CustomTable";
// import InputCustom from "../../components/input/InputCustom";
// import CustomModal from "../../components/ui/Modal";
// import ApprovalDetailsDialog from "../../components/dialog/ApprovalDetailsDialog"; // Giả định component chi tiết
// import useDebounce from "../../hooks/usedebounce";
// import LoadingOverlay from "../../components/loading/LoadingOverlay";

// type ApprovalType = {
//   id: string;
//   name: string;
//   email: string;
//   expertise: string[];
//   status: "pending" | "approved" | "rejected";
//   submittedDate: string;
//   profileImage: string;
//   experience: string;
//   documents: { type: string; name: string; url: string }[];
// };

// // Mock data tĩnh
// const mockApprovals: ApprovalType[] = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     email: "sarah.j@example.com",
//     expertise: ["Data Science", "Machine Learning", "Python"],
//     status: "pending",
//     submittedDate: "2023-09-10",
//     profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
//     experience: "5 years at Tech Corp, 3 years teaching",
//     documents: [
//       { type: "PDF", name: "Resume.pdf", url: "#" },
//       { type: "JPG", name: "Certification.jpg", url: "#" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Michael Chen",
//     email: "michael.c@example.com",
//     expertise: ["UX Design", "UI Prototyping", "User Research"],
//     status: "pending",
//     submittedDate: "2023-09-12",
//     profileImage: "https://randomuser.me/api/portraits/men/42.jpg",
//     experience: "4 years at Design Studio",
//     documents: [{ type: "PDF", name: "Portfolio.pdf", url: "#" }],
//   },
//   {
//     id: "3",
//     name: "Alex Rodriguez",
//     email: "alex.r@example.com",
//     expertise: ["Leadership", "Business Strategy", "Marketing"],
//     status: "pending",
//     submittedDate: "2023-09-14",
//     profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
//     experience: "10 years in corporate leadership",
//     documents: [{ type: "PDF", name: "CV.pdf", url: "#" }],
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     email: "emily.d@example.com",
//     expertise: ["Web Development", "React", "Node.js"],
//     status: "approved",
//     submittedDate: "2023-09-08",
//     profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
//     experience: "6 years as full-stack developer",
//     documents: [{ type: "PDF", name: "Resume.pdf", url: "#" }],
//   },
//   {
//     id: "5",
//     name: "James Wilson",
//     email: "james.w@example.com",
//     expertise: ["Cybersecurity", "Network Security"],
//     status: "rejected",
//     submittedDate: "2023-09-07",
//     profileImage: "https://randomuser.me/api/portraits/men/23.jpg",
//     experience: "3 years in IT security",
//     documents: [{ type: "PDF", name: "Certifications.pdf", url: "#" }],
//   },
// ];

// const ListApproval = () => {
//   const [approvals, setApprovals] = useState<ApprovalType[]>(mockApprovals);
//   const [selectedApproval, setSelectedApproval] = useState<
//     ApprovalType | undefined
//   >(undefined);
//   //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [totalItems, setTotalItems] = useState(mockApprovals.length);
//   const searchDebounced = useDebounce(searchTerm, 500);

//   const statusOptions = [
//     { value: "", label: "All" },
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//   ];

//   useEffect(() => {
//     // Giả lập gọi API với mock data
//     setLoading(true);
//     const filtered = mockApprovals.filter((approval) => {
//       const matchesSearch = approval.name
//         .toLowerCase()
//         .includes(searchDebounced.toLowerCase());
//       const matchesStatus = statusFilter
//         ? approval.status === statusFilter
//         : true;
//       return matchesSearch && matchesStatus;
//     });
//     const start = (pageIndex - 1) * pageSize;
//     const paginated = filtered.slice(start, start + pageSize);
//     setApprovals(paginated);
//     setTotalItems(filtered.length);
//     setLoading(false);
//   }, [searchDebounced, statusFilter, pageIndex, pageSize]);

//   const handleViewDetails = (approval: ApprovalType) => {
//     setSelectedApproval(approval);
//     // setIsDetailsOpen(true);
//   };

//   const handleApprove = (approval: ApprovalType) => {
//     if (window.confirm(`Approve application for "${approval.name}"?`)) {
//       setApprovals((prev) =>
//         prev.map((item) =>
//           item.id === approval.id ? { ...item, status: "approved" } : item
//         )
//       );
//       setTotalItems(mockApprovals.length); // Cập nhật lại tổng số
//       toast.success(`Application for ${approval.name} approved`);
//       if (selectedApproval?.id === approval.id) {
//         setSelectedApproval({ ...approval, status: "approved" });
//       }
//     }
//   };

//   const handleReject = (approval: ApprovalType) => {
//     if (window.confirm(`Reject application for "${approval.name}"?`)) {
//       setApprovals((prev) =>
//         prev.map((item) =>
//           item.id === approval.id ? { ...item, status: "rejected" } : item
//         )
//       );
//       setTotalItems(mockApprovals.length); // Cập nhật lại tổng số
//       toast.success(`Application for ${approval.name} rejected`);
//       if (selectedApproval?.id === approval.id) {
//         setSelectedApproval({ ...approval, status: "rejected" });
//       }
//     }
//   };

//   const handleCloseDetails = () => {
//     setIsDetailsOpen(false);
//     setSelectedApproval(undefined);
//   };

//   const handleSearch = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     if (e.target instanceof HTMLInputElement && e.target.value.length <= 1000) {
//       setSearchTerm(e.target.value);
//       setPageIndex(1);
//     }
//   };

//   const columns: DataColumn<ApprovalType>[] = [
//     {
//       header: "APPLICANT",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex items-center space-x-4">
//           <img
//             src={approval.profileImage}
//             alt={approval.name}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div>
//             <p className="font-medium">{approval.name}</p>
//             <p className="text-xs text-gray-400">{approval.email}</p>
//           </div>
//         </div>
//       ),
//       align: "left",
//       width: "30%",
//     },
//     {
//       header: "EXPERTISE",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex flex-wrap gap-2">
//           {approval.expertise.map((skill, index) => (
//             <span
//               key={index}
//               className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       ),
//       align: "left",
//       width: "30%",
//     },
//     {
//       header: "SUBMITTED",
//       accessor: "submittedDate",
//       align: "center",
//       width: "15%",
//     },
//     {
//       header: "STATUS",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex items-center justify-center">
//           <span
//             className={`inline-block w-2 h-2 rounded-full mr-2 ${
//               approval.status === "pending"
//                 ? "bg-yellow-500"
//                 : approval.status === "approved"
//                 ? "bg-green-500"
//                 : "bg-red-500"
//             }`}
//           ></span>
//           <span className="text-xs capitalize">{approval.status}</span>
//         </div>
//       ),
//       align: "center",
//       width: "15%",
//     },
//   ];

//   const actions = [
//     {
//       icon: <span className="text-xs">Details</span>,
//       onClick: handleViewDetails,
//       className: "bg-blue-600 hover:bg-blue-700 text-white",
//     },
//     {
//       icon: <span className="text-xs">Approve</span>,
//       onClick: handleApprove,
//       className: "bg-green-600 hover:bg-green-700 text-white",
//     },
//     {
//       icon: <span className="text-xs">Reject</span>,
//       onClick: handleReject,
//       className: "bg-red-600 hover:bg-red-700 text-white",
//     },
//   ];

//   if (loading) {
//     return <LoadingOverlay />;
//   }

//   return (
//     <main className="p-4 container mx-auto">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-3xl font-bold">Mentor Applications</h2>
//         </div>
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="flex-grow relative">
//             <InputCustom
//               name="search"
//               type="text"
//               value={searchTerm}
//               icon={<Search size={20} className="text-gray-500" />}
//               onChange={handleSearch}
//               placeholder="Search applicants..."
//             />
//           </div>
//           <select
//             className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPageIndex(1);
//             }}
//           >
//             {statusOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <DataTable
//           data={approvals}
//           columns={columns}
//           keyField="id"
//           actions={actions}
//           pagination
//           pageSize={pageSize}
//           setPageSize={setPageSize}
//           pageIndex={pageIndex}
//           setPageIndex={setPageIndex}
//           totalItems={totalItems}
//           emptyMessage="No applications found"
//         />
//       </div>
//       <CustomModal
//         isOpen={isDetailsOpen}
//         onClose={handleCloseDetails}
//         title="Application Details"
//         size="lg"
//       >
//         {selectedApproval && (
//           <ApprovalDetailsDialog
//             approvalData={selectedApproval}
//             onClose={handleCloseDetails}
//             onApprove={() => handleApprove(selectedApproval)}
//             onReject={() => handleReject(selectedApproval)}
//           />
//         )}
//       </CustomModal>
//     </main>
//   );
// };

// export default ListApproval;
// import { Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import DataTable, { DataColumn } from "../../components/table/CustomTable";
// import InputCustom from "../../components/input/InputCustom";
// import useDebounce from "../../hooks/usedebounce";
// import LoadingOverlay from "../../components/loading/LoadingOverlay";

// type ApprovalType = {
//   id: string;
//   name: string;
//   email: string;
//   expertise: string[];
//   status: "pending" | "approved" | "rejected";
//   submittedDate: string;
//   profileImage: string;
//   experience: string;
//   documents: { type: string; name: string; url: string }[];
// };

// // Mock data tĩnh
// const mockApprovals: ApprovalType[] = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     email: "sarah.j@example.com",
//     expertise: ["Data Science", "Machine Learning", "Python"],
//     status: "pending",
//     submittedDate: "2023-09-10",
//     profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
//     experience: "5 years at Tech Corp, 3 years teaching",
//     documents: [
//       { type: "PDF", name: "Resume.pdf", url: "#" },
//       { type: "JPG", name: "Certification.jpg", url: "#" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Michael Chen",
//     email: "michael.c@example.com",
//     expertise: ["UX Design", "UI Prototyping", "User Research"],
//     status: "pending",
//     submittedDate: "2023-09-12",
//     profileImage: "https://randomuser.me/api/portraits/men/42.jpg",
//     experience: "4 years at Design Studio",
//     documents: [{ type: "PDF", name: "Portfolio.pdf", url: "#" }],
//   },
//   {
//     id: "3",
//     name: "Alex Rodriguez",
//     email: "alex.r@example.com",
//     expertise: ["Leadership", "Business Strategy", "Marketing"],
//     status: "pending",
//     submittedDate: "2023-09-14",
//     profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
//     experience: "10 years in corporate leadership",
//     documents: [{ type: "PDF", name: "CV.pdf", url: "#" }],
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     email: "emily.d@example.com",
//     expertise: ["Web Development", "React", "Node.js"],
//     status: "approved",
//     submittedDate: "2023-09-08",
//     profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
//     experience: "6 years as full-stack developer",
//     documents: [{ type: "PDF", name: "Resume.pdf", url: "#" }],
//   },
//   {
//     id: "5",
//     name: "James Wilson",
//     email: "james.w@example.com",
//     expertise: ["Cybersecurity", "Network Security"],
//     status: "rejected",
//     submittedDate: "2023-09-07",
//     profileImage: "https://randomuser.me/api/portraits/men/23.jpg",
//     experience: "3 years in IT security",
//     documents: [{ type: "PDF", name: "Certifications.pdf", url: "#" }],
//   },
// ];

// const ListApproval = () => {
//   const [approvals, setApprovals] = useState<ApprovalType[]>(mockApprovals);
//   const [selectedApproval, setSelectedApproval] = useState<
//     ApprovalType | undefined
//   >(undefined);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [totalItems, setTotalItems] = useState(mockApprovals.length);
//   const searchDebounced = useDebounce(searchTerm, 500);

//   const statusOptions = [
//     { value: "", label: "All" },
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     const filtered = mockApprovals.filter((approval) => {
//       const matchesSearch = approval.name
//         .toLowerCase()
//         .includes(searchDebounced.toLowerCase());
//       const matchesStatus = statusFilter
//         ? approval.status === statusFilter
//         : true;
//       return matchesSearch && matchesStatus;
//     });
//     const start = (pageIndex - 1) * pageSize;
//     const paginated = filtered.slice(start, start + pageSize);
//     setApprovals(paginated);
//     setTotalItems(filtered.length);
//     setLoading(false);
//   }, [searchDebounced, statusFilter, pageIndex, pageSize]);

//   const handleSelectApproval = (approval: ApprovalType) => {
//     setSelectedApproval(approval);
//   };

//   const handleApprove = (approval: ApprovalType) => {
//     if (window.confirm(`Approve application for "${approval.name}"?`)) {
//       setApprovals((prev) =>
//         prev.map((item) =>
//           item.id === approval.id ? { ...item, status: "approved" } : item
//         )
//       );
//       setTotalItems(mockApprovals.length);
//       toast.success(`Application for ${approval.name} approved`);
//       if (selectedApproval?.id === approval.id) {
//         setSelectedApproval({ ...approval, status: "approved" });
//       }
//     }
//   };

//   const handleReject = (approval: ApprovalType) => {
//     if (window.confirm(`Reject application for "${approval.name}"?`)) {
//       setApprovals((prev) =>
//         prev.map((item) =>
//           item.id === approval.id ? { ...item, status: "rejected" } : item
//         )
//       );
//       setTotalItems(mockApprovals.length);
//       toast.success(`Application for ${approval.name} rejected`);
//       if (selectedApproval?.id === approval.id) {
//         setSelectedApproval({ ...approval, status: "rejected" });
//       }
//     }
//   };

//   const handleSearch = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     if (e.target instanceof HTMLInputElement && e.target.value.length <= 1000) {
//       setSearchTerm(e.target.value);
//       setPageIndex(1);
//     }
//   };

//   const columns: DataColumn<ApprovalType>[] = [
//     {
//       header: "APPLICANT",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex items-center space-x-4">
//           <img
//             src={approval.profileImage}
//             alt={approval.name}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div>
//             <p className="font-medium">{approval.name}</p>
//             <p className="text-xs text-gray-400">{approval.email}</p>
//           </div>
//         </div>
//       ),
//       align: "left",
//       width: "30%",
//     },
//     {
//       header: "EXPERTISE",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex flex-wrap gap-2">
//           {approval.expertise.map((skill, index) => (
//             <span
//               key={index}
//               className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       ),
//       align: "left",
//       width: "30%",
//     },
//     {
//       header: "SUBMITTED",
//       accessor: "submittedDate",
//       align: "center",
//       width: "15%",
//     },
//     {
//       header: "STATUS",
//       accessor: (approval: ApprovalType) => (
//         <div className="flex items-center justify-center">
//           <span
//             className={`inline-block w-2 h-2 rounded-full mr-2 ${
//               approval.status === "pending"
//                 ? "bg-yellow-500"
//                 : approval.status === "approved"
//                 ? "bg-green-500"
//                 : "bg-red-500"
//             }`}
//           ></span>
//           <span className="text-xs capitalize">{approval.status}</span>
//         </div>
//       ),
//       align: "center",
//       width: "15%",
//     },
//   ];

//   const actions = [
//     {
//       icon: <span className="text-xs">Approve</span>,
//       onClick: handleApprove,
//       className: "bg-green-600 hover:bg-green-700 text-white",
//     },
//     {
//       icon: <span className="text-xs">Reject</span>,
//       onClick: handleReject,
//       className: "bg-red-600 hover:bg-red-700 text-white",
//     },
//   ];

//   if (loading) {
//     return <LoadingOverlay />;
//   }

//   return (
//     <main className="p-4 container mx-auto">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-3xl font-bold">Mentor Applications</h2>
//         </div>
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="flex-grow relative">
//             <InputCustom
//               name="search"
//               type="text"
//               value={searchTerm}
//               icon={<Search size={20} className="text-gray-500" />}
//               onChange={handleSearch}
//               placeholder="Search applicants..."
//             />
//           </div>
//           <select
//             className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPageIndex(1);
//             }}
//           >
//             {statusOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex gap-6">
//           {/* Applications Awaiting Review */}
//           <div className="w-1/2">
//             <div className="bg-gray-700 rounded-lg overflow-hidden">
//               <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
//                 <h3 className="font-medium">Applications Awaiting Review</h3>
//               </div>
//               <DataTable
//                 data={approvals}
//                 columns={columns}
//                 keyField="id"
//                 actions={actions}
//                 pagination
//                 pageSize={pageSize}
//                 setPageSize={setPageSize}
//                 pageIndex={pageIndex}
//                 setPageIndex={setPageIndex}
//                 totalItems={totalItems}
//                 emptyMessage="No applications found"
//                 rowClassName="cursor-pointer"
//                 //onRowClick={handleSelectApproval}
//               />
//             </div>
//           </div>
//           {/* Application Details */}
//           <div className="w-1/2">
//             <div className="bg-gray-700 rounded-lg overflow-hidden">
//               <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
//                 <h3 className="font-medium">Application Details</h3>
//               </div>
//               <div className="p-4">
//                 {selectedApproval ? (
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={selectedApproval.profileImage}
//                         alt={selectedApproval.name}
//                         className="w-16 h-16 rounded-full object-cover"
//                       />
//                       <div>
//                         <h4 className="text-lg font-medium">
//                           {selectedApproval.name}
//                         </h4>
//                         <p className="text-gray-400">
//                           {selectedApproval.email}
//                         </p>
//                       </div>
//                     </div>
//                     <div>
//                       <h5 className="text-sm font-medium text-gray-400 mb-1">
//                         Expertise Areas
//                       </h5>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedApproval.expertise.map((skill, index) => (
//                           <span
//                             key={index}
//                             className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-400 text-sm">
//                     Select an application to view details
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ListApproval;
