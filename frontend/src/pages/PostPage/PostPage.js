import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./PostPage.module.css";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Post from "../../components/Post/Post";
import Card from "../../layout/Card";
import CommentForm from "../../components/Comments/CommentForm";
import Comment from "../../components/Comments/Comment";

const PostPage = () => {
	const { postId } = useParams();
	const { authTokens } = useContext(AuthContext);
	const [postData, setPostData] = useState(null);
	const [comments, setComments] = useState(null);

	const fetchPostComments = useCallback(async () => {
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/posts/${postId}/comments/`,
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
				console.log(data);
				setComments(data);
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, postId]);

	const fetchPost = useCallback(async () => {
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/posts/${postId}/`,
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
				setPostData(data);
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, postId]);

	useEffect(() => {
		fetchPost();
		fetchPostComments();
	}, [fetchPost, fetchPostComments]);

	return (
		<Card>
			<div className={classes["post-container"]}>
				{postData && (
					<Post
						key={postData.id}
						username={postData.profile_username}
						postId={postData.id}
						profilePic={postData.profile_picture}
						firstName={postData.profile_first_name}
						lastName={postData.profile_last_name}
						likesCount={postData.likes_count}
						commentsCount={postData.comments_count}
						createdDate={postData.created_date}
						postBody={postData.body}
						profileId={postData.profile}
						isLiked={postData.is_liked_by_user}
					/>
				)}
			</div>
			<div className={classes["comments-container"]}>
				<CommentForm />
			</div>
			<div className={classes["replies-container"]}>
				{comments &&
					comments.map((comment) => (
						<Comment
							key={comment.id}
							profilePic={comment.profile_picture}
							profileId={comment.profile}
							username={comment.profile_username}
							firstName={comment.profile_first_name}
							lastName={comment.profile_last_name}
							body={comment.body}
							createdDate={comment.created_date}
						/>
					))}
			</div>
		</Card>
	);
};

export default PostPage;
