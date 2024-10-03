import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/workorder.css"; // CSS FOR WORKORDER FORM

export function WorkOrder() {

    const [requestType, setRequestType] = useState("maintenance");
    const [location, setLocation] = useState("");
    const [assetDescription, setAssetDescription] = useState("");
    const [priority, setPriority] = useState("low");
    const [preferredDate, setPreferredDate] = useState("");
    const [requestDescription, setRequestDescription] = useState("");
    const [isToggled, setIsToggled] = useState(false); // TOGGLES WORK ORDER FORM ON AND OFF. SEE LINES 49, 113

    function submitForm(e) {
        e.preventDefault();

        if(location === "" || assetDescription === "" || preferredDate === "" || requestDescription === "") {
            document.querySelector(".warning").style.visibility = "visible";
            return;
        }

        console.log("REQUEST TYPE: " + requestType + "\n" +
        "LOCATION: " + location + "\n" +
        "ASSET DESCRIPTION: " + assetDescription + "\n" +
        "PRIORITY LEVEL: " + priority + "\n" +
        "PREFERRED DEADLINE: " + preferredDate + "\n" +
        "REQUEST DESCRIPTION: " + requestDescription);

        // RESETS FORM
        setRequestType("maintenance");
        setLocation("");
        setAssetDescription("");
        setPriority("low");
        document.querySelector("#low").checked = true;
        setPreferredDate("");
        setRequestDescription("");

        document.querySelector(".warning").style.visibility = "hidden";
        setIsToggled(false);
    }

    return <>
            <h2>Submit a Work Order Request <Link to="#" onClick={() => { setIsToggled(!isToggled); }}>[+]</Link></h2> 



            { isToggled ? 
                
                <form id="form" className="form" onSubmit={(e)=>{submitForm(e);}}>
                <h2>Work Order Request</h2>

                <div className="form-control">
                <label htmlFor="request">Request Type</label>
                
                <select name="request" id="request" value={requestType} onChange={e => setRequestType(e.target.value)}>
                    <option value="maintenance">Maintenance</option>
                    <option value="it">Information Technology</option>
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
                            <input type="radio" id="low" value="low" name="priority" defaultChecked onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="low">Low</label>
                        </div>

                        <div>
                            <input type="radio" id="medium" value="medium" name="priority" onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="medium">Meduim</label>
                            </div>

                        <div>
                            <input type="radio" id="high" value="high" name="priority" onClick={e => setPriority(e.target.value)} />
                            <label htmlFor="high">High</label>
                        </div>

                        <div>
                            <input type="radio" id="emergency" value="emergency" name="priority" onClick={e => setPriority(e.target.value)} />
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

                <p className="warning" >Please Fill Out All Fields</p>
                
                <button>Submit</button>
            </form> 
            
            : null }
    </>
   }