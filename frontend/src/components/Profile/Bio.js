import React, { useContext, useState, useCallback, useEffect } from "react";
import classes from "./Bio.module.css";
import AuthContext from "../../context/AuthContext";

const Bio = (props) => {
	const { user, authTokens } = useContext(AuthContext);
	const [bio, setBio] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("bio", bio);
			let response = await fetch(
				`http://127.0.0.1:8000/api/profiles/${user.profile_id}/`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
					},
					body: formData,
				}
			);
			let data = await response.json();
			if (response.ok) {
				window.location.reload();
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleInput = (e) => {
		setBio(e.target.value);
	};

	const fetchUserData = useCallback(async () => {
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/profiles/${user.profile_id}/`,
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
				setBio(data.bio);
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, user.profile_id, setBio]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	return (
		<div
			className={classes["bio-backdrop"]}
			onClick={() => props.handleBioChangeOpen()}
		>
			<form
				onClick={(e) => e.stopPropagation()}
				onSubmit={handleSubmit}
				className={classes["bio-form"]}
			>
				<textarea
					onChange={handleInput}
					value={bio}
					className={classes["text-area-bio"]}
				/>
				<button type="submit">edit</button>
			</form>
		</div>
	);
};

export default Bio;
