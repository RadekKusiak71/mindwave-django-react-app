import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./FriendsButton.module.css";
import AuthContext from "../../context/AuthContext";
import DisplayButton from "./DisplayButton";

const FriendsButton = (props) => {
	const { user } = useContext(AuthContext);
	const [requested, setRequested] = useState(false);
	const { authTokens } = useContext(AuthContext);

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
				setRequested(data.exists);
				console.log(data);
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, user.profile_id, props.profileId]);

	const checkIfFriends = () => {
		if (props.friendsArr.includes(user.profile_id)) {
			return <DisplayButton disabled={false} text="Delete Friend" />;
		} else {
			if (requested) {
				return <DisplayButton disabled={false} text="Cancel Request" />;
			} else {
				return <DisplayButton disabled={false} text="Send Request" />;
			}
		}
	};

	useEffect(() => {
		checkIfRequested();
	}, [checkIfRequested]);
	return <div className={classes["profile-buttons"]}>{checkIfFriends()}</div>;
};

export default FriendsButton;
