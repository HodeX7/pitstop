import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import logo from "../assets/HostFormLogo.png";
import { UserAPI } from "../services/api.service";

import { useNavigate } from "react-router-dom";
import EventCompletion from "./EventCompletion";
import Shimmer from "./Shimmer";
import TestFixture from "./testFixtures";

const UserLoginView = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    contact_number: Yup.string().required("Contact number is required"),
  });

  const initialValues = {
    contact_number: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    UserAPI.login(values)
      .then((res) => {
        console.log(res) 
        if (res.status == 200 && res.data.success) {
          let uid = res.data.data.id;
          const state = { uid: uid, contact_number: values.contact_number };
          navigate("/verify", { state: state });
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status != 500) {
          Object.keys(err.response.data).forEach((key) => {
            const value = err.response.data[key];
            alert(`${key}: ${value[0]}`);
          });
        }
      });
  };

  return (
    <>
      <div className="flex flex-col p-6 min-h-screen">
        <img src={logo} alt="" />
        <div className="flex justify-center">
          <h1 className="text-xl font-semibold">Login</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mt-2">
                <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                  <PhoneOutlinedIcon className="text-gray-600 mr-2" />
                  <Field
                    className="outline-none bg-gray-100 flex-1"
                    placeholder="Mobile Number"
                    type="text"
                    id="contact_number"
                    name="contact_number"
                  />
                </div>
                <ErrorMessage
                  name="contact_number"
                  component="div"
                  className="error text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
                disabled={isSubmitting}
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-blue">
            Don't have an account?
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 ml-2 cursor-pointer"
            >
              Signup
            </span>
          </h1>
        </div>
      </div>
      {/* <EventCompletion /> */}
      {/* <Shimmer /> */}
      {/* <TestFixture
        rounds={[
          {
            title: "Round one",
            seeds: [
              {
                id: 1,
                date: new Date().toDateString(),
                teams: [{ name: "Team A" }, { name: "Team B" }],
              },
              {
                id: 2,
                date: new Date().toDateString(),
                teams: [{ name: "Team C" }, { name: "Team D" }],
              },
            ],
          },
          {
            title: "Round one",
            seeds: [
              {
                id: 3,
                date: new Date().toDateString(),
                teams: [{ name: "Team A" }, { name: "Team C" }],
              },
            ],
          },
        ]}
      /> */}
    </>
  );
};

export default UserLoginView;
