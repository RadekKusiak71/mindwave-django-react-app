import React, { useContext, useState } from "react";
import classes from "./AuthForm.module.css";
import Input from "../../layout/Input";
import Button from "../../layout/Button";
import AuthContext from "../../context/AuthContext";
import Notification from "../Notification/Notification";

const RegisterForm = () => {
	const { registerUser, authErr, setAuthErr } = useContext(AuthContext);

	const [registerData, setRegisterData] = useState({
		username: "",
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password2: "",
	});

	const handleInputs = (e) => {
		let name = e.target.name;
		setRegisterData((prevState) => ({
			...prevState,
			[name]: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		registerUser(registerData);
	};

	return (
		<>
			{authErr && (
				<Notification errors={authErr} onClick={() => setAuthErr()} />
			)}
			<form
				onSubmit={handleSubmit}
				className={classes["auth-form-container"]}
			>
				<h1>Register</h1>
				<div className={classes["auth-form-inputs"]}>
					<Input
						type="text"
						placeholder="Username"
						onChange={handleInputs}
						name="username"
						value={registerData.username}
						disabled={false}
					/>
					<Input
						type="text"
						placeholder="First name"
						onChange={handleInputs}
						name="first_name"
						value={registerData.first_name}
						disabled={false}
					/>
					<Input
						type="text"
						placeholder="Last name"
						onChange={handleInputs}
						name="last_name"
						value={registerData.last_name}
						disabled={false}
					/>
					<Input
						type="text"
						placeholder="Email"
						onChange={handleInputs}
						name="email"
						value={registerData.email}
						disabled={false}
					/>
					<Input
						type="password"
						placeholder="Password"
						onChange={handleInputs}
						name="password"
						value={registerData.password}
						disabled={false}
					/>
					<Input
						type="password"
						placeholder="Confirm Password"
						onChange={handleInputs}
						name="password2"
						value={registerData.password2}
						disabled={false}
					/>
				</div>
				<Button type="submit" buttonText="Sign Up" />
			</form>
		</>
	);
};

export default RegisterForm;
