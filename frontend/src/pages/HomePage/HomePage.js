import React, { useContext, useState } from "react";
import Card from "../../layout/Card";
import classes from "./HomePage.module.css";
import PostForm from "../../components/PostForm/PostForm";
import AuthContext from "../../context/AuthContext";
import Post from "../../components/Post/Post";

const HomePage = () => {
	const [open, setOpen] = useState(false);
	const { user } = useContext(AuthContext);

	return (
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
				<Post />
			</div>
		</Card>
	);
};

export default HomePage;
