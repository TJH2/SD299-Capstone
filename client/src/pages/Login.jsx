import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"
import '../styles-login.css'

export function Login() {

	const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
	const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
	
	const [employeeEmail, setEmployeeEmail] = useState(""); // HOLDS USERNAME VALUE OF USERNAME INPUT
	const [password, setPassword] = useState(""); // HOLDS PASSWORD VALUE OF PASSWORD INPUT
	const [account, setAccount] = useState({
		email: '',
		name: '',
		password: '',
		department: '',
		position: 'Employee'
	})
	
	const [isLog, setIsLog] = useState(true); // TO SWITCH BETWEEN LOGGING IN AND CREATING ACCOUNT
	const [warningMessage, setWarningMessage] = useState("")
	
	useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
		if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
			initialized.current = true
			const employee = sessionStorage.getItem("employeeName"); // CHECKS SESSION STORAGE FOR EMPLOYEE INFORMATION
			if(employee) { // IF SESSION STORAGE EXISTS, EMPLOYEE MUST BE LOGGED IN SO GO TO HOMEPAGE
				navigate('/dashboard');
			}
	}}, [])

	function HandleLogIn(e) { // LOG IN FUNCTION
		e.preventDefault()

			// AXIOS CALL TO SEE IF USERNAME IS IN OUR DATABASE
		axios.get('http://localhost:3000/employee', {
			params: {
					email: employeeEmail,
					password: password
				} 
		}).then(
			response => {
				setWarningMessage("");
				console.log(response.data[0][0]);
				sessionStorage.setItem("employeeName", response.data[0][0].name);
				sessionStorage.setItem("employeeDepartment", response.data[0][0].department);
				sessionStorage.setItem("employeePosition", response.data[0][0].position);
				sessionStorage.setItem("employeeEmail", response.data[0][0].email);
				navigate('/dashboard');    
		}).catch(error => { // IF USERNAME IS NOT FOUND
			setWarningMessage("The Information Provided Does Not Match Our Records")
			setPassword("");
			return;
		})
	}

	function HandleCreate(e) {
		e.preventDefault();

		const blankFields = Object.values(account).filter((field) => field === '');
		if (blankFields.length > 0) {
			setWarningMessage("All Form Fields Are Required");
		} else {
			axios.post('http://localhost:3000/new-employee', account)
				.then(response => {
					setWarningMessage("")
					console.log(response.data.account)
					//console.log(response.data[0][0]);
					sessionStorage.setItem("employeeName", account.name);
					sessionStorage.setItem("employeeDepartment", account.department);
					sessionStorage.setItem("employeePosition", account.position);
					sessionStorage.setItem("employeeEmail", account.email);
					navigate('/dashboard');    
			}).catch(error => { // IF ERROR CREATING ACCOUNT
				setWarningMessage("There Was An Unexpected Error Creating This Account")
				return;
			})
		}
	}

	function handleFormChange(bool) {
		if (warningMessage) setWarningMessage("");
		setIsLog(bool)
	}

	function handleInputChange(e) {
		setWarningMessage('')
		setAccount({
			...account,
			[e.target.name]: e.target.value
		})
	}

	return <div className="login-container">
		<div className="marketing">
				<img src="/logo.png" />
				<div>
					<h1 className="hr-lines">Centurion</h1>
					<small>Work Order Systems</small>
				</div>
		</div>
		
		{ isLog ? 
			<form className="form" onSubmit={(e)=>{HandleLogIn(e)}}>
					<h2>Log In Or <Link to="#" onClick={()=>{handleFormChange(false)}}>Create Account</Link></h2>
					{/* handling for form when user submits on sign in or log in */}
					<div className="form-control">
						<label htmlFor="employeeEmail">Employee Email</label>
						<input type="text" id="employeeEmail" value={employeeEmail} onChange={e => setEmployeeEmail(e.target.value)} maxLength={30} />
					</div>
					<div className="form-control">
					<label htmlFor="employeePass">Password</label>
					<input type="password" id="employeePass" value={password} onChange={e => setPassword(e.target.value)} maxLength={30} />
					</div>
					{ warningMessage && <p className="warning"> {warningMessage}</p> }
					
					<button>Log In</button>
			</form>
		: 
			<form className="form" onSubmit={(e)=>{HandleCreate(e)}}>
					<h2><Link to="#" onClick={()=>{handleFormChange(true)}}>Log In</Link> Or Create Account</h2>
					{/* handling for form when user submits on sign in or log in */}
					<div className="form-control">
						<label htmlFor="employeeName">Employee Name</label>
						<input 
							type="text" 
							id="employeeName" 
							name="name" 
							value={account.name} 
							onChange={handleInputChange} 
							maxLength={30} />
					</div>
					<div className="form-control">
						<label htmlFor="employeeEmail">Employee Email</label>
						<input 
							type="text" 
							id="employeeEmail" 
							name="email" 
							value={account.email} 
							onChange={handleInputChange} 
							maxLength={30} />
					</div>
					<div className="form-control">
						<label htmlFor="employeePass">Password</label>
						<input 
							type="password" 
							id="employeePass"
							name="password" 
							value={account.password} 
							onChange={handleInputChange} 
							maxLength={30} />
					</div>
					<div className="form-control">
						<label htmlFor="employeeDepartment">Department</label>
						<input 
							type="text" 
							id="employeeDepartment"
							name="department" 
							value={account.department} 
							onChange={handleInputChange} 
							maxLength={30} />
					</div>
					<div className="form-control">
						<label htmlFor="employeePosition">Position</label>
						<select 
							id="employeePosition"
							name="position" 
							value={account.position} 
							onChange={handleInputChange}>
								<option value="Employee">Employee</option>
								<option value="Technician">Technician</option>
								<option value="Manager">Manager</option>
						</select>  
					</div> 
					{ warningMessage && <p className="warning"> {warningMessage}</p> }
					<button>Create Employee</button>
			</form> 
		}
		</div>
	}