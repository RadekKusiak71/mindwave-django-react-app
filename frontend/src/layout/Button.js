import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
	return (
		<button
			type={props.type}
			onClick={props.onClick}
			className={classes["button"]}
		>
			{props.buttonText}
		</button>
	);
};

export default Button;
