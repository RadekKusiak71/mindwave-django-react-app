import React, { useContext, useState } from "react";
import classes from "./ProfileImageSettings.module.css";
import AuthContext from "../../context/AuthContext";

const ProfileImageSettings = (props) => {
	const [file, setFile] = useState(null);
	const { user, authTokens } = useContext(AuthContext);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	const handleFileDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files.length > 0) {
			setFile(e.dataTransfer.files[0]);
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleProfilePictureChange = async (e) => {
		e.preventDefault();
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/profiles/${user.profile_id}/`,
				{
					method: "OPTIONS",
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ profile_picture: file }),
				}
			);
			let data = await response.json();
			if (response.ok) {
				console.log(data);
			} else {
				console.log(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			onClick={() => props.handleChangeImageOpen()}
			className={classes["profile-image-settings-backdrop"]}
		>
			<form
				onSubmit={handleProfilePictureChange}
				encType="multipart/form-data"
			>
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<label
						onDragOver={handleDragOver}
						onDrop={handleFileDrop}
						className={classes["file-input-container"]}
					>
						<input type="file" onChange={handleFileChange} />
						{file ? (
							<p>{file.name}</p>
						) : (
							<h4>
								Drag & Drop to upload files (only accepted
								formats 'png','jpg','jpeg')
							</h4>
						)}
					</label>
				</div>
				<button className={classes["form-button"]} type="submit">
					Change profile image
				</button>
			</form>
		</div>
	);
};

export default ProfileImageSettings;
