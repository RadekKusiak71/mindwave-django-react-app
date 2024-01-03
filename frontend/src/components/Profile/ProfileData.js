import React, {
	useCallback,
	useContext,
	useLayoutEffect,
	useState,
} from "react";
import Notification from "../Notification/Notification";
import classes from "./ProfileData.module.css";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Card from "../../layout/Card";
import accountIcon from "../../assets/icons/Account.svg";
import FriendsButton from "./FriendsButton";
import Requests from "./Requests";
import FriendsContext from "../../context/FriendsContext";

const ProfileData = () => {
	const { userId } = useParams();
	const { authTokens, user } = useContext(AuthContext);
	const { message, clearMessage } = useContext(FriendsContext);

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
			} else {
				console.log(response);
			}
		} catch (err) {
			console.log(err);
		}
	}, [setProfile, userId, authTokens.access]);

	// Method to check if its client profile or other user ( for dispalying requests or add button)
	const checkIds = (userId) => {
		if (user.user_id === Number(userId)) {
			return <Requests />;
		} else {
			return (
				<FriendsButton
					profileId={profile.id}
					friendsArr={profile.friends}
				/>
			);
		}
	};

	useLayoutEffect(() => {
		fetchProfileData();
	}, [fetchProfileData]);

	return (
		<Card>
			{message && (
				<Notification errors={message} onClick={() => clearMessage()} />
			)}
			{profile && (
				<>
					<div className={classes["profile-data"]}>
						<div className={classes["upper-profile"]}>
							<img
								src={
									profile.profile_picture
										? `http://127.0.0.1:8000${profile.profile_picture}`
										: accountIcon
								}
								alt={`${profile.username}`}
								className={classes["profile-picture"]}
							/>
							<p className={classes["profile-name"]}>
								{profile.first_name} {profile.last_name}
								<span className={classes["profile-username"]}>
									@{profile.username}
								</span>
								<span className={classes["profile-bio"]}>
									{profile.bio}
								</span>
							</p>
						</div>
					</div>
					{checkIds(userId)}
				</>
			)}
		</Card>
	);
};

export default ProfileData;
