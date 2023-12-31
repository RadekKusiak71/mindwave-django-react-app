import React, { useContext, useState } from "react";
import classes from "./Post.module.css";
import chatIcon from "../../assets/icons/Chatbubble.svg";
import likeIcon from "../../assets/icons/Scrollup.svg";
import likedIcon from "../../assets/icons/ScrollupLike.svg";
import AuthContext from "../../context/AuthContext";

const Post = (props) => {
	const { authTokens } = useContext(AuthContext);

	const [post, setPostData] = useState({
		profilePic: props.profilePic,
		firstName: props.firstName,
		lastName: props.lastName,
		username: props.username,
		likesCount: props.likesCount,
		commentsCount: props.commentsCount,
	});

	const [isLiked, setIsLiked] = useState(props.isLiked);

	const likeButtonHandler = async () => {
		// optimistic update if response !ok it will go back to prev state
		setIsLiked(!isLiked);
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/posts/${props.postId}/like/`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
						"Content-Type": "application/json",
					},
				}
			);
			let data = await response.json();

			if (response.ok) {
				setPostData((prevData) => ({
					...prevData,
					likesCount: data.posts_likes,
				}));
			} else {
				setIsLiked(!isLiked);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={classes["post-container"]}>
			<div className={classes["post-form-data"]}>
				<img
					className={classes["profile-image-home"]}
					src={`http://127.0.0.1:8000/media/${post.profilePic}`}
					alt="profile"
				/>
				<p className={classes["profile-data"]}>
					{post.firstName} {post.lastName}
					<br />
					<span className={classes["profile-username"]}>
						@{post.username}
					</span>
				</p>
			</div>
			<div className={classes["post-body"]}>{props.postBody}</div>
			<div className={classes["post-reactions"]}>
				<button
					type="button"
					onClick={() => likeButtonHandler()}
					className={classes["post-react-button"]}
				>
					{isLiked ? (
						<img src={likedIcon} alt="like" />
					) : (
						<img src={likeIcon} alt="like" />
					)}
					{post.likesCount}
				</button>
				<button type="button" className={classes["post-react-button"]}>
					<img src={chatIcon} alt="comment" /> {post.commentsCount}
				</button>
			</div>
		</div>
	);
};

export default Post;
