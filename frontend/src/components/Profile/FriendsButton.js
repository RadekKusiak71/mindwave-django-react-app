import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./FriendsButton.module.css";
import AuthContext from "../../context/AuthContext";
import DisplayButton from "./DisplayButton";
import FriendsContext from "../../context/FriendsContext";

const FriendsButton = (props) => {
	const { user, authTokens } = useContext(AuthContext);
	const { createFriendsRequest, cancelRequest, acceptRequest, removeFriend } =
		useContext(FriendsContext);
	const [requestStatus, setRequestStatus] = useState(false);
	const [requestData, setRequestData] = useState(null);

	const checkIfRequested = useCallback(async () => {
		try {
			let response = await fetch(
				"http://127.0.0.1:8000/api/friends/check/",
				{
					method: ["POST"],
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						sender: user.profile_id,
						receiver: props.profileId,
					}),
				}
			);

			let data = await response.json();
			if (response.ok) {
				setRequestStatus(data.exists);
				if (data.request_data) {
					setRequestData(data.request_data);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, user.profile_id, props.profileId]);

	/* 
	1. check that if u are friends already
	2. check if profile you checking did not send you request already
	3. check if you did not send request

	- no one sends request ( you can send )
	- profile you checking send request you can accept or reject
	- you send request you can cancel

 */

	const checkIfFriends = () => {
		if (props.friendsArr.includes(user.profile_id)) {
			return ButtonDisplayer(false, "Remove friend", () =>
				removeFriend(props.profileId, user.profile_id)
			);
		} else {
			if (requestStatus) {
				if (requestData.sender === user.profile_id) {
					return ButtonDisplayer(false, "Cancel Request", () =>
						cancelRequest(requestData.id)
					);
				} else {
					return ButtonDisplayer(false, "Accept Request", () =>
						acceptRequest(requestData.id)
					);
				}
			} else {
				return ButtonDisplayer(false, "Send Request", () =>
					createFriendsRequest(user.profile_id, props.profileId)
				);
			}
		}
	};

	const ButtonDisplayer = (disabled, text, func) => {
		return <DisplayButton disabled={disabled} text={text} onClick={func} />;
	};

	useEffect(() => {
		checkIfRequested();
	}, [checkIfRequested]);

	return <div className={classes["profile-buttons"]}>{checkIfFriends()}</div>;
};

export default FriendsButton;
