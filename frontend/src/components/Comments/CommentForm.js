import React, { useContext, useState } from "react";
import classes from "./CommentForm.module.css";
import AuthContext from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const CommentForm = (props) => {
	const { postId } = useParams();

	const [body, setBody] = useState("");
	const { authTokens, user } = useContext(AuthContext);
	const bodyHandler = (e) => {
		setBody(e.target.value);
	};

	const createComment = async () => {
		try {
			let response = await fetch("http://127.0.0.1:8000/api/comments/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authTokens.access}`,
				},
				body: JSON.stringify({
					body: body,
					profile: user.profile_id,
					post: postId,
				}),
			});

			let data = await response.json();
			if (response.ok) {
				window.location.reload();
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const submitCommentForm = (e) => {
		e.preventDefault();
		createComment();
		setBody("");
	};

	return (
		<form onSubmit={submitCommentForm} className={classes["comment-form"]}>
			<textarea
				placeholder="Put you comment here!"
				value={body}
				onChange={bodyHandler}
			/>
			<button className={classes["comment-form-button"]} type="submit">
				Send
			</button>
		</form>
	);
};

export default CommentForm;
