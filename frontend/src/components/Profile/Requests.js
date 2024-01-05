import React, { useState } from "react";
import RequestsDisplay from "./RequestsDisplay";
import DisplayButton from "./DisplayButton";

const Requests = () => {
	const [open, setOpen] = useState(false);

	const openYourRequestsHandler = () => {
		setOpen(!open);
	};

	return (
		<div>
			<DisplayButton
				disabled={false}
				text={"Friend Requests"}
				onClick={() => openYourRequestsHandler()}
			/>
			{open && (
				<RequestsDisplay
					openYourRequestsHandler={openYourRequestsHandler}
				/>
			)}
		</div>
	);
};

export default Requests;
