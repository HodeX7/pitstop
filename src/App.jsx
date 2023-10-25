import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import EventForm from "./components/EventForm";
import ParticipantForm from "./components/ParticipantForm";
import HostRegistration from "./components/HostRegistration";
import VerifyMobileOTP from "./components/Otp";
import DisplayForm from "./components/DisplayForm";
import ParticipantScreen from "./components/ParticipantScreen";
import EventCancellation from "./components/EventCancellation";
import ParticipantCancellation from "./components/ParticipantCancellation";
import RejectParticipation from "./components/RejectParticipation";
import Home from "./components/Home";
import PaymentPage from "./components/PaymentPage";
import EventsPage from "./components/EventsPage";
import CancellationByParticipant from "./components/ParticipationCancellation";
import ParticipantDetail from "./components/ParticipantDetail";
import UserSigninView from "./components/UserSigninPage";
import UserLoginView from "./components/Login";
import EditTournamentForm from "./components/EditTournamentForm";
import { AuthProvider, useAuth } from "./utils/auth";
import { RequireAuth } from "./utils/RequireAuth";
import { UserAPI, UserLogout } from "./services/api.service";
import Profile from "./components/Profile";
import { useEffect, useState } from "react";
import AddTeamPage from "./components/AddTeamPage";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import EventTest from "./components/EventTest";
import ParticipationCancellation from "./components/ParticipationCancellation";

function App() {
  const loggedin = localStorage.getItem("isLoggedIN");
  const [render, setRender] = useState(false);
  // useEffect(() => {
  //   if (loggedin == 'yes') {
  //     UserAPI.checkTokenExpiry()
  //       .then(res => {
  //         console.log(res)
  //         if (res.status === 200) {
  //           pass
  //         }
  //       })
  //       .catch(err => {
  //         if (err.response.status == 401) {
  //           setRender(true)
  //           console.log("TOKEN FUCKED HAI BHAI")
  //         }
  //       })
  //   } else {
  //     setRender(true)
  //   }
  // }, [])

  return (
    <Provider store={configureStore}>
      <AuthProvider>
        <div className="flex justify-center items-center bg-secondary min-h-screen">
          <div className="w-full max-w-md rounded-lg bg-white min-h-screen">
            {/* <Router>
            <Routes>
              <Route path="/signup" element={<UserSigninView />}></Route>
              <Route path="/verify" element={<VerifyMobileOTP />}></Route>
              <Route path="/logout" element={<UserLogout />}></Route>
            </Routes>
          </Router> */}

            <Router>
              {/* {render && <Navigate to='/login'/>} */}
              <Routes>
                <Route path="/signup" element={<UserSigninView />}></Route>
                {/* <Route path="/test" element={<EventTest />}></Route> */}
                <Route path="/verify" element={<VerifyMobileOTP />}></Route>
                <Route path="/login" element={<UserLoginView />}></Route>
                <Route path="/logout" element={<UserLogout />}></Route>

                <Route exact path="/" element={<Home />} />
                <Route
                  exact
                  path="/tournament/:id"
                  element={
                    <RequireAuth>
                      {" "}
                      <DisplayForm />{" "}
                    </RequireAuth>
                  }
                />
                <Route
                  exact
                  path="/tournament/:tournament_id/cancel"
                  element={<EventCancellation />}
                />
                <Route exact path="/tournament/add" element={<EventForm />} />
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

                <Route exact path="/profile" element={<Profile />} />
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
