import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EventForm from "./components/tournament/EventForm";
import DisplayForm from "./components/tournament/DisplayForm";
import EditTournamentForm from "./components/tournament/EditTournamentForm";

import Profile from "./components/accounts/Profile";
import VerifyMobileOTP from "./components/accounts/Otp";
import UserLoginView from "./components/accounts/Login";
import UserSigninView from "./components/accounts/UserSigninPage";

import ParticipantScreen from "./components/team/ParticipantScreen";
import ParticipantDetail from "./components/team/ParticipantDetail";
import AddTeamPage from "./components/team/AddTeamPage";

import EventCancellation from "./components/cancellation/EventCancellation";
import ParticipantCancellation from "./components/cancellation/ParticipantCancellation";
import RejectParticipation from "./components/cancellation/RejectParticipation";

import Home from "./components/Home";
import pitstop_bg from "./assets/pitstop_bg.png";

import { AuthProvider } from "./utils/auth";
import { RequireAuth } from "./utils/RequireAuth";
import { UserLogout } from "./services/api.service";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import ParticipationCancellation from "./components/cancellation/ParticipationCancellation";

function App() {
  return (
    <Provider store={configureStore}>
      <AuthProvider>
        <div
          className="flex justify-center items-center bg-black min-h-screen bg-cover relative"
          style={{ backgroundImage: `url("${pitstop_bg}")` }}
        >
          <div className="w-full max-w-md rounded-lg bg-white min-h-screen">
            <Router>
              <Routes>
                <Route path="/signup" element={<UserSigninView />}></Route>
                <Route path="/verify" element={<VerifyMobileOTP />}></Route>
                <Route path="/login" element={<UserLoginView />}></Route>
                <Route path="/logout" element={<UserLogout />}></Route>

                <Route
                  exact
                  path="/"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />

                <Route
                  exact
                  path="/tournament/:id"
                  element={
                    <RequireAuth>
                      <DisplayForm />
                    </RequireAuth>
                  }
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/cancel"
                  element={<EventCancellation />}
                />
                <Route
                  exact
                  path="/tournament/add"
                  element={
                    <RequireAuth>
                      <EventForm />
                    </RequireAuth>
                  }
                />
                <Route
                  exact
                  path="/tournament/edit/:id"
                  element={<EditTournamentForm />}
                />

                <Route
                  exact
                  path="/tournament/:tournament_id/team/:team_id"
                  element={<ParticipantScreen />}
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/team/:team_id/reject"
                  element={<RejectParticipation />}
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/team/:team_id/cancel"
                  element={<ParticipationCancellation />}
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/team/:team_id/participant"
                  element={<ParticipantDetail />}
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/team/:team_id/participant/reject"
                  element={<ParticipantCancellation />}
                />

                <Route
                  exact
                  path="/tournament/:id/team/add"
                  element={<AddTeamPage />}
                />
                {/* <Route exact path="/tournament/:tournament_id/team/:team_id/edit" element={ <ParticipantForm /> } /> */}

                <Route
                  exact
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
              </Routes>
            </Router>
          </div>
          {/* <PaymentPage /> */}
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
