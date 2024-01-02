import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./ProfileData.module.css";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const ProfileData = () => {
	const { userId } = useParams();
	const { authTokens } = useContext(AuthContext);
	const [profile, setProfile] = useState(null);

	const fetchProfileData = useCallback(async () => {
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/profiles/${userId}/`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
						"Content-Type": "application/json",
					},
				}
			);
			let data = await response.json();
			if (response.ok) {
				setProfile(data);
				console.log(data);
			} else {
				console.log(response);
			}
		} catch (err) {
			console.log(err);
		}
	}, [setProfile, userId, authTokens.access]);

	useEffect(() => {
		fetchProfileData();
	}, [fetchProfileData]);

	return (
		<div>
			<p>xd</p>
		</div>
	);
};

export default ProfileData;
