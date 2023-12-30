import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";

const HeaderApplier = () => {
	return (
		<div>
			<Navigation />
			<Outlet />
		</div>
	);
};

export default HeaderApplier;
