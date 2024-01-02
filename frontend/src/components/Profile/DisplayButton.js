import React from "react";
import classes from "./FriendsButton.module.css";

const DisplayButton = (props) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={classes["profile-button"]}
			disabled={props.disabled}
		>
			{props.text}
		</button>
	);
};

export default DisplayButton;
