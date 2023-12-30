import React from "react";
import classes from "./Post.module.css";
import chatIcon from "../../assets/icons/Chatbubble.svg";
import likeIcon from "../../assets/icons/Scrollup.svg";

const Post = (props) => {
	return (
		<div className={classes["post-container"]}>
			<div className={classes["post-form-data"]}>
				<img
					className={classes["profile-image-home"]}
					src={`http://127.0.0.1:8000/media/${props.profilePic}`}
					alt="profile"
				/>
				<p className={classes["profile-data"]}>
					{props.firstName} {props.lastName}
					<br />
					<span className={classes["profile-username"]}>
						@{props.username}
					</span>
				</p>
			</div>
			<div className={classes["post-body"]}>{props.postBody}</div>
			<div className={classes["post-reactions"]}>
				<button type="button" className={classes["post-react-button"]}>
					<img src={likeIcon} alt="like" /> {props.likesCount}
				</button>
				<button type="button" className={classes["post-react-button"]}>
					<img src={chatIcon} alt="comment" /> {props.commentsCount}
				</button>
			</div>
		</div>
	);
};

export default Post;
