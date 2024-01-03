import React, { createContext, useContext, useState } from "react";
import AuthContext from "./AuthContext";

const FriendsContext = createContext();
export default FriendsContext;

export const FriendsProvider = ({ children }) => {
	const friendsEndpointUrl = "http://127.0.0.1:8000/api/friends";
	const { authTokens } = useContext(AuthContext);
	const [message, setMessage] = useState(null);

	const createFriendsRequest = async (senderId, receiverId) => {
		let response = await fetch(`${friendsEndpointUrl}/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authTokens.access}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sender: senderId, receiver: receiverId }),
		});

		let data = await response.json();

		if (response.ok) {
			window.location.reload();
		} else {
			setMessage(data);
		}
		console.log("created request");
	};

	const cancelRequest = async (requestId) => {
		let response = await fetch(`${friendsEndpointUrl}/${requestId}/`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${authTokens.access}`,
				"Content-Type": "application/json",
			},
		});
		let data = await response.json();

		if (response.ok) {
			window.location.reload();
		} else {
			setMessage(data);
		}
		console.log("created request");
	};

	const acceptRequest = async (requestId) => {
		let response = await fetch(`${friendsEndpointUrl}/accept/`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authTokens.access}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ request_id: requestId }),
		});
		let data = await response.json();

		if (response.ok) {
			window.location.reload();
		} else {
			setMessage(data);
		}
		console.log("created request");
	};

	const removeFriend = async (receiverId, senderId) => {
		let response = await fetch(`${friendsEndpointUrl}/remove/`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${authTokens.access}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				sender_id: senderId,
				receiver_id: receiverId,
			}),
		});
		let data = await response.json();

		if (response.ok) {
			window.location.reload();
		} else {
			setMessage(data);
		}
		console.log("created request");
	};

	const clearMessage = () => {
		setMessage(null);
	};

	const friendsData = {
		createFriendsRequest: createFriendsRequest,
		cancelRequest: cancelRequest,
		removeFriend: removeFriend,
		acceptRequest: acceptRequest,
		message: message,
		clearMessage: clearMessage,
	};

	return (
		<FriendsContext.Provider value={friendsData}>
			{children}
		</FriendsContext.Provider>
	);
};
