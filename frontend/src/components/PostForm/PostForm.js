import React, { useContext, useState } from "react";
import classes from "./PostForm.module.css";
import closeIcon from "../../assets/icons/Close.svg";
import Notification from "../Notification/Notification";
import AuthConext from "../../context/AuthContext";
import accountIcon from "../../assets/icons/Account.svg";

const PostForm = (props) => {
	const [body, setBody] = useState("");
	const [err, setErr] = useState(null);
	const { authTokens, user, userData } = useContext(AuthConext);

	const handleFormClose = () => {
		props.closeForm(false);
	};

	const handleInput = (e) => {
		setBody(e.target.value);
	};

	const createPost = async () => {
		try {
			let response = await fetch("http://127.0.0.1:8000/api/posts/", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${authTokens.access}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ body: body }),
			});

			let data = await response.json();
			if (response.ok) {
				handleFormClose();
				window.location.reload();
			} else {
				setErr(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		if (body.trim().length > 3) {
			createPost();
		} else {
			setErr({ Body: "Body needs to be more than 3 characters lenght" });
		}
	};

	return (
		<>
			{err && <Notification errors={err} onClick={() => setErr(null)} />}
			<div
				className={classes["post-form-backdrop"]}
				onClick={() => handleFormClose()}
			>
				<form
					onSubmit={submitHandler}
					onClick={(e) => e.stopPropagation()}
					className={classes["post-form-container"]}
				>
					<div className={classes["post-form-user-data"]}>
						<div className={classes["post-form-data"]}>
							<img
								className={classes["profile-image-home"]}
								src={
									userData.profile_picture
										? `http://127.0.0.1:8000/${userData.profile_picture}`
										: accountIcon
								}
								alt="profile"
							/>
							<p className={classes["profile-data"]}>
								{user.username}
								<br />
								<span
									className={classes["profile-username"]}
								></span>
							</p>
						</div>
						<button
							type="button"
							onClick={() => handleFormClose()}
							className={classes["close-button"]}
						>
							<img src={closeIcon} alt="close" />
						</button>
					</div>
					<textarea
						onChange={handleInput}
						placeholder="What's on your mind right now?"
						className={classes["textarea-post"]}
					/>
					<button
						type="submit"
						className={classes["post-form-button"]}
					>
						Submit
					</button>
				</form>
			</div>
		</>
	);
};

export default PostForm;
