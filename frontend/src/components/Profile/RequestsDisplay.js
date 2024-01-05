import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./RequestsDisplay.module.css";
import AuthContex from "../../context/AuthContext";
import FriendsContext from "../../context/FriendsContext";
import accountIcon from "../../assets/icons/Account.svg";
import { Link } from "react-router-dom";

const RequestResult = (props) => {
	const { acceptRequest, cancelRequest } = useContext(FriendsContext);

	// Button for accepting and rejecting
	const actionButton = (text, func) => {
		return (
			<button
				type="button"
				className={classes["request-func-button"]}
				onClick={() => func(props.requestId)}
			>
				{text}
			</button>
		);
	};

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className={classes["request-result"]}
		>
			<div className={classes["result-profile-data"]}>
				<img
					src={
						props.profilePicture
							? `http://127.0.0.1:8000${props.profilePicture}`
							: accountIcon
					}
					alt={props.username}
					className={classes["request-result-img"]}
				/>
				<Link to={`/account/${props.senderId}`}>{props.username}</Link>
			</div>
			<div className={classes["request-buttons"]}>
				{actionButton("accept", acceptRequest)}
				{actionButton("cancel", cancelRequest)}
			</div>
		</div>
	);
};

const RequestsDisplay = (props) => {
	const { user, authTokens } = useContext(AuthContex);
	const [requests, setRequests] = useState(null);
	const [err, setErr] = useState(null);

	const fetchUserRequests = useCallback(async () => {
		let response = await fetch(
			`http://127.0.0.1:8000/api/profiles/${user.username}/requests/`,
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
			setRequests(data);
		} else {
			setErr(data);
		}
	}, [setErr, setRequests, authTokens.access, user.username]);

	useEffect(() => {
		fetchUserRequests();
	}, [fetchUserRequests]);

	return (
		<div
			className={classes["requests-backdrop"]}
			onClick={() => props.openYourRequestsHandler()}
		>
			{requests &&
				requests.map((request) => (
					<RequestResult
						key={request.id}
						username={request.sender_username}
						profilePicture={requests.sender_profile_picture}
						requestId={request.id}
						senderId={request.sender_user_id}
					/>
				))}
			{err && <p>{err.detail}</p>}
		</div>
	);
};

export default RequestsDisplay;
