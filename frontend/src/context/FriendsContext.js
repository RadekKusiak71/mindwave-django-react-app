import React, { createContext } from "react";

const FriendsContext = createContext();
export default FriendsContext;

export const FriendsProvider = ({ children }) => {
	const createFriendsRequest = async () => {
		console.log("created request");
	};

	const cancelRequest = async () => {
		console.log("cancel request");
	};

	const deleteFriend = async () => {
		console.log("delete friends");
	};
	const acceptRequest = async () => {
		console.log("accept request");
	};

	const friendsData = {
		createFriendsRequest: createFriendsRequest,
		cancelRequest: cancelRequest,
		deleteFriend: deleteFriend,
		acceptRequest: acceptRequest,
	};
	return (
		<FriendsContext.Provider value={friendsData}>
			{children}
		</FriendsContext.Provider>
	);
};
