import React, { useState, useEffect, useRef } from "react";
import "../styles/workorder.css"; // CSS FOR WORKORDER FORM

export function WorkOrder() {

    return <> 
            <form id="form" className="form">
                <h2>Work Order Request</h2>

                <div className="form-control">
                <label htmlFor="request">Request Type</label>
                
                <select name="request" id="request">
                    <option value="maintenance">Maintenance</option>
                    <option value="it">Information Technology</option>
                </select>
                </div>

                <div className="form-control">
                    <label htmlFor="location" >Location</label>
                    <input type="text" id="location" placeholder="Enter the location of asset or item" />
                </div>

                <div className="form-control">
                    <label htmlFor="asset-description">Asset Description</label>
                    <input type="text" id="asset-description" placeholder="Enter Asset Name or Description" />
                </div>

                <div className="form-control">
                    <fieldset>
                        <legend>Select a Priority Level</legend>
                        <div>
                            <input type="radio" id="low" name="priority" />
                            <label htmlFor="low">Low</label>
                        </div>

                        <div>
                            <input type="radio" id="medium" name="priority" />
                            <label htmlFor="medium">Meduim</label>
                            </div>

                        <div>
                            <input type="radio" id="high" name="priority" />
                            <label htmlFor="high">High</label>
                        </div>

                        <div>
                            <input type="radio" id="emergency" name="priority" />
                            <label htmlFor="emergency">Emergency</label>
                        </div>
                    </fieldset>
                </div>

                <div className="form-control">
                    <label htmlFor="deadline">Preferred Deadline</label>
                    <input type="date" id="deadline" name="preferred-deadline" />
                </div>

                <div className="form-control">
                    <label htmlFor="request-description">Describe Your Request</label>
                    <textarea id="request-description" name="request-description" rows="5" placeholder="Describe the work that needs to be completed"></textarea>
                </div>

                <button>Submit</button>
            </form>
    </>
   }