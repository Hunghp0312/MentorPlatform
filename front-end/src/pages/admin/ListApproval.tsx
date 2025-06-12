import React, { useEffect, useState } from "react";
import { Search, ClipboardList, FileText, Eye } from "lucide-react";
import { toast } from "react-toastify";
import DataTable, { DataColumn } from "../../components/table/CustomTable";
import InputCustom from "../../components/input/InputCustom";
import useDebounce from "../../hooks/usedebounce";
import { approvalService } from "../../services/approval.service";
import { handleAxiosError } from "../../utils/handlerError";
import { AxiosError } from "axios";
import { MentorUpdateStatusRequest } from "../../types/approval";
import {
  MentorCertification,
  MentorEducation,
  MentorWorkExperience,
  SupportingDocument,
} from "../../types/mentorapplication";
import CustomModal from "../../components/ui/Modal";
import ExpandProfileSettings from "../../components/feature/ExpandProfileSettings";
import DefaultImage from "../../assets/Profile_avatar_placeholder_large.png";
import SmallLoadingSpinner from "../../components/loading/SmallLoadingSpinner";
import { useSearchParams } from "react-router-dom";

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
  mentorWorkExperiences: MentorWorkExperience[];
  mentorCertifications: MentorCertification[];
  mentorEducations: MentorEducation[];
  professionExperience: string;
  applicationTimeline: string;
  documents: SupportingDocument[];
  status: string;
}

interface ExpertiseArea {
  name: string;
}

