import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/contacts';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwcmVtQG1haWwuY29tIiwiaWF0IjoxNzA1OTQ3NDQ5LCJleHAiOjE3MDY1NTIyNDl9.6RaQeCQMO76h0lX3tsKhlJ2Me9d5DL9-RBC1brjKf0c';

export const listContacts = ({ firstName = '', lastName = '',  pageNumber = 0, pageSize = 10 }) => {
  const params = {
    firstName: firstName,
    lastName: lastName,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };

  const apiUrl = `${BASE_URL}/search?${new URLSearchParams(params).toString()}`;
  console.log(`API URL: ${apiUrl}`); // Log the API URL before making the call

  return axios.get(apiUrl, {
    headers: {'Authorization': `Bearer ${accessToken}`}
  });
};

export const createContact = ({ firstName , lastName , dateOfBirth }) => {
  const params = {
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth
  };

  const apiUrl = `${BASE_URL}`;
  console.log("Creating:",`API URL: ${apiUrl}`);
  console.log('Request Params:', params);
  return axios.post(apiUrl, params, { headers: {'Authorization': `Bearer ${accessToken}` } } );
};

export const getContact = ( id ) => {
  const apiUrl = `${BASE_URL}` + '/' + id;
  console.log("Getting:",`API URL: ${apiUrl}`);
  return axios.get(apiUrl, { headers: {'Authorization': `Bearer ${accessToken}` } } );
};

export const updateContact = ( {id, firstName , lastName , dateOfBirth} ) => {
  const params = {
    id: id,
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth
  };
  const apiUrl = `${BASE_URL}` + '/' + id;
  console.log("Updating:",`API URL: ${apiUrl}`);
  return axios.put(apiUrl, params, { headers: {'Authorization': `Bearer ${accessToken}` } } );
};

export const deleteContact = ( id ) => {

  const apiUrl = `${BASE_URL}` + '/' + id;
  console.log("Deleting:",`API URL: ${apiUrl}`);
  return axios.delete(apiUrl, { headers: {'Authorization': `Bearer ${accessToken}` } } );
};