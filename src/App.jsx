import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

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

import { AuthProvider, useAuth } from "./utils/auth";
import { UserLogout } from "./services/api.service";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import ParticipationCancellation from "./components/cancellation/ParticipationCancellation";
import TournamentCategories from "./components/tournament/TournamentCategories";
import AddTournament from "./components/tournament/AddTournament";
import AddTournamentCategories from "./components/tournament/AddTournamentCategories";
import EditEventForm from "./components/tournament/EditEventForm";

// import { IonApp, IonRouterOutlet } from "@ionic/react";
// import { IonReactRouter } from '@ionic/react-router';

import { App as CapApp } from "@capacitor/app";

CapApp.addListener('backButton', ({ canGoBack }) => {
  window.history.back();
  // if (canGoBack) {
  // } else {
  //   CapApp.exitApp();
  // }
});

const PrivateRoutes = () => {
  let auth = useAuth();
  console.log("renders every refres", auth);
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const nonProtectedRoutes = [
    { path: "/signup", component: UserSigninView },
    { path: "/verify", component: VerifyMobileOTP },
    { path: "/login", component: UserLoginView },
    { path: "/logout", component: UserLogout },
  ];

  const protectedRoutes = [
    { path: "/profile", component: Profile },

    { path: "/tournament/:id", component: DisplayForm },
    { path: "/tournament/add", component: AddTournament },
    { path: "/tournament/wrapper/edit/:id", component: EditEventForm },
    {
      path: "/tournament/add/:id/categories",
      component: AddTournamentCategories,
    },
    { path: "/tournament/wrapper/:id", component: TournamentCategories },
    { path: "/tournament/:tournament_id/cancel", component: EventCancellation },
    { path: "/tournament/edit/:id", component: EditTournamentForm },
    {
      path: "/tournament/:tournament_id/team/:team_id",
      component: ParticipantScreen,
    },
    {
      path: "/tournament/:tournament_id/team/:team_id/reject",
      component: RejectParticipation,
    },
    {
      path: "/tournament/:tournament_id/team/:team_id/cancel",
      component: ParticipationCancellation,
    },
    {
      path: "/tournament/:tournament_id/team/:team_id/participant",
      component: ParticipantDetail,
    },
    {
      path: "/tournament/:tournament_id/team/:team_id/participant/reject",
      component: ParticipantCancellation,
    },
    { path: "/tournament/:id/team/add", component: AddTeamPage },
    { path: "/", component: Home },
  ];

  return (
    <Provider store={configureStore}>
      <div
        className="flex justify-center items-center bg-black min-h-screen bg-cover relative"
        style={{ backgroundImage: `url("${pitstop_bg}")` }}
      >
        <div className="w-full max-w-md rounded-lg bg-white min-h-screen">
          <Router>
            <AuthProvider>
              <Routes>
                {nonProtectedRoutes.map((route, idx) => (
                  <Route
                    key={idx}
                    path={route.path}
                    element={<route.component />}
                  ></Route>
                ))}

                <Route element={<PrivateRoutes />}>
                  {protectedRoutes.map((route, idx) => (
                    <Route
                      key={idx}
                      exact
                      path={route.path}
                      element={<route.component />}
                    />
                  ))}
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
          {/* <Router>
              </Router> */}
        </div>
      </div>
    </Provider>
  );
}

export default App;