const ListApproval = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const [approvals, setApprovals] = useState<ApprovalType[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalType | null>(
    null
  );
  type ConfirmActionType = "approve" | "reject" | "requestInfo" | "underreview";
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(status || "");
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(
    null
  );
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [adminNotes, setAdminNotes] = useState("");
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
  const [isFetching, setIsFetching] = useState(false);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "request-info", label: "Request Info" },
  ];

  const fetchApplications = async () => {
    if (isFetching) {
      setIsFetching(true);
    }
    try {
      const statusToFilter: { [key: string]: number | undefined } = {
        "": undefined,
        pending: 1,
        approved: 3,
        rejected: 2,
        "request-info": 4,
      };
      const currentFilter = statusToFilter[statusFilter] || 0;

      const [applicationsResponse, countsResponse] = await Promise.all([
        approvalService.getAllMentorApplications(
          searchDebounced,
          currentFilter,
          pageIndex,
          pageSize
        ),
        approvalService.getApplicationStatusCount(),
      ]);

      setTotalItems(applicationsResponse.totalItems);
      setApprovals(applicationsResponse.items);

      setStatusCounts({
        "":
          countsResponse.rejected +
          countsResponse.approved +
          countsResponse.pending +
          countsResponse.requestInfo,
        pending: countsResponse.pending,
        approved: countsResponse.approved,
        rejected: countsResponse.rejected,
        "request-info": countsResponse.requestInfo,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching applications:", error);
        toast.error("Failed to fetch applications");
      }
    } finally {
      setIsFetching(false);
    }
  };

  const fetchApplicationDetail = async (mentorApplicationId: string) => {
    try {
      setIsLoading(true);
      const res = await approvalService.getMentorApplicationDetail(
        mentorApplicationId
      );

      setSelectedApproval({
        ...res,
        documents: res.documents.map((doc: SupportingDocument) => ({
          ...doc,
          documentContent: {
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileContent: doc.fileContent || "",
          },
        })),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching application detail:", error);
        toast.error("Failed to load application details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [pageIndex, pageSize, searchDebounced, statusFilter]);

  const handleViewDocument = (
    fileContent: string | undefined,
    fileType: string
  ) => {
    if (!fileContent) {
      toast.error("Error: File content is missing or empty.");
      return;
    }
    if (!fileType) {
      toast.error("Error: File type is missing.");
      return;
    }
    try {
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(fileContent);
      if (!isValidBase64) {
        toast.error("Error: Invalid Base64 string detected.");
        return;
      }
      setDocumentData({ fileContent, fileType });
      setOpenDocumentViewer(true);
    } catch {
      toast.error("Error: plsease try again.");
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

  const columns: DataColumn<ApprovalType>[] = [
    {
      header: "",
      accessor: (row) => {
        const getLatestDate = (dateString?: string) => {
          if (!dateString) return "";
          const dates = dateString
            .split(",")
            .filter((date) => date.trim())
            .map((date) => {
              const adjustedDate = new Date(date.trim());
              adjustedDate.setHours(adjustedDate.getHours() + 7);
              return adjustedDate;
            });

          if (dates.length === 0) return "";
          return new Date(Math.max(...dates.map((d) => d.getTime())))
            .toISOString()
            .split("T")[0];
        };

        let dateLabel = "";
        let dateValue = "";
        if (row.status === "Request Info" && row.requestInfoDate) {
          dateLabel = "Request Info";
          dateValue = getLatestDate(row.requestInfoDate);
        } else if (row.status === "Submitted" && row.submissionDate) {
          dateLabel = "Submission Date";
          dateValue = getLatestDate(row.submissionDate);
        } else if (row.status === "Under Review" && row.submissionDate) {
          dateLabel = "Submission Date";
          dateValue = getLatestDate(row.submissionDate);
        } else if (row.status === "Approved" && row.approvalDate) {
          dateLabel = "Approval Date";
          dateValue = row.approvalDate.split("T")[0];
        } else if (row.status === "Rejected" && row.approvalDate) {
          dateLabel = "Rejection Date";
          dateValue = row.approvalDate.split("T")[0];
        }

        return (
          <div className="flex items-center space-x-4">
            <img
              src={row.photoData || DefaultImage}
              alt={row.fullName}
              className="w-12.5 h-12.5 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-white mb-1.5">
                {row.fullName}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {row.expertiseAreas.map((area, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm mr-0.5"
                  >
                    {area.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center mt-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    row.status === "Submitted"
                      ? "bg-yellow-500"
                      : row.status === "Approved"
                      ? "bg-green-500"
                      : row.status === "Rejected"
                      ? "bg-red-500"
                      : row.status === "Request Info"
                      ? "bg-blue-500"
                      : row.status === "Under Review"
                      ? "bg-purple-500"
                      : "bg-gray-500"
                  }`}
                ></span>
                <span className="text-xs text-gray-400 capitalize">
                  {row.status}
                </span>
                {dateLabel && dateValue && (
                  <>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-xs text-gray-400">
                      {dateLabel}: {dateValue}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
      align: "left",
    },
  ];

  const HandleUnderRevie = (approval: ApprovalType) => {
    setSelectedApproval(approval);
    setConfirmAction("underreview");
    setIsConfirmModalOpen(true);
  };
  const handleApprove = (approval: ApprovalType) => {
    setSelectedApproval(approval);
    setConfirmAction("approve");
    setIsConfirmModalOpen(true);
  };

  const handleReject = (approval: ApprovalType) => {
    setSelectedApproval(approval);
    setConfirmAction("reject");
    setIsConfirmModalOpen(true);
  };

  const handleRequestInfo = () => {
    setConfirmAction("requestInfo");
    setIsConfirmModalOpen(true);
  };

  const confirmActions = async () => {
    if (!selectedApproval || !confirmAction) return;

    if (
      (confirmAction === "reject" || confirmAction === "requestInfo") &&
      !adminNotes.trim()
    ) {
      toast.error("Admin notes are required for this action.");
      setIsConfirmModalOpen(false);
      return;
    }

    setIsConfirmLoading(true);
    setIsConfirmModalOpen(false);
    toast.info("Wait a moment for update...");

    try {
      const statusIdMap: { [key in ConfirmActionType]: number } = {
        approve: 3,
        reject: 2,
        requestInfo: 4,
        underreview: 6,
      };

      const request: MentorUpdateStatusRequest = {
        mentorId: selectedApproval.applicantUserId,
        statusId: statusIdMap[confirmAction],
        adminComments:
          confirmAction === "reject" || confirmAction === "requestInfo"
            ? adminNotes.trim()
            : null,
      };

      await approvalService.updateMentorApplicationStatus(request);
      await fetchApplicationDetail(selectedApproval.applicantUserId);
      await fetchApplications();

      toast.success(
        `Application for ${selectedApproval.fullName} changed to ${confirmAction}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error(`Error during ${confirmAction}:`, error);
        toast.error(`Failed to ${confirmAction} application`);
      }
    } finally {
      setIsConfirmLoading(false);
      setAdminNotes("");
    }
  };

  const handleSelectApplicants = async (approval: ApprovalType) => {
    try {
      setIsLoading(true);
      await fetchApplicationDetail(approval.applicantUserId);
      setAdminNotes("");
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError(error);
      } else {
        console.error("Error fetching application detail:", error);
        toast.error("Failed to load application details");
      }
    } finally {
      setIsLoading(false);
    }
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

  const getActionColor = (action: string) => {
    if (action.includes("Approved")) return "bg-green-500";
    if (action.includes("Rejected")) return "bg-red-500";
    if (action.includes("Request Info")) return "bg-blue-500";
    return "bg-orange-500";
  };

  const additionalSettingsContent = (
    <div>
      <div>
        <h4 className="text-sm font-medium text-gray-400">Education(s)</h4>
        <div className="bg-gray-700 p-1 rounded-lg">
          {selectedApproval?.mentorEducations.length != 0 ? (
            selectedApproval?.mentorEducations.map((education, index) => (
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
          {selectedApproval?.mentorWorkExperiences.length != 0 ? (
            selectedApproval?.mentorWorkExperiences.map((experience, index) => (
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
                      {`${
                        new Date(experience.startDate).getMonth() + 1
                      }/${new Date(experience.startDate).getFullYear()}`}{" "}
                      –{" "}
                      {experience.endDate
                        ? `${
                            new Date(experience.endDate).getMonth() + 1
                          }/${new Date(experience.endDate).getFullYear()}`
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
          {selectedApproval?.mentorCertifications?.length != 0 ? (
            selectedApproval?.mentorCertifications.map((certificate, index) => (
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
    <main className="p-2 sm:p-4 container mx-auto max-w-7xl">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Mentor Applications</h2>
          <div className="flex flex-col gap-4 mb-6 pt-6 sm:flex-row sm:items-center">
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
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white sm:w-40"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageIndex(1);
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({statusCounts[option.value] || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-1/2">
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium">
                    {statusFilter === "pending"
                      ? "Applications Awaiting Review"
                      : statusFilter === "rejected"
                      ? "Rejected Applications"
                      : statusFilter === "approved"
                      ? "Approved Mentors"
                      : statusFilter === "request-info"
                      ? "Applications with Requested Info"
                      : "All Applications"}
                  </h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto pb-4">
                  {isFetching ? (
                    <div className="flex justify-center items-center h-[200px]">
                      <SmallLoadingSpinner />
                    </div>
                  ) : (
                    <DataTable
                      data={approvals}
                      columns={columns}
                      keyField="applicantUserId"
                      className="bg-gray-700"
                      rowClassName="p-4 hover:bg-gray-600 cursor-pointer transition duration-150 border-b border-gray-600 last:border-b-0"
                      cellClassName="p-0"
                      headerClassName="hidden"
                      emptyMessage="No applications available"
                      pagination={false}
                      onRowClick={handleSelectApplicants}
                    />
                  )}
                </div>
                {isFetching ? null : (
                  <div className="px-3 py-3 bg-gray-700 border-t border-gray-600">
                    <div>
                      <DataTable
                        data={approvals}
                        columns={[]}
                        keyField="applicantUserId"
                        pagination
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        pageIndex={pageIndex}
                        setPageIndex={setPageIndex}
                        totalItems={totalItems}
                        paginationClassName="pr-1 pl-1 flex items-center gap-4"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium">Application Details</h3>
                </div>
                {selectedApproval ? (
                  <div className="bg-gray-700 rounded-lg p-4 text-gray-300">
                    <div className="mb-4">
                      {["Submitted", "RequestInfo", "Under Review"].includes(
                        selectedApproval.status
                      ) && (
                        <div className="flex flex-wrap gap-2 mb-4 justify-end">
                          <button
                            id="approve-application-button"
                            onClick={() => handleApprove(selectedApproval)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex-shrink-0"
                          >
                            Approve
                          </button>
                          <button
                            id="reject-application-button"
                            onClick={() => handleReject(selectedApproval)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex-shrink-0"
                          >
                            Reject
                          </button>
                          <button
                            id="underreview-application-button"
                            onClick={() => HandleUnderRevie(selectedApproval)}
                            className="bg-yellow-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm flex-shrink-0"
                          >
                            Under Review
                          </button>
                          <button
                            id="requestinfo-application-button"
                            onClick={handleRequestInfo}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex-shrink-0"
                          >
                            Request Info
                          </button>
                        </div>
                      )}

                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={selectedApproval.photoData || DefaultImage}
                          alt={selectedApproval.fullName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white break-words">
                            {selectedApproval.fullName}
                          </h3>
                          <p className="text-sm text-gray-400 break-all">
                            {selectedApproval.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 pb-2.5">
                          Expertise Areas
                        </h4>
                        <p className="text-sm">
                          {selectedApproval.expertiseAreas.map(
                            (area, index) => (
                              <span
                                key={index}
                                className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm mr-2"
                              >
                                {area.name}
                              </span>
                            )
                          )}
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
                            {(() => {
                              const timelineEntries = [
                                ...(selectedApproval?.submissionDate
                                  ? selectedApproval.submissionDate
                                      .split(",")
                                      .filter((date) => date.trim())
                                      .map((timestamp) => {
                                        const adjustedDate = new Date(
                                          timestamp
                                        );
                                        adjustedDate.setHours(
                                          adjustedDate.getHours() + 7
                                        );
                                        return {
                                          action: "Submitted",
                                          timestamp:
                                            adjustedDate.toLocaleString(
                                              "en-US",
                                              {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                              }
                                            ),
                                          originalTimestamp: timestamp,
                                          content: null,
                                        };
                                      })
                                  : []),
                                ...(selectedApproval?.approvalDate
                                  ? selectedApproval?.rejectionReason !== null
                                    ? [
                                        {
                                          action: `Rejected `,
                                          timestamp: new Date(
                                            new Date(
                                              selectedApproval.approvalDate
                                            ).getTime() +
                                              7 * 60 * 60 * 1000
                                          ).toLocaleString("en-US", {
                                            month: "numeric",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                          }),
                                          originalTimestamp:
                                            selectedApproval.approvalDate,
                                          content:
                                            selectedApproval.rejectionReason,
                                        },
                                      ]
                                    : [
                                        {
                                          action: "Approved",
                                          timestamp: new Date(
                                            new Date(
                                              selectedApproval.approvalDate
                                            ).getTime() +
                                              7 * 60 * 60 * 1000
                                          ).toLocaleString("en-US", {
                                            month: "numeric",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                          }),
                                          originalTimestamp:
                                            selectedApproval.approvalDate,
                                          content: null,
                                        },
                                      ]
                                  : []),
                                ...(selectedApproval?.requestInfoDate
                                  ? selectedApproval.requestInfoDate
                                      .split(",")
                                      .filter((date) => date.trim())
                                      .map((timestamp) => {
                                        const adjustedDate = new Date(
                                          timestamp
                                        );
                                        adjustedDate.setHours(
                                          adjustedDate.getHours() + 7
                                        );
                                        return {
                                          action: "Request Info",
                                          timestamp:
                                            adjustedDate.toLocaleString(
                                              "en-US",
                                              {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                              }
                                            ),
                                          originalTimestamp: timestamp,
                                          content:
                                            selectedApproval.adminComments,
                                        };
                                      })
                                  : []),
                              ].filter(
                                (
                                  entry
                                ): entry is {
                                  action: string;
                                  timestamp: string;
                                  originalTimestamp: string;
                                  content: string | null;
                                } => entry.originalTimestamp != null
                              );

                              const requestInfoEntries = timelineEntries.filter(
                                (entry) => entry.action === "Request Info"
                              );
                              const latestRequestInfo =
                                requestInfoEntries.length
                                  ? requestInfoEntries.reduce((latest, entry) =>
                                      new Date(
                                        entry.originalTimestamp
                                      ).getTime() >
                                      new Date(
                                        latest.originalTimestamp
                                      ).getTime()
                                        ? entry
                                        : latest
                                    )
                                  : null;

                              return timelineEntries
                                .sort((a, b) => {
                                  const dateA = new Date(a.originalTimestamp);
                                  const dateB = new Date(b.originalTimestamp);
                                  return dateA.getTime() - dateB.getTime();
                                })
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
                                    (entry.action === "Request Info" &&
                                      latestRequestInfo &&
                                      entry.originalTimestamp ===
                                        latestRequestInfo.originalTimestamp &&
                                      !["rejected", "approved"].includes(
                                        selectedApproval?.status?.toLowerCase()
                                      )) ? (
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
                                ));
                            })()}
                          </div>
                        </div>
                        {selectedApproval && (
                          <ExpandProfileSettings
                            title="Additional Profile"
                            additionalSettings={additionalSettingsContent}
                            isExpanded={isExpanded}
                            onToggle={() => setIsExpanded((prev) => !prev)}
                          />
                        )}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
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
                                        doc.documentContent.fileContent,
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
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
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
                    {isLoading ? (
                      <SmallLoadingSpinner />
                    ) : (
                      <div className="flex flex-col items-center pb-2">
                        <ClipboardList size={40} className="text-gray-500" />
                        <p className="pt-3 text-[14px]">
                          Select an application to view details
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
      <CustomModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={detailsContent.title}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
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
      </CustomModal>
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={`Confirm ${
          confirmAction === "approve"
            ? "Approval"
            : confirmAction === "reject"
            ? "Rejection"
            : confirmAction === "requestInfo"
            ? "Request Info"
            : confirmAction === "underreview"
            ? "Under Review"
            : "Action"
        }`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to{" "}
            {confirmAction === "approve"
              ? "approve"
              : confirmAction === "reject"
              ? "reject"
              : confirmAction === "requestInfo"
              ? "request info for"
              : confirmAction === "underreview"
              ? "set to under review"
              : "perform action on"}{" "}
            the application for <strong>{selectedApproval?.fullName}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmActions()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
              disabled={isConfirmLoading}
            >
              {isConfirmLoading ? <SmallLoadingSpinner /> : "Confirm"}
            </button>
          </div>
        </div>
      </CustomModal>
    </main>
  );
};

export default ListApproval;
