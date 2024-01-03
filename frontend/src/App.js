import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import HeaderApplier from "./utils/HeaderApplier";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import SearchPage from "./pages/SearchPage/SearchPage";
import { FriendsProvider } from "./context/FriendsContext";

function App() {
	return (
		<Router>
			<AuthProvider>
				<FriendsProvider>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route element={<PrivateRoutes />}>
							<Route element={<HeaderApplier />}>
								<Route path="/" element={<HomePage />} />
								<Route
									path="/account/:userId"
									element={<ProfilePage />}
								/>
								<Route
									path="/search"
									element={<SearchPage />}
								/>
							</Route>
						</Route>
					</Routes>
				</FriendsProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
