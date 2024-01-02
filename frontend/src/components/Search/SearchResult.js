import React from "react";
import classes from "./SearchResult.module.css";
import { Link } from "react-router-dom";
import accountIcon from "../../assets/icons/Account.svg";
const SearchResult = (props) => {
	return (
		<div className={classes["search-result"]}>
			<Link
				to={`/account/${props.userId}`}
				className={classes["user-data"]}
			>
				<img
					src={
						props.profileImage
							? `http://127.0.0.1:8000${props.profileImage}`
							: accountIcon
					}
					alt={props.username}
					className={classes["user-image"]}
				/>
				<p>{props.username}</p>
			</Link>
		</div>
	);
};

export default SearchResult;
