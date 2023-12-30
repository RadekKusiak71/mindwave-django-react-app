import React from "react";
import classes from "./Notification.module.css";
import { motion } from "framer-motion";

const Notification = (props) => {
	// Map through the errors and create a list of <p> elements
	const errorMessages = Object.entries(props.errors).map(
		([field, messages]) => (
			<p key={field}>
				{field}: {messages}
			</p>
		)
	);

	return (
		<motion.div
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			className={classes["notification"]}
			onClick={props.onClick}
		>
			{errorMessages}
		</motion.div>
	);
};

export default Notification;
