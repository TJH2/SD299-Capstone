import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
import "../styles/dashboard.css"; // STYLING FOR DASHBOARD PAGE
import "../styles/workorder.css"; // CSS FOR WORKORDER FORM
import "../styles/requesttable.css"; // CSS FOR WORKORDER FORM

export function Dashboard() {

    // WORK ORDER REQUEST FORM
    const [requestType, setRequestType] = useState("Maintenance");
    const [location, setLocation] = useState("");
    const [assetDescription, setAssetDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [preferredDate, setPreferredDate] = useState("");
    const [requestDescription, setRequestDescription] = useState("");

    // REQUEST TABLE
    const [requests, setRequests] = useState([]); // USESTATE ARRAY ALL REQUESTS IN THE DATABASE
    const [filteredRequests, setFilteredRequests] = useState([]); // USESTATE ARRAY FOR FILTERED REQUESTS
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    // TOGGLES
    const [isFormToggled, setIsFormToggled] = useState(false);
    const [isTableToggled, setIsTableToggled] = useState(false);

    // POPULATES REQUEST TABLE
    useEffect(() => {

        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true

        // PULLS ALL REQUESTS FROM DATABASE
        axios.get('http://localhost:3000/requests').then(
                response => {
                    response.data.forEach(currentRequest => {
                        // ADDS REQUESTS TO REQUEST USESTATE
                        setRequests((requests) => {
                            return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                        });
                    });
                }
            ).catch(error => {
            })
        }
    }, [])

    const customFilter = (arr, predicate) => {
        return arr.reduce((acc, item) => {
            if (predicate(item)) {
                acc.push(item);
             }
            return acc;
        }, []);
    };
        

    // FUNCTION FOR SUBMITTING FORM
    function submitForm(e) {
        e.preventDefault();

        if(location === "" || assetDescription === "" || preferredDate === "" || requestDescription === "") {
            document.querySelector(".warning").style.visibility = "visible";
            document.querySelector("#form-warning").innerText = "Please Fill Out All Fields";
            return;
        }

        console.log("REQUEST TYPE: " + requestType + "\n" +
        "LOCATION: " + location + "\n" +
        "ASSET DESCRIPTION: " + assetDescription + "\n" +
        "PRIORITY LEVEL: " + priority + "\n" +
        "PREFERRED DEADLINE: " + preferredDate + "\n" +
        "REQUEST DESCRIPTION: " + requestDescription);

        // AXIOS CALL TO SEE IF USERNAME IS IN OUR DATABASE
        axios.post('http://localhost:3000/new-request', {
            request_type: requestType,
            asset: assetDescription,
            location: location,
            priority: priority,
            deadline: preferredDate,
            request_description: requestDescription,
            employee: sessionStorage.getItem("employeeName"),
            employee_contact: sessionStorage.getItem("employeeEmail"),
            employee_department: sessionStorage.getItem("employeeDepartment")
        }).then(
            response => { // IF FORM IS SUCCESSFULLY SUBMITTED CLEAR FORM
                // RESETS FORM
                setRequestType("Maintenance");
                setLocation("");
                setAssetDescription("");
                setPriority("low");
                document.querySelector("#low").checked = true;
                setPreferredDate("");
                setRequestDescription("");

                document.querySelector(".warning").style.visibility = "hidden";
                setIsFormToggled(false);

                // PULLS ALL REQUESTS FROM DATABASE
                axios.get('http://localhost:3000/requests').then(
                    response => {
                        setRequests([]);
                        response.data.forEach(currentRequest => {
                            // ADDS REQUESTS TO REQUEST USESTATE
                            setRequests((requests) => {
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                            });
                        });
                    }
                ).catch(error => {
                })

                return;
        }).catch(error => { // IF FORM IS NOT SUCCESSFULLY SUBMITTED
            document.querySelector(".warning").style.visibility = "visible";
            document.querySelector("#form-warning").innerText = "Form Submission Error: Please Try Again"
            return;
        })
    }


    return <>
        <h2>Welcome, {sessionStorage.getItem("employeeName")}</h2>
        <nav>
            <ul>
                <li><Link to="#" onClick={() => { setIsTableToggled(false); setIsFormToggled(!isFormToggled); }}>Make A Work Order Request</Link></li>

                { // ALL EMPLOYEES CAN SEE THEIR OWN WORK ORDER REQUESTS
                <li><Link to="#" onClick={() => { 
                    setIsFormToggled(false);
                    setIsTableToggled(true); setFilteredRequests(customFilter(requests, request => request.employee === sessionStorage.getItem("employeeName"))); 
                }}>Your Work Order Requests</Link></li> 
                }

                { // NORMAL MANAGERS CAN SEE ALL THEIR DEPARTMENT WORK ORDER REQUESTS
                sessionStorage.getItem("employeePosition") === "Manager" && sessionStorage.getItem("employeeDepartment") !== "IT" && sessionStorage.getItem("employeeDepartment") !== "Maintenance" ? <li><Link to="#" onClick={() => { 
                    setIsFormToggled(false);
                    setIsTableToggled(true);
                    setFilteredRequests(customFilter(requests, request => request.employee_department === sessionStorage.getItem("employeeDepartment")));
                }}>{ sessionStorage.getItem("employeeDepartment") 
                    } Department Work Order Requests</Link></li> : "" 
                }

                { // NORMAL IT/MAINTENANCE EMPLOYEES CAN SEE REQUESTS ASSIGNED TO THEM
                sessionStorage.getItem("employeePosition") === "Employee" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link to="#" onClick={() => { 
                    setIsFormToggled(false);
                    setIsTableToggled(true);
                    setFilteredRequests(customFilter(requests, request => request.assigned === sessionStorage.getItem("employeeName")));
                }}>Assigned Work Order Requests</Link></li> : "" 
                }

                { // IT/MAINTENANCE MANAGERS CAN SEE UNASSIGNED IT OR MAINTENANCE REQUESTS
                sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link to="#" onClick={() => { 
                    setIsFormToggled(false); 
                    setIsTableToggled(true); 
                    setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned === "Unassigned"));
                }}> Unassigned { sessionStorage.getItem("employeeDepartment") } Work Order Requests</Link></li> : "" 
                }

                { // IT/MAINTENANCE MANAGERS CAN ONLY SEE ASSIGNED IT OR MAINTENANCE REQUESTS
                sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link to="#" onClick={() => { 
                    setIsFormToggled(false); 
                    setIsTableToggled(true);
                    setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned !== "Unassigned"));
                }}>Assigned { sessionStorage.getItem("employeeDepartment") } Work Order Requests</Link></li> : "" 
                }


                <li><Link to="#" onClick={() => {sessionStorage.removeItem("employeeName"); sessionStorage.removeItem("employeePosition"); sessionStorage.removeItem("employeeEmail"); sessionStorage.removeItem("employeeDepartment"); navigate('/');}}>Log Out</Link></li>
            </ul>
        </nav>

            { isFormToggled ? 
                
                <form id="form" className="form" onSubmit={(e)=>{submitForm(e);}}>
                <h2>Work Order Request</h2>

                <div className="form-control">
                <label htmlFor="request">Request Type</label>
                
                <select name="request" id="request" value={requestType} onChange={e => setRequestType(e.target.value)}>
                    <option value="Maintenance">Maintenance</option>
                    <option value="IT">Information Technology</option>
                </select>
                </div>

                <div className="form-control">
                    <label htmlFor="asset-description">Asset Description</label>
                    <input type="text" id="asset-description" placeholder="Enter Asset Name or Description" value={assetDescription} onChange={e => setAssetDescription(e.target.value)}/>
                </div>

                <div className="form-control">
                    <label htmlFor="location" >Location</label>
                    <input type="text" id="location" placeholder="Enter the location of asset or item" value={location} onChange={e => setLocation(e.target.value)}/>
                </div>

                <div className="form-control">
                    <fieldset>
                        <legend>Select a Priority Level</legend>
                        <div>
                            <input type="radio" id="low" value="Low" name="priority" defaultChecked onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="low">Low</label>
                        </div>

                        <div>
                            <input type="radio" id="medium" value="Medium" name="priority" onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="medium">Meduim</label>
                            </div>

                        <div>
                            <input type="radio" id="high" value="High" name="priority" onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="high">High</label>
                        </div>

                        <div>
                            <input type="radio" id="emergency" value="Emergency" name="priority" onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="emergency">Emergency</label>
                        </div>
                    </fieldset>
                </div>

                <div className="form-control">
                    <label htmlFor="deadline">Preferred Deadline</label>
                    <input type="date" id="deadline" name="preferred-deadline" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}/>
                </div>

                <div className="form-control">
                    <label htmlFor="request-description">Describe Your Request</label>
                    <textarea id="request-description" name="request-description" rows="5" placeholder="Describe the work that needs to be completed" value={requestDescription} onChange={e => setRequestDescription(e.target.value)}></textarea>
                </div>

                <p id="form-warning" className="warning" >Please Fill Out All Fields</p>
                
                <button>Submit</button>
            </form> 
            
            : null }


        { isTableToggled && filteredRequests.length > 0 ?

        <table style={{border: "2px black solid"}}>
            <thead>
                <tr>
                    <th>Request Type</th>
                    <th>Asset</th>
                    <th>Requester</th>
                    <th>Email</th>
                    <th>Assigned</th>
                    <th>Email</th>
                    <th>Preferred Deadline</th>
                    <th>Priority</th>
                    <th>Status</th>
                </tr>
            </thead>
            {filteredRequests.toReversed().map((request) => {
                return (
                    <tbody key={request.id} style={{border: "2px black solid"}}>
                        <tr>
                            <td>{request.request_type}</td>
                            <td>{request.asset}</td>
                            <td>{request.employee}</td>
                            <td>{request.employee_contact}</td>
                            <td>{request.assigned }</td>
                            <td>{request.assigned_contact }</td>
                            <td>{request.deadline }</td> 
                            <td>{request.priority }</td>
                            <td>{request.status }</td>
                        </tr>
                        <tr>
                            <td colSpan={9} className="request-description"><strong>Description: </strong>{request.request_description}</td>
                        </tr>
                    </tbody>
                );
            })}
        </table>
        : null }

        { isTableToggled && filteredRequests.length === 0 ? <h2>There Are No Work Order Requests of This Type to Show</h2> : null }

    </>
   }
