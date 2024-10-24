import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"

export function Dashboard() {

    // FOR NAVIGATION
    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES

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
    const [requestDetails, setRequestDetails] = useState([]); // USE STATE FOR REQUEST DETAILS
    const [technicians, setTechnicians] = useState([]); // ARRAY TO HOLD MAINTENANCE/IT TECHNICIANS
    const [techUpdate, setTechUpdate] = useState("");
    const [statusUpdate, setStatusUpdate] = useState("");
    
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    // TOGGLES
    const [isFormToggled, setIsFormToggled] = useState(false);
    const [isPersonalToggled, setIsPersonalToggled] = useState(false); // PERSONAL VIEW FOR USER'S REQUESTS
    const [isNormalToggled, setIsNormalToggled] = useState(false); // NORMAL VIEW FOR MANAGERS/TECHNICIANS
    const [isDetailToggled, setIsDetailToggled] = useState(false); // DETAILED VIEW FOR USERS

    // FORM WARNING
    const [warningMessage, setWarningMessage] = useState("");

    // CLEARS THE FORM WARNING 
    useEffect(() => {
        if(isFormToggled) setWarningMessage("")
    }, [isFormToggled])

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
                            return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, created_on: currentRequest.created_on, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                        });
                    });
                }
            ).catch(error => {
            })

            // FILLS TECHNICIAN ARRAYS IF IT/MAINTENANCE MANAGER ACCOUNT
            if(sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "Maintenance" || sessionStorage.getItem("employeeDepartment") === "IT")) {
                // PULLS ALL EMPLOYEES FROM DATABASE
                    axios.get('http://localhost:3000/employees').then(
                        response => {
                            response.data.forEach(currentEmployee => {
                            // ADDS REQUESTS TO REQUEST USESTATE
                            if(currentEmployee.department === sessionStorage.getItem("employeeDepartment") && currentEmployee.position === "Employee") {
                                setTechnicians((employees) => {
                                    return [...employees, { name: currentEmployee.name, contact: currentEmployee.email }];
                                });
                            }
                        });
                    }
                ).catch(error => {
                })
            }
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
        
    // FUNCTION FOR ASSIGNING TECHNICIANS
    function assignTech(e, name, id) {
        e.preventDefault();
        let status;
        let contact;
        if(name === "Unassigned") {
            contact = "None";
            status = "Unassigned";
        } else {
            contact = customFilter(technicians, tech => tech.name === name)[0].contact;
            status = "Assigned";
        }

        axios.put(`http://localhost:3000/assign/${id}`,{
            assigned: name,
            assigned_contact: contact,
            status: status
        }).then(
            response => {
                // PULLS ALL REQUESTS FROM DATABASE
                axios.get('http://localhost:3000/requests').then(
                    response => {
                        setRequests([]);
                        response.data.forEach(currentRequest => {
                            // ADDS REQUESTS TO REQUEST USESTATE
                            setRequests((requests) => { // REFILLS ALL FORMS WITH MOST RESENT INFO AFTER CHANGE
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, created_on: currentRequest.created_on, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                            });
                            currentRequest.id === id ? setRequestDetails(currentRequest) : null; // RESETS DETAIL VISUALS AFTER CHANGE
                        });
                    }
                ).catch(error => {
                })
        }
        ).catch(error => {
        })
    }

    // FUNCTION FOR TECH UPDATE
    function tUpdate(e, id) {
        e.preventDefault();

        axios.put(`http://localhost:3000/update/${id}`,{
            status: statusUpdate,
            request_update: techUpdate
        }).then(
            response => {
                // PULLS ALL REQUESTS FROM DATABASE
                axios.get('http://localhost:3000/requests').then(
                    response => {
                        setRequests([]);
                        response.data.forEach(currentRequest => {
                            // ADDS REQUESTS TO REQUEST USESTATE
                            setRequests((requests) => { // REFILLS ALL FORMS WITH MOST RESENT INFO AFTER CHANGE
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, created_on: currentRequest.created_on,asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                            });
                            currentRequest.id === id ? setRequestDetails(currentRequest) : null; // RESETS DETAIL VISUALS AFTER CHANGE
                        });
                    }
                ).catch(error => {
                })
        }
        ).catch(error => {
        })

        setIsNormalToggled(true);
        setIsDetailToggled(false); 
    }

    // FUNCTION FOR VIEWING FORM DETAILS
    function openDetails(e, id) {
        e.preventDefault();

        const details = customFilter(requests, request => request.id === id)[0];
        setRequestDetails(details);
        setTechUpdate(details.request_update);
        setStatusUpdate(details.status);


        setIsFormToggled(false);
        setIsPersonalToggled(false);
        setIsNormalToggled(false);
        setIsDetailToggled(true); 
    }

    // FUNCTION FOR SUBMITTING FORM
    function submitForm(e) {
        e.preventDefault();

        if(location === "" || assetDescription === "" || preferredDate === "" || requestDescription === "") {
            setWarningMessage("Please Fill Out All Fields");
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
            created_on: new Date().toISOString().split('T')[0],
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
                setPriority("Low");
                document.querySelector("#low").checked = true;
                setPreferredDate("");
                setRequestDescription("");

                setWarningMessage("");
                setIsFormToggled(false);

                // PULLS ALL REQUESTS FROM DATABASE
                axios.get('http://localhost:3000/requests').then(
                    response => {
                        setRequests([]);
                        response.data.forEach(currentRequest => {
                            // ADDS REQUESTS TO REQUEST USESTATE
                            setRequests((requests) => {
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, created_on: currentRequest.created_on, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, employee_department: currentRequest.employee_department, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                            });
                        });
                    }
                ).catch(error => {
                })
        }).catch(error => { // IF FORM IS NOT SUCCESSFULLY SUBMITTED
            setWarningMessage("Form Submission Error: Please Try Again");
            return;
        })
    }

    return <>
    
        <div className="dashboard-container">
            <div className="sidebar">
            <div className="marketing">
                    <img src="/logo.png" />
                    <div>
                        <h1>Centurion</h1>
                        <small>Work Order Systems</small>
                    </div>
            </div>

            <nav>
            <h3>Welcome, {sessionStorage.getItem("employeeName")}</h3>
            <hr/>
                <ul>
                    <li>
                        <img src="/add.svg"/>
                        <Link to="#" onClick={() => { 
                        setIsNormalToggled(false);
                        setIsDetailToggled(false);
                        setIsPersonalToggled(false); 
                        setIsFormToggled(true); }}>Add Task Request</Link></li>

                    { // ALL EMPLOYEES CAN SEE THEIR OWN WORK ORDER REQUESTS
                    <li>
                        <img src="/list.svg" />
                        <Link to="#" onClick={() => { 
                        setIsFormToggled(false);
                        setIsNormalToggled(false);
                        setIsDetailToggled(false);
                        setIsPersonalToggled(true); 
                        setFilteredRequests(customFilter(requests, request => request.employee === sessionStorage.getItem("employeeName"))); 
                    }}>Your Task Requests</Link></li> 
                    }

                    { // NORMAL MANAGERS CAN SEE ALL THEIR DEPARTMENT WORK ORDER REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && sessionStorage.getItem("employeeDepartment") !== "IT" && sessionStorage.getItem("employeeDepartment") !== "Maintenance" ? <li><Link to="#" onClick={() => { 
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false); 
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(requests, request => request.employee_department === sessionStorage.getItem("employeeDepartment")));
                    }}>{ sessionStorage.getItem("employeeDepartment") 
                        } Department Task Requests</Link></li> : "" 
                    }

                    { // NORMAL IT/MAINTENANCE EMPLOYEES CAN SEE REQUESTS ASSIGNED TO THEM
                    sessionStorage.getItem("employeePosition") === "Employee" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link to="#" onClick={() => { 
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false); 
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(requests, request => request.assigned === sessionStorage.getItem("employeeName")));
                    }}>Assigned Tasks</Link></li> : "" 
                    }

                    { // IT/MAINTENANCE MANAGERS CAN SEE UNASSIGNED IT OR MAINTENANCE REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><img src="/user-x.svg" /><Link to="#" onClick={() => { 
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false);  
                        setIsNormalToggled(true); 
                        setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned === "Unassigned"));
                    }}> Unassigned { sessionStorage.getItem("employeeDepartment") } Tasks</Link></li> : "" 
                    }

                    { // IT/MAINTENANCE MANAGERS CAN ONLY SEE ASSIGNED IT OR MAINTENANCE REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><img src="/user-check.svg" /><Link to="#" onClick={() => { 
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false);  
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned !== "Unassigned"));
                    }}>Assigned { sessionStorage.getItem("employeeDepartment") } Tasks</Link></li> : "" 
                    }


                    <li><img src="/logout.svg" /><Link to="#" onClick={(e) => { e.preventDefault(e); sessionStorage.removeItem("employeeName"); sessionStorage.removeItem("employeePosition"); sessionStorage.removeItem("employeeEmail"); sessionStorage.removeItem("employeeDepartment"); navigate('/');}}>Log Out</Link></li>
                </ul>
            </nav>
        </div>
        
        <div className="dashboard-content">

            {
                // FORM SUBMISSION VIEW ---------------------------------------------------------------------------------------------------------
            }
            
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
                { warningMessage && <p id="form-warning" className="warning"> {warningMessage}</p> }
                <button>Submit</button>
            </form> 
            
            : null }


