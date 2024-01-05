import React from "react";
import classes from "./Comment.module.css";
import accountIcon from "../../assets/icons/Account.svg";
import { Link } from "react-router-dom";

const Comment = (props) => {
	return (
		<div className={classes["comment-container"]}>
			<div className={classes["comment-upper"]}>
				<img
					src={
						props.profilePic
							? `http://127.0.0.1:8000/media/${props.profilePic}`
							: accountIcon
					}
					className={classes["profile-image-home"]}
					alt="profile"
				/>
				<Link
					to={`/account/${props.profileId}`}
					className={classes["profile-data"]}
				>
					{props.firstName} {props.lastName}
					<br />
					<span className={classes["profile-username"]}>
						@{props.username}
					</span>
				</Link>
			</div>
			<div className={classes["comment-lower"]}>
				<p>{props.body}</p>
			</div>
		</div>
	);
};

export default Comment;
