import React, { useCallback, useContext, useEffect, useState } from "react";
import Card from "../../layout/Card";
import classes from "./HomePage.module.css";
import PostForm from "../../components/PostForm/PostForm";
import AuthContext from "../../context/AuthContext";
import Post from "../../components/Post/Post";
import Notification from "../../components/Notification/Notification";

const HomePage = () => {
	const [open, setOpen] = useState(false);
	const [err, setErr] = useState(null);
	const [posted, setPosted] = useState(false);
	const [posts, setPosts] = useState([]);
	const { user, authTokens, userData, fetchUserDataLogin } =
		useContext(AuthContext);

	const fetchHomePosts = useCallback(async () => {
		try {
			let response = await fetch(
				"http://127.0.0.1:8000/api/posts/daily/",
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
				if (data.detail) {
					setPosts([]);
					setErr(data);
				} else {
					setPosts(data);
					setPosted(true);
				}
			} else {
				setErr(data);
			}
		} catch (err) {
			console.log(err);
		}
	}, [authTokens.access, setPosted, setPosts, setErr]);

	useEffect(() => {
		fetchHomePosts();
		if (authTokens.access) {
			fetchUserDataLogin(user.user_id, authTokens.access);
		}
	}, [fetchHomePosts, fetchUserDataLogin, user.user_id, authTokens.access]);

	return (
		<>
			{err && <Notification errors={err} onClick={() => setErr(null)} />}
			<Card>
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className={classes["post-form-open"]}
				>
					<img
						className={classes["profile-image-home"]}
						src={
							userData.profile_picture
								? `http://127.0.0.1:8000/${userData.profile_picture}/`
								: "xd"
						}
						alt="profile"
					/>
					<p>What are you thinking about?</p>
				</button>
				{open && (
					<PostForm
						fetchHomePosts={fetchHomePosts}
						closeForm={setOpen}
					/>
				)}

				<div className={classes["posts-home-container"]}>
					{posted && posts.length ? (
						posts.map((post) => (
							<Post
								key={post.id}
								username={post.profile_username}
								postId={post.id}
								profilePic={post.profile_picture}
								firstName={post.profile_first_name}
								lastName={post.profile_last_name}
								likesCount={post.likes_count}
								commentsCount={post.comments_count}
								createdDate={post.created_date}
								postBody={post.body}
								profileId={post.profile}
								isLiked={post.is_liked_by_user}
							/>
						))
					) : (
						<h1 style={{ textAlign: "center" }}>
							{posted
								? "No one has posted yet"
								: "You have to post to see others minds"}
						</h1>
					)}
				</div>
			</Card>
		</>
	);
};

export default HomePage;
