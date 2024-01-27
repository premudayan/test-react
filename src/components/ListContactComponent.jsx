import React, { useState, useMemo, useCallback, useEffect } from "react";
import { deleteContact, listContacts } from "../services/ContactService";
import { useNavigate } from "react-router-dom";

const ListContactComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const navigator = useNavigate();

  const shouldFetchData = useMemo(
    () => searchFirstName.length > 0 || searchLastName.length > 0,
    [searchFirstName, searchLastName]
  );

  const handleLoadPage = (targetPage) => {
  if (targetPage !== currentPage) {
      setPreviousPage(currentPage); 
      setCurrentPage(targetPage);
    }
  };
  
  const searchCustomer = () => {
    console.log("Inside searchCustomer");
    setTotalPages(0);
    setCurrentPage(0);
    setContacts([]);
    fetchContacts();
  };

  useEffect(() => {
    console.log("Inside useEffect");
    if (currentPage !== previousPage) {
      console.log("uEffect Calling fetchContacts");
      fetchContacts();
    }
  }, [currentPage, previousPage]);

  const fetchContacts = useCallback(async () => {
    console.log("Inside fetchContact - useCallback");
    try {
      if (!shouldFetchData) {
        setContacts([]);
        setTotalPages(0);
        return;
      }
      setLoading(true);
      console.log( `Going to get page ${ currentPage + 1 } of the list with page size ${pageSize} and search FN: ${searchFirstName} LN: ${searchLastName} ` );

      const response = await listContacts({
        firstName: searchFirstName,
        lastName: searchLastName,
        pageNumber: currentPage,
        pageSize: Math.min(100, Math.max(10, pageSize)),
      });

      // Log the received data to inspect dateOfBirth values
      console.log("Received data:", response.data);

      setContacts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchFirstName, searchLastName, pageSize, shouldFetchData])


  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10) || 10;
    setPageSize(Math.min(100, Math.max(10, newSize)));
  };

  function addNewCustomer() {
    navigator("/add-contact");
  }

  function updateContact(id) {
    navigator(`/edit-contact/${id}`);
  }

  function deleteContactAndUpdateList(id) {
    setError(null);
    deleteContact(id)
      .then((response) => {
        fetchContacts();
      })
      .catch((error) => {
        console.error(error);
        setError(
          error.message || "An error occurred while deleting the contact."
        );
      });
  }

  return (
    <div className="container">
      <h2 className="text-center">List of Contacts</h2>

      <form className="row g-3 mb-3 mt-3">
        <div className="col-md-6">
          <label htmlFor="searchFirstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control  form-control-sm"
            id="searchFirstName"
            onChange={(e) => setSearchFirstName(e.target.value)}
            value={searchFirstName}
            placeholder="Search by first name"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="searchLastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control  form-control-sm"
            id="searchLastName"
            onChange={(e) => setSearchLastName(e.target.value)}
            value={searchLastName}
            placeholder="Search by last name"
          />
        </div>
      </form>

      <button
        className="btn btn-primary btn-sm mb-2 mx-2"
        onClick={addNewCustomer}
      >
        Add Customer
      </button>
      <button className="btn btn-primary btn-sm mb-2" onClick={searchCustomer}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display the table structure with headers */}
      <table className="table table-striped table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Date of Birth</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            // Display the table rows if there are contacts
            contacts.map((contact) => (
              <tr key={contact.id}>
                <th scope="row">{contact.id}</th>
                <td>{contact.firstName}</td>
                <td>{contact.lastName}</td>
                <td>{contact.dateOfBirth}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm mx-3"
                    onClick={() => updateContact(contact.id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteContactAndUpdateList(contact.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            // Display a message if there are no contacts
            <tr>
              <td colSpan="4">No data available to display.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn btn-primary btn-sm mb-2 mx-2"
          onClick={() => handleLoadPage(currentPage - 1)}
          disabled={currentPage === 0 || loading}
        >
          Previous
        </button>
        <span className="col-form-label-sm">{`Page ${currentPage + 1} of ${totalPages}`}</span>
        <button
          className="btn btn-primary btn-sm mb-2 mx-2"
          onClick={() => handleLoadPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
        >
          Next
        </button>

        {/* Page size input field next to "Next" button */}
        <label className="col-form-label-sm mx-2" htmlFor="pageSize">Page Size: </label>
        <input
          className="form-control-sm"
          type="number"
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          placeholder="Enter Page Size (max 100)"
        />
      </div>
    </div>
  );
};

export default ListContactComponent;
