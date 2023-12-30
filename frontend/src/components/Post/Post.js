import React from "react";
import classes from "./Post.module.css";
import chatIcon from "../../assets/icons/Chatbubble.svg";
import likeIcon from "../../assets/icons/Scrollup.svg";

const Post = () => {
	return (
		<div className={classes["post-container"]}>
			<div className={classes["post-form-data"]}>
				<img
					className={classes["profile-image-home"]}
					src="./x.jpg"
					alt="profile"
				/>
				<p className={classes["profile-data"]}>
					Radoslaw Kusiak
					<br />
					<span className={classes["profile-username"]}>@admin</span>
				</p>
			</div>
			<div className={classes["post-body"]}>loremipsum</div>
			<div className={classes["post-reactions"]}>
				<button type="button" className={classes["post-react-button"]}>
					<img src={likeIcon} alt="like" /> 350
				</button>
				<button type="button" className={classes["post-react-button"]}>
					<img src={chatIcon} alt="comment" /> 360
				</button>
			</div>
		</div>
	);
};

export default Post;
