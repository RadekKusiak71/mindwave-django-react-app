import React from "react";
import classes from "./Requests.module.css";

const Requests = () => {
	return (
		<div>
			<button
				type="button"
				onClick={() => {
					console.log("open requests");
				}}
				className={classes["profile-button"]}
			>
				Friend Requests
			</button>
		</div>
	);
};

export default Requests;
