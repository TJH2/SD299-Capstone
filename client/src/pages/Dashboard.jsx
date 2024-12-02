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
    const [fP, setFP] = useState("")
    const [fS, setFS] = useState("")
    const [fOption, setFOption] = useState(null) // THE OPTION THAT DETERMINES WHICH FILTER IS BEING USED
    const [requests, setRequests] = useState([]); // USESTATE ARRAY ALL REQUESTS IN THE DATABASE
    const [filteredRequests, setFilteredRequests] = useState([]); // USESTATE ARRAY FOR FILTERED REQUESTS
    const [requestDetails, setRequestDetails] = useState([]); // USE STATE FOR REQUEST DETAILS
    const [technicians, setTechnicians] = useState([]); // ARRAY TO HOLD MAINTENANCE/IT TECHNICIANS
    const [message, setMessage] = useState("");
    
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    // TOGGLES
    const [isFormToggled, setIsFormToggled] = useState(true);
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
                            if(currentEmployee.department === sessionStorage.getItem("employeeDepartment") && currentEmployee.position === "Technician") {
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
    function messageUpdater(e, id, oldMessages) {
        e.preventDefault();

        if(message === "") {
            return;
        }

        //PREVENTS NULL ATTACHMENT ON FIRST MESSAGE
        if(oldMessages === null) {
            oldMessages = "";
        }
        
        document.getElementsByClassName(".request-messages").scrollTop = 0;

        const newMessage = "~" + sessionStorage.getItem("employeeName") + " (" + new Date().toLocaleDateString('en-US') + "): " + message;


        axios.put(`http://localhost:3000/update-message/${id}`,{
           message: newMessage + oldMessages
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

        setMessage("");
    }

    // FUNCTION FOR TECH UPDATE
    function statusUpdater(e, id, status) {
        e.preventDefault();

        axios.put(`http://localhost:3000/update-status/${id}`,{
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
    }

    // FUNCTION FOR VIEWING FORM DETAILS
    function openDetails(e, id) {
        e.preventDefault();

        const details = customFilter(requests, request => request.id === id)[0];
        setRequestDetails(details);


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

                alert("Your Request Has Been Submitted");

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

    function superFilter(e) {
        e.preventDefault();

        let tempR = []

        if(fOption === 1) { // USERS FILTER THEIR OWN REQUESTS
            tempR = customFilter(requests, request => request.employee === sessionStorage.getItem("employeeName"));
        } else if(fOption === 2) {
            tempR = customFilter(requests, request => request.employee_department === sessionStorage.getItem("employeeDepartment"));
        } else if(fOption === 3) {
            tempR = customFilter(requests, request => request.assigned === sessionStorage.getItem("employeeName"));
        } else if(fOption === 4) {
            tempR = customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned === "Unassigned");
        } else if(fOption === 5) {
            tempR = customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned !== "Unassigned");
        }


        if(fP !== "") {
            tempR = customFilter(tempR, request => request.priority === fP);
        }
        if(fS !== "") {
            tempR = customFilter(tempR, request => request.status === fS);
        }

        setFilteredRequests(tempR)
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
                        
                        <Link className="link" to="#" onClick={() => { 
                        setIsNormalToggled(false);
                        setIsDetailToggled(false);
                        setIsPersonalToggled(false); 
                        setIsFormToggled(true); }}><img src="/add.svg"/>Create a Task Request</Link></li>

                    { // ALL EMPLOYEES CAN SEE THEIR OWN WORK ORDER REQUESTS
                    <li>
                        <Link className="link" to="#" onClick={() => {
                        setFOption(1);
                        setFP("");
                        setFS(""); 
                        setIsFormToggled(false);
                        setIsNormalToggled(false);
                        setIsDetailToggled(false);
                        setIsPersonalToggled(true); 
                        setFilteredRequests(customFilter(requests, request => request.employee === sessionStorage.getItem("employeeName"))); 
                    }}><img src="/list.svg" />Your Task Requests</Link></li> 
                    }

                    { // NORMAL MANAGERS CAN SEE ALL THEIR DEPARTMENT WORK ORDER REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && sessionStorage.getItem("employeeDepartment") !== "IT" && sessionStorage.getItem("employeeDepartment") !== "Maintenance" ? <li><Link className="link" to="#" onClick={() => {
                        setFOption(2);
                        setFP("");
                        setFS("");   
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false); 
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(requests, request => request.employee_department === sessionStorage.getItem("employeeDepartment")));
                    }}><img src="/department.svg" />{ sessionStorage.getItem("employeeDepartment") 
                        } Department Task Requests</Link></li> : "" 
                    }

                    { // NORMAL IT/MAINTENANCE TECHNICIANS CAN SEE REQUESTS ASSIGNED TO THEM
                    sessionStorage.getItem("employeePosition") === "Technician" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link className="link" to="#" onClick={() => {
                        setFOption(3);
                        setFP("");
                        setFS("");   
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false); 
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(requests, request => request.assigned === sessionStorage.getItem("employeeName")));
                    }}><img src="/task.svg" />Assigned Tasks</Link></li> : "" 
                    }

                    { // IT/MAINTENANCE MANAGERS CAN SEE UNASSIGNED IT OR MAINTENANCE REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link className="link" to="#" onClick={() => {
                        setFOption(4);
                        setFP("");
                        setFS("");   
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false);  
                        setIsNormalToggled(true); 
                        setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned === "Unassigned"));
                    }}><img src="/user-x.svg" /> Unassigned { sessionStorage.getItem("employeeDepartment") } Tasks</Link></li> : "" 
                    }

                    { // IT/MAINTENANCE MANAGERS CAN ONLY SEE ASSIGNED IT OR MAINTENANCE REQUESTS
                    sessionStorage.getItem("employeePosition") === "Manager" && (sessionStorage.getItem("employeeDepartment") === "IT" || sessionStorage.getItem("employeeDepartment") === "Maintenance") ? <li><Link className="link" to="#" onClick={() => {
                        setFOption(5);
                        setFP("");
                        setFS("");   
                        setIsFormToggled(false);
                        setIsPersonalToggled(false);
                        setIsDetailToggled(false);  
                        setIsNormalToggled(true);
                        setFilteredRequests(customFilter(customFilter(requests, request => request.request_type === sessionStorage.getItem("employeeDepartment")), request => request.assigned !== "Unassigned"));
                    }}><img src="/user-check.svg" />Assigned { sessionStorage.getItem("employeeDepartment") } Tasks</Link></li> : "" 
                    }


                    <li><Link className="link" to="#" onClick={(e) => { e.preventDefault(e); sessionStorage.removeItem("employeeName"); sessionStorage.removeItem("employeePosition"); sessionStorage.removeItem("employeeEmail"); sessionStorage.removeItem("employeeDepartment"); navigate('/');}}><img src="/logout.svg" />Log Out</Link></li>
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
                    <option value="IT">IT</option>
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
                    <div className="reqFilter">
                        <label>Priority:</label>
                        <select defaultValue={fP} onChange={e => setFP(e.target.value)}>
                            <option value="">All</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        <label>Status:</label>
                        <select defaultValue={fS} onChange={e => setFS(e.target.value)}>
                            <option value="">All</option>
                            <option value="Unassigned">Unassigned</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                        </select>
                        <button onClick={(e)=>{superFilter(e)}}>Filter</button>
                    </div>
                    <div className="head">
                        <p>Request ID</p>
                        <p>Assigned Tech</p>
                        <p>Asset</p>
                        <p>Priority</p>
                        <p>Created On</p>
                        <p>Status</p>
                        <p></p>
                    </div>
            {filteredRequests.toReversed().map((request) => {
                return (
                    <div className="body" key={request.id}>
                        <p>#{request.id}</p>
                        { request.assigned === "Unassigned" ? <p style={{color: "GoldenRod", fontWeight: "bold"}}>Pending</p>: <p>{request.assigned}</p>}
                        <p>{request.asset}</p>
                        {(()=>{
                            if(request.priority === "Low"){
                                return (
                                    <p style={{color: "YellowGreen", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "Medium"){
                                return (
                                    <p style={{color: "GoldenRod", fontWeight: "bold"}}>{request.priority}</p>
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
                        <p>{request.status }</p>  
                        <button onClick={(e) =>{ openDetails(e, request.id)}}>Details</button>
                    </div>
                );
            })}
        </div>
        : null }

        { isPersonalToggled && filteredRequests.length === 0 ? 
        <div className="grid">
            <h2>My Requests</h2>
            <div className="reqFilter">
            <label>Priority:</label>
                <select defaultValue={fP} onChange={e => setFP(e.target.value)}>
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                </select>
                <label>Status:</label>
                <select defaultValue={fS} onChange={e => setFS(e.target.value)}>
                    <option value="">All</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                </select>
                <button onClick={(e)=>{superFilter(e)}}>Filter</button>
            </div>
            <h3>There Are No Work Order Requests of This Type to Show</h3>
        </div> : null }


{
    // NORMAL VIEW ---------------------------------------------------------------------------------
}


        { isNormalToggled && filteredRequests.length > 0 ?

                <div className="grid">
                    <h2>Work Order Requests</h2>
                    <div className="reqFilter">
                        <label>Priority:</label>
                        <select defaultValue={fP} onChange={e => setFP(e.target.value)}>
                            <option value="">All</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        { fOption === 4 ? null : <>
                        <label>Status:</label>
                        <select defaultValue={fS} onChange={e => setFS(e.target.value)}>
                            <option value="">All</option>
                            { fOption === 3 || fOption === 5 ? null : <option value="Unassigned">Unassigned</option> }
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                        </select></>
                        }
                        <button onClick={(e)=>{superFilter(e)}}>Filter</button>
                    </div>
                    <div className="head">
                        <p>Request ID</p>
                        <p>Created By</p>
                        <p>Asset</p>
                        <p>Priority</p>
                        <p>Created On</p>
                        <p>Status</p>
                        <p></p>
                    </div>
            {filteredRequests.toReversed().map((request) => {
                return (
                    <div className="body" key={request.id}>
                        <p>#{request.id}</p>
                        <p>{request.employee}</p>
                        <p>{request.asset}</p>
                        {(()=>{
                            if(request.priority === "Low"){
                                return (
                                    <p style={{color: "YellowGreen", fontWeight: "bold"}}>{request.priority}</p>
                                )
                            } else if(request.priority === "Medium"){
                                return (
                                    <p style={{color: "GoldenRod", fontWeight: "bold"}}>{request.priority}</p>
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
                        <p>{request.status }</p>  
                        <button onClick={(e) =>{ openDetails(e, request.id)}}>Details</button>
                    </div>
                );
            })}
        </div>
        : null }

        { isNormalToggled && filteredRequests.length === 0 ? 
        <div className="grid">
            <h2>My Requests</h2>
            <div className="reqFilter">
            <label>Priority:</label>
                <select defaultValue={fP} onChange={e => setFP(e.target.value)}>
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                </select>
                { fOption === 4 ? null : <>
                    <label>Status:</label>
                    <select defaultValue={fS} onChange={e => setFS(e.target.value)}>
                        <option value="">All</option>
                        { fOption === 3 || fOption === 5 ? null : <option value="Unassigned">Unassigned</option> }
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select></>
                }
                <button onClick={(e)=>{superFilter(e)}}>Filter</button>
            </div>
            <h3>There Are No Work Order Requests of This Type to Show</h3>
        </div> : null }

        {
            // DETAILED VIEW
        }

        { isDetailToggled ?
            <div className="details">
                <div className="details-title"><strong>Work Order Details</strong></div>
                <div>
                { // ONLY MANAGERS OR EMPLOYEES THAT CREATE REQUESTS (AND THE REQUEST HASN'T BEEN ASSIGNED) CAN DELETE IT
                (requestDetails.employee === sessionStorage.getItem("employeeName") && requestDetails.status === "Unassigned") ||  sessionStorage.getItem("employeePosition") === "Manager" ? 
                <button className="delete-request" onClick={(e)=>{
                    e.preventDefault()
                    if(confirm("Are You Sure You Want to Delete This Work Order Request?")) {
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
                    }

                }}>Delete</button>
                : <span className="delete-request"></span> }
                <button style={{marginLeft: "5px", padding: "0px 20px"}} onClick={
                    (e)=> {
                        e.preventDefault()
                        setIsDetailToggled(false);
                        fOption == 1 ? setIsPersonalToggled(true): setIsNormalToggled(true)
                    }
                }>Back</button>
                </div>
                
                
                <div className="date-details">    
                    <div className="request-id"><p><strong>ID # </strong>{requestDetails.id}</p></div>
                    <div>
                        <span><strong>Requested On</strong></span>
                        <span className="date"> {new Date(requestDetails.created_on).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                timeZone: 'UTC'
                                
                            })}
                        </span>                        
                    </div>
                    <div>
                        <span><strong>Preferred Completion By</strong></span>
                        {(()=>{
                            // LETTING PEOPLE KNOW IF COMPLETION DATE IS APPROACHING
                            const currentDate = new Date();
                            const completionDate = new Date(requestDetails.deadline);
                            const dateDifference = completionDate.getTime() - currentDate.getTime();
                            const dayDiff = Math.round(dateDifference / (1000 * 3600 * 24));
                            const displayDate = completionDate.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                timeZone: 'UTC'
                            })

                            if(dayDiff > 5){ // GREATER THAN 5 DAYS AWAY
                                return (
                                    <span className="date" style={{color: "YellowGreen"}}>{displayDate}</span>
                                )
                            } else if(dayDiff > 3){ // GREATER THAN 3 DAYS AWAY
                                return (
                                    <span className="date" style={{color: "GoldenRod"}}>{displayDate}</span>
                                )
                            } else if(dayDiff > 0) { // GREATER THAN 0 DAYS AWAY
                                return (
                                    <span className="date" style={{color: "coral"}}>{displayDate}</span>
                                )
                            } else{ // 0 DAYS OR PAST DUE
                                return (
                                    <span className="date" style={{color: "red"}}>{displayDate}</span>
                                )
                            }
                        })()}
                    </div>
                </div>
                    
                <div className="asset-details">
                    <p><strong>Asset</strong></p>
                    {requestDetails.asset}
                </div>
                   

                <div className="description-details">     
                    <p><strong>Request Description</strong></p>
                    {requestDetails.request_description}    
                </div>
                    
                    
                { 
                // ASSIGNED TECHNICIANS AND CHANGE THE STATUS OF WORK ORDER REQUESTS FROM ASSIGNED -> IN PROGRESS -> COMPLETE
                // THE ASSIGNED TECHNICIAN AND WRITE UPDATES TO WORK ORDERS, AND EVERYONE ELSE CAN JUST READ THE UPDATES
                    requestDetails.assigned === sessionStorage.getItem("employeeName") ?
                    <>
                        <div className="status-details">
                            <p><strong>Status</strong></p>
                            <select defaultValue={requestDetails.status} onChange={e => statusUpdater(e, requestDetails.id, e.target.value)}>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>
                    </>
                    : 
                    <>
                        <div className="status-details">
                        <p><strong>Status</strong></p>
                            {requestDetails.status}
                        </div>
                    </>
                    }

                    <div className="tech-update">
                        <p><strong>Work Order Messages</strong></p>
                        <div className="request-messages">
                        {(()=>{

                            const conversation = requestDetails.request_update;

                            if (conversation === null) {
                                return;
                            }

                            let messages1 = conversation.split("~");
                            messages1.shift();
                            let messages2 = [];

                            for (let i = 0; i < messages1.length; i++){
                                messages2.push(messages1[i].split(":"));
                            }

                            return (
                                <>
                                  {messages2.map((message, index) => (
                                    <div key={index}>
                                    <p><strong>{message[0]}:</strong> {message[1]}</p>
                                    <br/>
                                    </div>
                                  ))}
                                </>
                              );
                        })()}
                        </div>
                        <textarea rows="5" resize="none" placeholder="Add A Message To This Work Order" onChange={e => setMessage(e.target.value)} value={message}></textarea>
                        <button onClick={(e) => {messageUpdater(e, requestDetails.id, requestDetails.request_update);} }>Send Message</button>
                    </div>
                
                    <div className="created-by-details">
                        <p><strong>Created By</strong></p>
                        <p>{requestDetails.employee}</p> 
                        <p>{requestDetails.employee_contact}</p>
                    </div>

                    <div className="priority-details">
                        <p><strong>Task Priority</strong></p>
                        {(()=>{
                            if(requestDetails.priority === "Low"){
                                return (
                                    <p style={{color: "YellowGreen", fontWeight: "bold"}}>{requestDetails.priority}</p>
                                )
                            } else if(requestDetails.priority === "Medium"){
                                return (
                                    <p style={{color: "GoldenRod", fontWeight: "bold"}}>{requestDetails.priority}</p>
                                )
                            } else if(requestDetails.priority === "High") {
                                return (
                                    <p style={{color: "coral", fontWeight: "bold"}}>{requestDetails.priority}</p>
                                )
                            } else{
                                return (
                                    <p style={{color: "red", fontWeight: "bold"}}>{requestDetails.priority}</p>
                                )
                            }

                        })()}
                    </div>
                   
                
                <div className="assignment-details">
                <p><strong>Assigned To</strong></p>
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
                { requestDetails.assigned != "Unassigned" ? <p>{requestDetails.assigned_contact}</p> : null }
                </div>
            </div>
        : null }
        </div>
        </div>
    </>
   }