{
    // PERSONAL VIEW ---------------------------------------------------------------------------------
}


        { isPersonalToggled && filteredRequests.length > 0 ?

                <div className="grid">
                    <h2>My Requests</h2>
                    <div className="head">
                        <p>Assigned To</p>
                        <p>Description</p>
                        <p>Priority</p>
                        <p>Created On</p>
                        <p>Location</p>
                        <p>Status</p>
                        <p></p>
                    </div>
            {filteredRequests.toReversed().map((request) => {
                return (
                    <div className="body" key={request.id}>
                        { request.assigned === "Unassigned" ? <p style={{color: "gold"}}>Pending</p>: <p>{request.assigned}</p>}
                        <p>{request.request_description}</p>
                        {(()=>{
                            if(request.priority === "Low"){
                                return (
                                    <p style={{color: "green", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "Medium"){
                                return (
                                    <p style={{color: "yellow", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "High") {
                                return (
                                    <p style={{color: "coral", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else{
                                return (
                                    <p style={{color: "red", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            }

                        })()}
                        <p>{
                            new Date(request.created_on).toLocaleDateString('en-US', {  
                                month: '2-digit', 
                                day: '2-digit',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })
                        }</p>
                        <p>{request.location }</p>
                        <p>{request.status }</p>  
                        <button onClick={(e) =>{ openDetails(e, request.id)}}>Details</button>
                    </div>
                );
            })}
        </div>
        : null }

        { isPersonalToggled && filteredRequests.length === 0 ? <h2>There Are No Work Order Requests of This Type to Show</h2> : null }


{
    // NORMAL VIEW ---------------------------------------------------------------------------------
}


        { isNormalToggled && filteredRequests.length > 0 ?

                <div className="grid">
                    <h2>Work Order Requests</h2>
                    <div className="head">
                        <p>Created By</p>
                        <p>Description</p>
                        <p>Priority</p>
                        <p>Created On</p>
                        <p>Location</p>
                        <p>Status</p>
                        <p></p>
                    </div>
            {filteredRequests.toReversed().map((request) => {
                return (
                    <div className="body" key={request.id}>
                        <p>{request.employee}</p>
                        <p>{request.request_description}</p>
                        {(()=>{
                            if(request.priority === "Low"){
                                return (
                                    <p style={{color: "green", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "Medium"){
                                return (
                                    <p style={{color: "yellow", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "High") {
                                return (
                                    <p style={{color: "coral", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else{
                                return (
                                    <p style={{color: "red", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            }

                        })()}
                        <p>{
                            new Date(request.created_on).toLocaleDateString('en-US', {  
                                month: '2-digit', 
                                day: '2-digit',
                                year: 'numeric',
                                timeZone: 'UTC'
                            })
                         }</p>
                        <p>{request.location }</p>
                        <p>{request.status }</p>  
                        <button onClick={(e) =>{ openDetails(e, request.id)}}>Details</button>
                    </div>
                );
            })}
        </div>
        : null }

        { isNormalToggled && filteredRequests.length === 0 ? <h2>There Are No Work Order Requests of This Type to Show</h2> : null }

        {
            // DETAILED VIEW
        }

        { isDetailToggled ?
            <div className="details">
                <h2>Work Order Details</h2>
                
                { // ONLY EMPLOYEES THAT CREATE REQUESTS AND THE REQUEST HASN'T BEEN ASSIGNED CAN DELETE IT
                requestDetails.employee === sessionStorage.getItem("employeeName") && statusUpdate === "Unassigned" ? 
                <button onClick={(e)=>{
                    e.preventDefault()
                    axios.delete(`http://localhost:3000/delete-request/${requestDetails.id}`).then(
                        response => {
                            console.log(response);
                            let newRequestArray = [];
                            
                            requests.map((request => {
                                if(request.id !== requestDetails.id) {
                                    newRequestArray.push(request);
                                }
                            }));

                            setRequests(newRequestArray);
                        }
                    ).catch(error => {
                        console.log(error);
                    })
            
                    setIsDetailToggled(false);
                }}>Delete</button>
                : null }

                <p><strong>Work Order ID:</strong> {requestDetails.id}</p>
                <p><strong>Request Created On:</strong> {new Date(requestDetails.created_on).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        timeZone: 'UTC'
                    })}</p>
                <p><strong>Preferred Completion Date:</strong> {
                    new Date(requestDetails.deadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        timeZone: 'UTC'
                    })
                }</p>
                <p><strong>Asset:</strong> {requestDetails.asset}</p>
                <p><strong>Request Description:</strong> {requestDetails.request_description}</p>

                { 
                // ASSIGNED TECHNICIANS AND CHANGE THE STATUS OF WORK ORDER REQUESTS FROM ASSIGNED -> IN PROGRESS -> COMPLETE
                // THE ASSIGNED TECHNICIAN AND WRITE UPDATES TO WORK ORDERS, AND EVERYONE ELSE CAN JUST READ THE UPDATES
                    requestDetails.assigned === sessionStorage.getItem("employeeName") ?
                    <div>
                        <p><strong>Status:</strong></p>
                        <select defaultValue={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>
                    <p><strong>Technician Update:</strong></p>
                    <textarea value={ techUpdate === null ? "" : techUpdate } style={{resize: "none"}} onChange={e => setTechUpdate(e.target.value)}></textarea>
                    <button onClick={(e)=>{tUpdate(e, requestDetails.id)}}>Update</button>
                    </div>
                    : 
                    <div>
                        <p><strong>Status:</strong></p>
                        <p>{statusUpdate}</p>
                        <p><strong>Technician Update:</strong></p>
                        <p>{techUpdate}</p>
                    </div>
                }

                <p><strong>Created By:</strong> {requestDetails.employee} <strong>Contact Info:</strong> {requestDetails.employee_contact}</p>
                <p><strong>Task Priority:</strong> {requestDetails.priority}</p>
                <p><strong>Assigned To:</strong></p>
                {   // MANAGERS OF MAINTENANCE AND IT DEPARTMENTS CAN ASSIGN TASKS TO THEIR TECHNICIANS
                    sessionStorage.getItem("employeePosition") === "Manager" && sessionStorage.getItem("employeeDepartment") === requestDetails.request_type ? 
                    <select defaultValue={requestDetails.assigned} onChange={(e) => {assignTech(e, e.target.value, requestDetails.id)}}>
                        <option value="Unassigned">Unassigned</option>
                        {technicians.map((techs) => {
                        return (
                            <option key={techs.contact} value={techs.name}>{techs.name}</option>
                        );
                        })} 
                    </select> : <p>{requestDetails.assigned}</p>
                } 
                <p><strong>Contact Info:</strong></p> 
                <p>{requestDetails.assigned_contact}</p>
            </div>
        : null }
        </div>
        </div>
    </>
   }