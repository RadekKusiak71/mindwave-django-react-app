import React, { useContext, useState } from "react";
import classes from "./AuthForm.module.css";
import Input from "../../layout/Input";
import Button from "../../layout/Button";
import Notification from "../Notification/Notification";
import AuthContext from "../../context/AuthContext";

const LoginForm = () => {
	const { loginUser, authErr, setAuthErr } = useContext(AuthContext);
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});

	const handleInputs = (e) => {
		let name = e.target.name;
		setLoginData((prevState) => ({
			...prevState,
			[name]: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		loginUser(loginData);
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
				<h1>Sign In</h1>
				<div className={classes["auth-form-inputs"]}>
					<Input
						type="text"
						placeholder="Username"
						onChange={handleInputs}
						name="username"
						value={loginData.username}
						disabled={false}
					/>
					<Input
						type="password"
						placeholder="Password"
						onChange={handleInputs}
						name="password"
						value={loginData.password}
						disabled={false}
					/>
				</div>
				<Button type="submit" buttonText="Sign In" />
			</form>
		</>
	);
};

export default LoginForm;
