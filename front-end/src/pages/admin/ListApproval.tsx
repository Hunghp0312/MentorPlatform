import React, { useEffect, useState } from "react";
import { Search, ClipboardList, FileText } from "lucide-react";
import { toast } from "react-toastify";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import useDebounce from "../../hooks/usedebounce";
import { approvalService } from "../../services/approval.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
// Updated ApprovalType interface
interface ApprovalType {
  applicantUserId: string;
  fullName: string;
  email: string;
  photoData: string;
  submissionDate: string;
  lastStatusUpdateDate: string | null;
  approverName: string;
  adminComments: string | null;
  rejectionReason: string | null;
  approvalDate: string | null;
  requestInfoDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  expertiseAreas: ExpertiseArea[];
  professionExperience: string;
  applicationTimeline: string;
  documents: Document[];
  status: "Pending" | "Approved" | "Rejected" | "RequestInfo";
}
interface ApprovalFilterType {
  status: string;
}
interface ExpertiseArea {
  name: string;
}

const ListApproval = () => {
  const [approvals, setApprovals] = useState<ApprovalType[]>();
  const [selectedApproval, setSelectedApproval] = useState<ApprovalType | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filter, setFilter] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [adminNotes, setAdminNotes] = useState(""); // New state for admin notes

  const searchDebounced = useDebounce(searchTerm, 500);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "request-info", label: "Request Info" },
  ];

  useEffect(() => {
    fetchApplications();
  }, [pageIndex, pageSize, searchDebounced, filter]);
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await approvalService.getAllMentorApplications(
        searchDebounced,
        filter,
        pageIndex,
        pageSize
      );
      setTotalItems(res.totalItems);
      setApprovals(res.items);
      console.log("Data:", res.items);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching applications:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  // Define columns for CustomTable
  const columns: DataColumn<ApprovalType>[] = [
    {
      header: "",
      accessor: (row) => (
        <div className="flex items-center space-x-4">
          <img
            src={row.photoData}
            alt={row.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-white">{row.fullName}</p>
            <p className="text-sm text-gray-400 truncate pt-0.5">
              {row.expertiseAreas.map((area) => area.name).join(", ")}
            </p>
            <div className="flex items-center mt-1">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  row.status === "Pending"
                    ? "bg-yellow-500"
                    : row.status === "Approved"
                    ? "bg-green-500"
                    : row.status === "Rejected"
                    ? "bg-red-500"
                    : row.status === "RequestInfo"
                    ? "bg-blue-500"
                    : ""
                }`}
              ></span>
              <span className="text-xs text-gray-400 capitalize">
                {row.status}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-xs text-gray-400">
                Submitted: {row.submissionDate}
              </span>
            </div>
          </div>
        </div>
      ),
      align: "left",
    },
  ];

  // Get current timestamp
  //const getCurrentTimestamp = () => new Date().toISOString().split("T")[0];

  // Approve handler
  const handleApprove = async (approval: ApprovalType) => {
    if (window.confirm(`Approve application for "${approval.fullName}"?`)) {
      try {
        const request = {
          MentorId: approval.applicantUserId,
          StatusId: 3, // Approved
          AdminReviewerId: adminReviewerId,
          AdminComments: null, // No comments for Approve
        };
        const response = await approvalService.updateMentorApplicationStatus(
          request
        );
        setApprovals((prev) =>
          prev.map((item) =>
            item.applicantUserId === approval.applicantUserId
              ? {
                  ...item,
                  status: "Approved",
                  approvalDate: new Date().toISOString().split("T")[0],
                }
              : item
          )
        );
        setTotalItems((prev) => prev); // Maintain total items
        toast.success(`Application for ${approval.fullName} approved`);
        if (selectedApproval?.applicantUserId === approval.applicantUserId) {
          setSelectedApproval({
            ...selectedApproval,
            status: "Approved",
            approvalDate: new Date().toISOString(),
          });
        }
      } catch (error) {
        toast.error("Failed to approve application");
      }
    }
  };

  // Reject handler
  const handleReject = (approval: ApprovalType) => {
    setSelectedApproval(approval);
    setIsRejectModalOpen(true);
  };

  // Confirm rejection with comment
  const confirmReject = async () => {
    if (selectedApproval) {
      try {
        const request = {
          MentorId: selectedApproval.applicantUserId,
          StatusId: 2, // Rejected
          AdminReviewerId: adminReviewerId,
          AdminComments: rejectionComment.trim() || null,
        };
        const response = await approvalService.updateMentorApplicationStatus(
          request
        );
        setApprovals((prev) =>
          prev.map((item) =>
            item.applicantUserId === selectedApproval.applicantUserId
              ? {
                  ...item,
                  status: "Rejected",
                  rejectionReason: rejectionComment.trim() || null,
                  lastStatusUpdateDate: new Date().toISOString(),
                }
              : item
          )
        );
        setTotalItems((prev) => prev); // Maintain total items
        toast.success(`Application for ${selectedApproval.fullName} rejected`);
        setSelectedApproval({
          ...selectedApproval,
          status: "Rejected",
          rejectionReason: rejectionComment.trim() || null,
          lastStatusUpdateDate: new Date().toISOString(),
        });
        setRejectionComment("");
        setIsRejectModalOpen(false);
      } catch (error) {
        toast.error("Failed to reject application");
      }
    }
  };

  // Request Info handler
  const handleRequestInfo = async () => {
    if (
      selectedApproval &&
      window.confirm(
        `Request additional info for "${selectedApproval.fullName}"?`
      )
    ) {
      try {
        const request = {
          MentorId: selectedApproval.applicantUserId,
          StatusId: 4, // Request Info
          AdminReviewerId: adminReviewerId,
          AdminComments: adminNotes.trim() || null,
        };
        const response = await approvalService.updateMentorApplicationStatus(
          request
        );
        setApprovals((prev) =>
          prev.map((item) =>
            item.applicantUserId === selectedApproval.applicantUserId
              ? {
                  ...item,
                  status: "RequestInfo",
                  requestInfoDate: new Date().toISOString(),
                  adminComments: adminNotes.trim() || null,
                }
              : item
          )
        );
        setTotalItems((prev) => prev); // Maintain total items
        toast.success(`Info requested for ${selectedApproval.fullName}`);
        setSelectedApproval({
          ...selectedApproval,
          status: "RequestInfo",
          requestInfoDate: new Date().toISOString(),
          adminComments: adminNotes.trim() || null,
        });
        setAdminNotes("");
      } catch (error) {
        toast.error("Failed to request additional info");
      }
    }
  };

  const handleSelectApplicants = (approval: ApprovalType) => {
    setSelectedApproval(approval);
    setAdminNotes(""); // Reset admin notes when selecting a new applicant
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

  // Determine circle color based on action
  const getActionColor = (action: string) => {
    if (action.includes("Approved")) return "bg-green-500";
    if (action.includes("Rejected")) return "bg-red-500";
    if (action.includes("Request Info")) return "bg-blue-500";
    return "bg-orange-500"; // Default for "Submitted"
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
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
                        src={
                          selectedApproval.photoData ||
                          "https://via.placeholder.com/48"
                        }
                        alt={selectedApproval.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {selectedApproval.fullName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {selectedApproval.email}
                        </p>
                      </div>
                    </div>
                    {["Pending", "RequestInfo"].includes(
                      selectedApproval.status
                    ) && (
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
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Expertise Areas
                      </h4>
                      <p className="text-sm">
                        {selectedApproval.expertiseAreas
                          .map((area) => area.name)
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Professional Experience
                      </h4>
                      <p className="text-sm">
                        {selectedApproval.professionExperience}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Application Timeline
                      </h4>
                      <div className="space-y-2">
                        {[
                          ...(selectedApproval.applicationTimeline
                            ? [
                                {
                                  action: "Submitted",
                                  timestamp:
                                    selectedApproval.applicationTimeline,
                                },
                              ]
                            : []),
                          ...(selectedApproval.approvalDate
                            ? [
                                {
                                  action: "Approved",
                                  timestamp: selectedApproval.approvalDate,
                                },
                              ]
                            : []),
                          ...(selectedApproval.rejectionReason
                            ? [
                                {
                                  action: `Rejected: ${selectedApproval.rejectionReason}`,
                                  timestamp:
                                    selectedApproval.lastStatusUpdateDate,
                                },
                              ]
                            : []),
                          ...(selectedApproval.requestInfoDate
                            ? [
                                {
                                  action: "Request Info",
                                  timestamp: selectedApproval.requestInfoDate,
                                },
                              ]
                            : []),
                        ].map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <span
                              className={`flex items-center justify-center w-5 h-5 rounded-full ${getActionColor(
                                entry.action
                              )} text-white text-xs font-medium`}
                            >
                              {index + 1}
                            </span>
                            <span>
                              {entry.action} on {entry.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Uploaded Documents
                      </h4>
                      <div className="space-y-2">
                        {selectedApproval.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-gray-600 p-2 rounded-md hover:bg-gray-500 transition duration-150"
                          >
                            <FileText size={16} className="text-gray-300" />
                            <span className="text-sm text-gray-300">
                              PDF: {doc.fileName}
                            </span>
                            {/* <a
                              href={`/api/files/${doc.fileId}`}
                              className="text-blue-400 hover:underline text-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a> */}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Admin Notes
                      </h4>
                      <textarea
                        className="w-full bg-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Add notes about this application..."
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
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

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Reject Application
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to reject the application for{" "}
              <strong>{selectedApproval?.fullName}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rejection Comment
              </label>
              <textarea
                className="w-full bg-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter reason for rejection..."
                rows={4}
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionComment("");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                disabled={!rejectionComment.trim()}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ListApproval;
