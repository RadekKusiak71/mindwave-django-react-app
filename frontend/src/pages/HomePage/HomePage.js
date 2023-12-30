import React, { useContext, useEffect, useState } from "react";
import Card from "../../layout/Card";
import classes from "./HomePage.module.css";
import PostForm from "../../components/PostForm/PostForm";
import AuthContext from "../../context/AuthContext";
import Post from "../../components/Post/Post";
import Notification from "../../components/Notification/Notification";

const HomePage = () => {
	const [open, setOpen] = useState(false);
	const [err, setErr] = useState(null);
	const [posts, setPosts] = useState([]);
	const { user, authTokens } = useContext(AuthContext);

	useEffect(() => {
		const fetchHomePosts = async () => {
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
					}
					console.log(data);
				} else {
					setErr(data);
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchHomePosts();
	}, [authTokens.access]);

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
						src={`http://127.0.0.1:8000/media/${user.user_profile_picture}`}
						alt="profile"
					/>
					<p>What are you thinking about?</p>
				</button>
				{open && <PostForm closeForm={setOpen} />}

				<div className={classes["posts-home-container"]}>
					{posts.map((post) => (
						<Post
							key={post.id}
							username={post.profile_username}
							profilePic={post.profile_picture}
							firstName={post.profile_first_name}
							lastName={post.profile_last_name}
							likesCount={post.likes_count}
							commentsCount={post.comments_count}
							createdDate={post.created_date}
							postBody={post.body}
							profileId={post.profile}
						/>
					))}
				</div>
			</Card>
		</>
	);
};

export default HomePage;
