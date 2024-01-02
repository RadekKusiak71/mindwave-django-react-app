import React, { useContext, useState, useCallback, useEffect } from "react";
import classes from "./SearchPage.module.css";
import Card from "../../layout/Card";
import SearchResult from "../../components/Search/SearchResult";
import AuthContext from "../../context/AuthContext";
import searchIcon from "../../assets/icons/Search.svg";

const SearchPage = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState(null);
	const { authTokens } = useContext(AuthContext);

	const searchInputHandler = (e) => {
		setQuery(e.target.value);
	};

	const checkResults = (res) => {
		if (res == null) {
			return <p>Search for users</p>;
		}
		if (res.length === 0) {
			return <p>No users with this nickname</p>;
		} else {
			return results.map((profile) => (
				<SearchResult
					key={profile.id}
					username={profile.username}
					profileImage={profile.profile_picture}
					friends={profile.friends}
					profileId={profile.id}
					userId={profile.user}
				/>
			));
		}
	};

	const fetchUsers = useCallback(async () => {
		try {
			let response = await fetch(
				`http://127.0.0.1:8000/api/profiles/username/${query}/`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${authTokens.access}`,
						"Content-Type": "application/json",
					},
				}
			);

			let data = await response.json();

			if (response.ok) {
				if (data.detail) {
					setResults([]);
				} else {
					setResults(data);
				}
			} else {
				setResults([]);
			}
		} catch (err) {
			console.log(err);
		}
	}, [setResults, authTokens.access, query]);

	useEffect(() => {
		if (query.trim().length <= 0) {
			setResults(null);
		} else {
			const debounce = setTimeout(() => fetchUsers(), 400);
			return () => clearTimeout(debounce);
		}
	}, [query, fetchUsers]);

	return (
		<Card>
			<div className={classes["search-input-container"]}>
				<img src={searchIcon} alt="search" />
				<input
					className={classes["search-input"]}
					type="text"
					placeholder="Search"
					onChange={searchInputHandler}
					value={query}
				/>
			</div>
			<div className={classes["search-results-container"]}>
				{checkResults(results)}
			</div>
		</Card>
	);
};

export default SearchPage;
