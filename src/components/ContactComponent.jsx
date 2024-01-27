import React, {useEffect, useState} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from 'date-fns';
import { createContact, getContact, updateContact } from '../services/ContactService';
import { useNavigate, useParams } from 'react-router-dom';

const ContactComponent = () => {
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const[dateOfBirth, setDateOfBirth] = useState('');
    const[enteredDateOfBirth, setEnteredDateOfBirth] = useState(null);

    const {id} = useParams();
    const [errors, setErrors] = useState({ firstName:'', lastName:'', dateOfBirth: '' })
    const [error, setError] = useState(null);
    const navigator = useNavigate();

    useEffect(() => {
        getContact(id).then((response) => {
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setDateOfBirth(response.data.dateOfBirth );
            setEnteredDateOfBirth(parse(response.data.dateOfBirth, 'yyyy-MM-dd', new Date()));
        } ).catch( error => {
            console.error(error);
        })
    }, [id]);

      function saveContact(e) {
        e.preventDefault();
        if ( validateForm() ){
            if (id) {
                const contact = {id:id, firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth};
                console.log( "here 3:", contact);
                updateContact(contact).then((response) => {
                    console.log(response.data);
                    navigator('/');
                }).catch(error => { 
                    console.error("Error:", error);
                    if (error.response && error.response.data && error.response.data.violations) {
                      const firstViolation = error.response.data.violations[0];
                      const detailedMessage = firstViolation ? firstViolation.message : 'An error occurred while updating contact.';
                      console.log("Detailed error message:", detailedMessage);
                      setError(detailedMessage);
                    } else {
                      setError('An unexpected error occurred.');
                    }
                });
            }else {
                const contact = {firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth};
                createContact(contact).then((response) => {
                    console.log(response.data);
                    navigator('/');
                }).catch(error => { 
                    console.log("Error response data:", error.response.data);

                    if (error.response) {
                        setError( error.response.data);
                      } else {
                        setError('An unexpected error occurred.');
                      }
                });
            }
        }
      }

      const handleDateChange = (date) => {
        setEnteredDateOfBirth(date); 
        // Convert and update the date in the format required by the API
        setDateOfBirth(date ? format(date, 'yyyy-MM-dd') : null);
      };

    function validateForm() {
        let valid = true;
        const errorsCopy = {... errors};
        if (firstName.trim() ){
            errorsCopy.firstName = '';
        } else {
            errorsCopy.firstName = 'First name is required.'
            valid = false;
        }

        if (lastName.trim() ){
            errorsCopy.lastName = '';
        } else {
            errorsCopy.lastName = 'Last name is required.'
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle() {
        if ( id ) {
            return <h2 className='text-center'>Update Employee</h2>
        } else {
            return <h2 className='text-center'>Add Employee</h2>
        }
    }

  return (
    <div>
        <div className="container">
            <br /> <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    {
                        pageTitle()
                    }
                    <div className="card-body">
                        <div className="form-group mb-2">
                            <label htmlFor='firstName' className="form-label">First Name:</label>
                            <input type="text" placeholder='Enter First Name' name='firstName' 
                                    value={firstName} 
                                    className={`form-control ${errors.firstName ? 'is-invalid': ''}`} 
                                    onChange={(e) => setFirstName( e.target.value) } />
                                    {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor='lastName' className="form-label">Last Name:</label>
                            <input type="text" placeholder='Enter Last Name' name='lastName' 
                                    value={lastName} 
                                    className={`form-control ${errors.lastName ? 'is-invalid': ''}`} 
                                    onChange={(e) => setLastName(e.target.value)} />
                                    {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor='dateOfBirth' className="form-label">Date of Birth:</label>
                            <DatePicker placeholder='Enter Date of Birth' name='dateOfBirth' 
                                    selected={enteredDateOfBirth} className='form-control' 
                                    dateFormat='MM/dd/yyyy' 
                                    onChange={handleDateChange} />
                        </div>
                        <button className="btn btn-success" onClick={saveContact}>Save</button>
                    </div>
                    {error && <div className='alert alert-danger'>{error}</div>}

                </div>
            </div>
        </div>
        
    </div>
  )
}

export default ContactComponent