import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";
import homeIcon from "../../assets/icons/Home.svg";
import accountIcon from "../../assets/icons/Account.svg";
import logoutIcon from "../../assets/icons/Logout.svg";
import searchIcon from "../../assets/icons/Search.svg";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

// NavLink component to clear Navigation Component
const NavigationLink = (props) => {
	return (
		<NavLink
			to={`/${props.path}`}
			className={({ isActive }) =>
				isActive ? classes["nav-link_active"] : classes["nav-link"]
			}
			onClick={props.onClick && props.onClick}
		>
			<img src={props.icon} alt={props.iconAlt} />
		</NavLink>
	);
};

const Navigation = () => {
	const { logoutUser, user } = useContext(AuthContext);

	return (
		<header className={classes["header"]}>
			<nav className={classes["navigation-menu"]}>
				<NavigationLink path="" icon={homeIcon} iconAlt="Home" />
				<NavigationLink
					path="search"
					icon={searchIcon}
					iconAlt="Search"
				/>
				<NavigationLink
					path={`account/${user.user_id}`}
					icon={accountIcon}
					iconAlt="Account"
				/>
				<NavigationLink
					path="login"
					icon={logoutIcon}
					iconAlt="Logout"
					onClick={logoutUser}
				/>
			</nav>
		</header>
	);
};

export default Navigation;
