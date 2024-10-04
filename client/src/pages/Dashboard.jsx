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
    const [requests, setRequests] = useState([]); // USESTATE ARRAY FOR ENTRIES FROM DATABASE
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
                        console.log(currentRequest);
                            setRequests((requests) => {
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
                        });
                    });
                }
            ).catch(error => {
            })
        }
    }, [])

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
            employee_contact: sessionStorage.getItem("employeeEmail")
        }).then(
            response => { // IF FORM IS SUCCESSFULLY SUBMITTED CLEAR FORM
                // RESETS FORM
                setRequestType("maintenance");
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
                        response.data.forEach(currentRequest => {
                        // ADDS REQUESTS TO REQUEST USESTATE
                        console.log(currentRequest);
                            setRequests((requests) => {
                                return [...requests, { id: currentRequest.id, request_type: currentRequest.request_type, asset: currentRequest.asset, location: currentRequest.location, priority: currentRequest.priority, deadline:  currentRequest.deadline, request_description:  currentRequest.request_description, request_update: currentRequest.request_update, employee: currentRequest.employee, employee_contact: currentRequest.employee_contact, assigned: currentRequest.assigned, assigned_contact: currentRequest.assigned_contact, status: currentRequest.status }];
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
        <h2>Submit a Work Order Request <Link to="#" onClick={() => { setIsFormToggled(!isFormToggled); }}>[+]</Link></h2> 



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

<h2>View Work Order Requests <Link to="#" onClick={() => { setIsTableToggled(!isTableToggled); }}>[+]</Link></h2>
        { isTableToggled ?

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
            {requests.toReversed().map((request) => {
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
    </>
   }