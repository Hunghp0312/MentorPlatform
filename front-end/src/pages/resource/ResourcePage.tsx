import { useState } from "react";

const ResourcePage = () => {
  const [loading, setLoading] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  return <div>ResourcePage</div>;
};

export default ResourcePage;
