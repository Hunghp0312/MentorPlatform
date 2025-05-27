import React, { useEffect, useState } from "react";
import { Search, ClipboardList, FileText, Eye } from "lucide-react";
import { toast } from "react-toastify";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import useDebounce from "../../hooks/usedebounce";
import { approvalService } from "../../services/approval.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
import { MentorUpdateStatusRequest } from "../../types/approval";
import { userService } from "../../services/user.service";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
  SupportingDocument,
} from "../../types/mentorapplication";
import CustomModal from "../../components/ui/Modal";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
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
  workExperienceDetails: MentorWorkExperience[];
  certifications: MentorCertification[];
  educationDetails: MentorEducation[];
  professionExperience: string;
  applicationTimeline: string;
  documents: SupportingDocument;
  status: "Pending" | "Approved" | "Rejected" | "RequestInfo";
}
interface ExpertiseArea {
  name: string;
}

const ListApproval = () => {
  const [approvals, setApprovals] = useState<ApprovalType[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalType | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState<{
    title: string;
    content: string | null;
  }>({
    title: "",
    content: null,
  });
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [documentData, setDocumentData] = useState<{
    fileContent: string;
    fileType: string;
  } | null>(null);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "request-info", label: "Request Info" },
  ];

  useEffect(() => {
    // Map statusFilter to filter number
    const statusToFilter: { [key: string]: number } = {
      "": 0, // All
      pending: 1,
      approved: 3,
      rejected: 2,
      "request-info": 4,
    };
    setFilter(statusToFilter[statusFilter] || 0);
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [pageIndex, pageSize, searchDebounced, statusFilter]);
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
  const handleViewDocument = (
    fileContent: string | undefined,
    fileType: string
  ) => {
    if (!fileContent) {
      toast.error("Không thể mở tài liệu: Không có nội dung tài liệu.");
      return;
    }
    if (!fileType) {
      toast.error("Không thể mở tài liệu: Thiếu loại tệp.");
      return;
    }
    try {
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
      if (!isValidBase64) {
        toast.error("Không thể mở tài liệu: Dữ liệu Base64 không hợp lệ.");
        return;
      }
      setDocumentData({ fileContent, fileType });
      setOpenDocumentViewer(true);
    } catch {
      toast.error("Lỗi khi mở tài liệu: Vui lòng thử lại.");
    }
  };

  const handleCloseDocumentViewer = () => {
    setOpenDocumentViewer(false);
    setDocumentData(null);
  };
  const handleShowDetails = (action: string, content: string | null) => {
    setDetailsContent({
      title: action.includes("Rejected") ? "Rejection Reason" : "Admin Notes",
      content,
    });
    setIsDetailsModalOpen(true);
  };
  // Define columns for CustomTable
  const columns: DataColumn<ApprovalType>[] = [
    {
      header: "",
      accessor: (row) => (
        <div className="flex items-center space-x-4">
          <img
            // src={row.photoData}
            src="https://via.placeholder.com/48"
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
                {row.status === "RequestInfo" && row.requestInfoDate
                  ? `Request Info: ${
                      row.requestInfoDate
                        .split(",")
                        .filter((date) => date.trim())
                        .sort(
                          (a, b) =>
                            new Date(b).getTime() - new Date(a).getTime()
                        )[0]
                    }`
                  : row.status === "Pending" && row.submissionDate
                  ? `Submission Date: ${
                      row.submissionDate
                        .split(",")
                        .filter((date) => date.trim())
                        .sort(
                          (a, b) =>
                            new Date(b).getTime() - new Date(a).getTime()
                        )[0]
                    }`
                  : row.status === "Approved" && row.approvalDate
                  ? `Approval Date: ${row.approvalDate}`
                  : row.status === "Rejected" && row.approvalDate
                  ? `Rejection Date: ${row.approvalDate}`
                  : ""}
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
        const request: MentorUpdateStatusRequest = {
          mentorId: approval.applicantUserId,
          statusId: 3, // Approved
          adminReviewerId: (await userService.getCurrentUser()).id, // Replace with actual admin ID if available
          adminComments: undefined, // No comments for Approve
        };
        await approvalService.updateMentorApplicationStatus(request);
        setApprovals((prev = []) =>
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
        toast.success(`Application for ${approval.fullName} approved`);
        if (selectedApproval?.applicantUserId === approval.applicantUserId) {
          setSelectedApproval({
            ...selectedApproval,
            status: "Approved",
            approvalDate: new Date().toISOString(),
          });
        }
      } catch {
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
        const request: MentorUpdateStatusRequest = {
          mentorId: selectedApproval.applicantUserId,
          statusId: 2, // Rejected
          adminReviewerId: (await userService.getCurrentUser()).id, // Replace with actual admin ID
          adminComments: rejectionComment.trim() || undefined,
        };
        await approvalService.updateMentorApplicationStatus(request);
        setApprovals((prev = []) =>
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
        toast.success(`Application for ${selectedApproval.fullName} rejected`);
        setSelectedApproval({
          ...selectedApproval,
          status: "Rejected",
          rejectionReason: rejectionComment.trim() || null,
          lastStatusUpdateDate: new Date().toISOString(),
        });
        setRejectionComment("");
        setIsRejectModalOpen(false);
      } catch {
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
        const request: MentorUpdateStatusRequest = {
          mentorId: selectedApproval.applicantUserId,
          statusId: 4, // Request Info
          adminReviewerId: (await userService.getCurrentUser()).id, // Replace with actual admin ID
          adminComments: adminNotes.trim() || undefined,
        };
        await approvalService.updateMentorApplicationStatus(request);
        setApprovals((prev = []) =>
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
        toast.success(`Info requested for ${selectedApproval.fullName}`);
        setSelectedApproval({
          ...selectedApproval,
          status: "RequestInfo",
          requestInfoDate: new Date().toISOString(),
          adminComments: adminNotes.trim() || null,
        });
        setAdminNotes("");
      } catch {
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
  const additionalSettingsContent = (
    <div>
      <div>
        <h4 className="text-sm font-medium text-gray-400">Education(s)</h4>
        <div className="bg-gray-700 p-1 rounded-lg">
          {selectedApproval?.educationDetails.length != 0 ? (
            selectedApproval?.educationDetails.map((education, index) => (
              <div
                key={index}
                className="flex justify-between py-1 border-b-1 border-gray-500 last:border-b-0"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-normal">{education.fieldOfStudy}</h5>
                    <p className="text-[12px] text-gray-400">
                      {education.institutionName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {education.graduationYear ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No education provided.</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-400">
          Work Experience(s)
        </h4>
        <div className="bg-gray-700 p-1 rounded-lg">
          {selectedApproval?.workExperienceDetails.length != 0 ? (
            selectedApproval?.workExperienceDetails.map((experience, index) => (
              <div
                key={index}
                className="flex justify-between py-1 border-b-1 border-gray-500 last:border-b-0"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-normal">{experience.position}</h5>
                    <p className="text-[12px] text-gray-400">
                      {experience.companyName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(experience.startDate).getFullYear()}–
                      {experience.endDate
                        ? new Date(experience.endDate).getFullYear()
                        : "Present"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">
              No work experience provided.
            </p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400">Certification(s)</h3>
        <div className="bg-gray-700 p-1 rounded-lg">
          {selectedApproval?.certifications?.length != 0 ? (
            selectedApproval?.certifications.map((certificate, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b-1 border-gray-500 last:border-b-0"
              >
                <div className="flex w-full justify-between items-start">
                  <div className="flex flex-col">
                    <h5 className="font-normal">
                      {certificate.certificationName}
                    </h5>
                    <p className="text-[12px] text-gray-400">
                      {certificate.issuingOrganization}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2"></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-200">No certifications provided.</p>
          )}
        </div>
      </div>
    </div>
  );

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
                    keyField="applicantUserId"
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
                          id="approve-application-button"
                          onClick={() => handleApprove(selectedApproval)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Approve
                        </button>
                        <button
                          id="reject-application-button"
                          onClick={() => handleReject(selectedApproval)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Reject
                        </button>
                        <button
                          id="requestinfo-application-button"
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
                      <h4 className="text-sm font-medium text-gray-400 pb-0.5">
                        Expertise Areas
                      </h4>
                      <p className="text-sm">
                        {selectedApproval.expertiseAreas
                          .map((area) => area.name)
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 pb-0.5">
                        Professional Experience
                      </h4>
                      <p className="text-sm">
                        {selectedApproval.professionExperience}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 pb-1">
                        Application Timeline
                      </h4>
                      <div>
                        <div className="space-y-2">
                          {[
                            ...(selectedApproval?.submissionDate
                              ? selectedApproval.submissionDate
                                  .split(",")
                                  .filter((date) => date.trim())
                                  .map((timestamp) => ({
                                    action: "Submitted",
                                    timestamp,
                                    content: null,
                                  }))
                              : []),
                            ...(selectedApproval.approvalDate
                              ? [
                                  {
                                    action: "Approved",
                                    timestamp: selectedApproval.approvalDate,
                                    content: null, // Explicitly set to null
                                  },
                                ]
                              : []),
                            ...(selectedApproval.rejectionReason
                              ? [
                                  {
                                    action: `Rejected: ${selectedApproval.rejectionReason}`,
                                    timestamp: selectedApproval.approvalDate,
                                    content: selectedApproval.rejectionReason,
                                  },
                                ]
                              : []),
                            ...(selectedApproval?.requestInfoDate
                              ? selectedApproval.requestInfoDate
                                  .split(",")
                                  .filter((date) => date.trim())
                                  .map((timestamp) => ({
                                    action: "Request Info",
                                    timestamp,
                                    content: selectedApproval.adminComments,
                                  }))
                              : []),
                          ]
                            .sort(
                              (a, b) =>
                                new Date(a.timestamp).getTime() -
                                new Date(b.timestamp).getTime()
                            )
                            .map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-sm pt-1"
                              >
                                <span
                                  className={`flex items-center justify-center w-5 h-5 rounded-full ${getActionColor(
                                    entry.action
                                  )} text-white text-xs font-medium`}
                                >
                                  {index + 1}
                                </span>
                                {entry.action.includes("Rejected") ||
                                entry.action === "Request Info" ? (
                                  <button
                                    type="button"
                                    className="text-blue-400 hover:underline bg-transparent border-none p-0 text-sm text-left"
                                    onClick={() =>
                                      handleShowDetails(
                                        entry.action,
                                        entry.content
                                      )
                                    }
                                    aria-label={
                                      entry.action.includes("Rejected")
                                        ? "View rejection reason"
                                        : "View admin notes"
                                    }
                                  >
                                    {entry.action} on {entry.timestamp}
                                  </button>
                                ) : (
                                  <span className="text-sm">
                                    {entry.action} on {entry.timestamp}
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                      <ExpandProfileSettings
                        title="Additional Profile"
                        additionalSettings={additionalSettingsContent}
                        isExpanded={isExpanded}
                        onToggle={() => setIsExpanded((prev) => !prev)}
                      />
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400">
                          Uploaded Documents
                        </h4>
                        <div className="space-y-2">
                          {selectedApproval.documents?.length > 0 ? (
                            selectedApproval.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between space-x-2 bg-gray-600 p-2 rounded-md hover:bg-gray-500 transition duration-150"
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText
                                    size={16}
                                    className="text-gray-300"
                                  />
                                  <span className="text-sm text-gray-300">
                                    PDF: {doc.fileName}
                                  </span>
                                </div>
                                <button
                                  id={`view-document-icon-${index}`}
                                  onClick={() =>
                                    handleViewDocument(
                                      doc.fileContent,
                                      doc.fileType
                                    )
                                  }
                                  className="text-blue-400 hover:text-blue-500"
                                  aria-label={`View document ${doc.fileName}`}
                                >
                                  <Eye size={20} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-300">
                              No documents provided.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">
                        Admin Notes
                      </h4>
                      <textarea
                        id="input-field-admin-notes"
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
      <CustomModal
        isOpen={openDocumentViewer}
        onClose={handleCloseDocumentViewer}
        title="View Document"
        size="xl"
      >
        {documentData && (
          <div className="w-full h-[70vh]">
            <embed
              src={`data:${documentData.fileType};base64,${documentData.fileContent}`}
              type={documentData.fileType}
              width="100%"
              height="100%"
            />
          </div>
        )}
      </CustomModal>
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {detailsContent.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {detailsContent.content || "No details provided."}
            </p>
            <div className="flex justify-end">
              <button
                id="close-details-modal-button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
                id="input-field-rejection-comment"
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
