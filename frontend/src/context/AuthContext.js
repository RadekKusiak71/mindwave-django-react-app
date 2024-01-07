import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
	const [authTokens, setAuthTokens] = useState(
		localStorage.getItem("authTokens")
			? JSON.parse(localStorage.getItem("authTokens"))
			: null
	);
	const [user, setUser] = useState(
		localStorage.getItem("authTokens")
			? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
			: null
	);
	const [authErr, setAuthErr] = useState();
	const navigate = useNavigate();
	const [userData, setUserData] = useState([]);

	const loginUser = async (formData) => {
		try {
			let response = await fetch("http://127.0.0.1:8000/api/token/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			let data = await response.json();
			if (response.ok) {
				// Setting authentication data ( user from decoded token and passing tokens to localstorage )
				setAuthTokens(data);
				localStorage.setItem("authTokens", JSON.stringify(data));
				let userProfileData = jwtDecode(data.access);
				setUser(userProfileData);
				navigate("/");
			} else {
				setAuthErr(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchUserDataLogin = async (id, access) => {
		let response = await fetch(
			`http://127.0.0.1:8000/api/profiles/${id}/`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${access}`,
					"Content-Type": "application/json",
				},
			}
		);
		let data = await response.json();
		console.log(data);
		if (response.ok) {
			setUserData(data);
		} else {
			logoutUser();
		}
	};

	const registerUser = async (formData) => {
		try {
			let response = await fetch("http://127.0.0.1:8000/api/profiles/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			let data = await response.json();
			if (response.ok) {
				navigate("/login");
			} else {
				setAuthErr(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const logoutUser = useCallback(() => {
		localStorage.removeItem("authTokens");
		setAuthTokens(null);
		setUser(null);
		navigate("/login");
	}, [setAuthTokens, setUser, navigate]);

	const authData = {
		user: user,
		authErr: authErr,
		setAuthErr: setAuthErr,
		authTokens: authTokens,
		loginUser: loginUser,
		registerUser: registerUser,
		logoutUser: logoutUser,
		userData: userData,
		fetchUserDataLogin: fetchUserDataLogin,
	};

	useEffect(() => {
		// Update tokens function can be changed into callback if needed
		const updateToken = async () => {
			try {
				let response = await fetch(
					"http://127.0.0.1:8000/api/token/refresh/",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ refresh: authTokens?.refresh }),
					}
				);
				let data = await response.json();
				if (response.ok) {
					setAuthTokens(data);
					setUser(jwtDecode(data.access));
					localStorage.setItem("authTokens", JSON.stringify(data));
				} else {
					setAuthErr(data);
					localStorage.removeItem("authTokens");
					logoutUser();
				}
			} catch (err) {
				console.log(err);
			}
		};

		let fiveMins = 1000 * 60 * 5;
		let interval = setInterval(() => {
			updateToken();
		}, fiveMins);

		return () => clearInterval(interval);
	}, [authTokens, logoutUser]);

	return (
		<AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
	);
};
