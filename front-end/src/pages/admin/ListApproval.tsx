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
  // const [errors, setErrors] = useState<string | undefined>();
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
  const handleSelectApplicants = (approval: ApprovalType) => {
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
                    onRowClick={handleSelectApplicants}
                  />
                </div>
              </div>
            </div>
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
};
export default ListApproval;
