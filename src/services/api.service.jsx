import { Storage } from "@capacitor/storage";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { CapacitorHttp } from "@capacitor/core";

export const SITE_URL = "https://app.ourpitstop.in/";

// export const API_MEDIA = "http://192.168.1.4:8000";
// export const API_URL = "http://192.168.1.4:8000/api/";

// export const API_URL = "http://127.0.0.1:8000/api/";
// export const API_MEDIA = "http://127.0.0.1:8000";

export const API_URL = "https://api.ourpitstop.in/api/";
export const API_MEDIA = "https://api.ourpitstop.in";

export const useAxios = (configParams) => {
  const [resData, setResData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDataUsingAxios = async (accessToken) => {
    const axiosAuthorized = axios.create({
      baseURL: API_URL,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${accessToken ? accessToken : ""}`,
      },
    });

    try {
      const res = await axiosAuthorized.request(configParams);
      setResData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    // Retrieve the access token from storage
    Storage.get({ key: "access_token" })
      .then((result) => {
        const accessToken = result.value;
        fetchDataUsingAxios(accessToken);
      })
      .catch((err) => {
        console.error("Error retrieving access token:", err);
        setIsLoaded(true);
      });
  }, []);

  return [resData, isLoaded];
};

export const axiosAuthRequest = async (url, req_params, sendingMedia) => {
  const result = await Storage.get({ key: "access_token" });

  if (result.value != null) {
    return axios.request({
      url: API_URL + url,
      ...req_params,
      headers: {
        Authorization: `Bearer ${result.value}`,
        "Content-Type": sendingMedia
          ? "multipart/form-data"
          : "application/json",
      },
    });
  } else {
    return <Navigate to="/logout" />;
  }
};

const signup = (data) => {
  return CapacitorHttp.post({
    url: API_URL + "user/",
    data: data,
    headers: { "Content-Type": "application/json" },
  });
  // return axios.post(API_URL + "user/", data);
};

const login = (data) => {
  return CapacitorHttp.post({
    url: API_URL + "user/login/",
    data: data,
    headers: { "Content-Type": "application/json" },
  });
  // return axios.post(API_URL + "user/login/", data);
};

const authenticateOTP = (id, otp) => {
  return CapacitorHttp.post({
    url: API_URL + `user/${id}/authenticate_otp/`,
    data: { otp: otp },
    headers: { "Content-Type": "application/json" },
  });
  // return axios.post(API_URL + `user/${id}/authenticate_otp/`, { otp: otp });
};

const resendOTP = (id) => {
  return axios.post(API_URL + `user/${id}/resend_otp/`);
};

const logout = () => {
  return axios.get(API_URL + "user/logout/");
};

export const UserLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Storage.clear();
    await Storage.set({
      key: "isLoggedIN",
      value: "no",
    });
  };

  useEffect(() => {
    handleLogout();

    // logout().then((res) => {
    //   alert("loggin you out :) bye bye!");
    // });

    navigate("/login");
  }, []);

  return <div>Loggin you out...</div>;
};

export const axiosAuthorized = async () => {
  try {
    const result = await Storage.get({ key: "access_token" });
    const token = result.value;

    if (token) {
      const instance = axios.create({
        baseURL: API_URL,
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return instance;
    } else {
      console.error("Token not found in storage.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const capacitorHTTPClient = async (url, req_params, sendingMedia) => {
  const result = await Storage.get({ key: "access_token" });

  if (result.value != null) {
    return CapacitorHttp.request({
      url: API_URL + url,
      ...req_params,
      headers: {
        Authorization: `Bearer ${result.value}`,
        "Content-Type": sendingMedia
          ? "multipart/form-data"
          : "application/json",
      },
    });
  } else {
    return <Navigate to="/logout" />;
  }
};

const getUser = (id) => {
  // const id = parseInt(localStorage.getItem("uid"));
  if (id) {
    return axiosAuthorized().get(`/user/${id}/`, data);
  }
};

const editUser = (data) => {
  const id = parseInt(localStorage.getItem("uid"));
  if (id) {
    return axiosAuthorized().put(`/user/${id}/`, data);
  }
};

const checkTokenExpiry = () => {
  return axiosAuthorized().get("user/check_token_expiry");
};

export const UserAPI = {
  signup,
  login,
  authenticateOTP,
  resendOTP,

  getUser,
  editUser,
  logout,
  checkTokenExpiry,
};

/* 
-> TOURNAMENT API FUNCTIONS <-
*/
const getTournament = (id) => {
  return axiosAuthorized().get(`tournament/${parseInt(id)}/`);
};

const getTournamentList = () => {
  return axiosAuthorized().get("tournament/live/");
};

const getMyTournamentsList = () => {
  return axiosAuthorized().get("tournament/my_tournaments/");
};

const getUpcomingTournamentsList = () => {
  return axiosAuthorized().get("tournament/upcoming/");
};

const getTournamentHistory = () => {
  return axiosAuthorized().get("tournament/history/");
};

const addTournament = (data) => {
  return capacitorHTTPClient(
    "tournament/",
    {
      method: "post",
      data: data,
    },
    true
  );
};

const updateTournament = (id, data) => {
  return capacitorHTTPClient(`tournament/${id}/`, {
    method: "put",
    data: data,
  });
  // return axiosAuthorized().put(`tournament/${id}/`, data);
};

const deleteTournament = (id) => {
  return capacitorHTTPClient(`tournament/${id}/`, {
    method: "delete",
  });
  // return axiosAuthorized().delete(`tournament/${id}/`);
};

export const TournamentAPI = {
  getTournament,
  getTournamentList,
  getMyTournamentsList,
  getUpcomingTournamentsList,
  getTournamentHistory,
  addTournament,
  updateTournament,
  deleteTournament,
};

/*
-> TEAM API FUNCTIONS <-
*/
const getTeam = (id) => {
  return axiosAuthorized().get(`team/${id}/`);
};

const addTeam = (data) => {
  return axiosAuthRequest(
    "team/",
    {
      method: "post",
      data: data,
    },
    true
  );
};

const updateTeam = (id, data) => {
  return capacitorHTTPClient(`team/${id}`, {
    method: "put",
    data: data,
  });
  // return axiosAuthorized().put(`team/${id}/`, data);
};

const deleteTeam = (id) => {
  return capacitorHTTPClient(`team/${id}`, {
    method: "delete",
  });
  // return axiosAuthorized().delete(`team/${id}/`);
};

const verifyParticipant = (id, data) => {
  return capacitorHTTPClient(`team/${id}/verify_participant/`, {
    method: "post",
    data: data,
  });
};

const changeTeamParticipationStatus = (id, data) => {
  return capacitorHTTPClient(`team/${id}/change_participation_status/`, {
    method: "post",
    data: data,
  });
};

export const TeamAPI = {
  getTeam,
  addTeam,
  updateTeam,
  deleteTeam,

  verifyParticipant,
  changeTeamParticipationStatus,
};
