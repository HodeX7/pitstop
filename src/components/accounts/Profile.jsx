import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate } from "react-router-dom";
import {
  API_URL,
  UserAPI,
  axiosAuthorized,
  capacitorHTTPClient,
  useAxios,
} from "../../services/api.service";
import { NavigationHeaderComponent } from "../../services/header.service";
import { Storage } from "@capacitor/storage";
import { CapacitorHttp } from "@capacitor/core";
import Shimmer from "../Shimmer";

const Profile = () => {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState({});
  const [isReady, setIsReady] = useState(false);
  // const [data, isReady] = useAxios({
  //     url: `/user/${
  //         parseInt(await Storage.get({ key: 'uid' })?.value)
  //     }/`,
  //     method: 'get'
  // });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name should consist only of alphabets")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    contact_number: Yup.string()
      .matches(
        /^\+\d{12}$/,
        "Contact number should consist of exactly 10 numbers"
      )
      .required("Contact number is required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .positive("Age must be a positive number")
      .required("Age is required"),
    gender: Yup.string()
      .oneOf(
        ["male", "female", "other"],
        "Gender must be either Male, Female, or Other"
      )
      .required("Gender is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const uid = await Storage.get({ key: "uid" });

      if (uid.value !== null) {
        const res = await capacitorHTTPClient(`user/${uid.value}/`, {
          method: "put",
          data: values,
        });
        if (res.status === 200) {
          alert("profile updated.");
        }

        fetchUser();
        setEditMode(false);
      } else {
        navigate("/logout");
        return;
      }
    } catch (error) {
      console.error(error);
      setEditMode(false);
    }

    // UserAPI.editUser(values)
    //     .then(res => {
    //         if (res.status == 200) {
    //             alert('Your profile was updated !')
    //         }
    //     })
    //     .catch(err => {
    //         console.error(err)
    //     })

    // setEditMode(false);
  };

  const fetchUser = async () => {
    try {
      const uid = await Storage.get({ key: "uid" });

      if (uid.value !== null) {
        const res = await capacitorHTTPClient(`user/${uid.value}/`, {
          method: "get",
        });

        setData(res.data);
        setIsReady(true);
      } else {
        navigate("/logout");
        return;
      }
    } catch (error) {
      console.error(error);
      setIsReady(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    navigate("/logout");
  };

  if (!isReady) {
    return <Shimmer />;
  }

  return (
    <>
      {
        isReady && data ? (
          <div className="h-full">
            {editMode ? (
              <div className="h-full flex flex-col justify-between">
                <NavigationHeaderComponent title={data.name} />
                <Formik
                  initialValues={data}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form className="flex flex-col justify-between">
                    <div>
                      <div className="p-6">
                        <div className="mb-5">
                          <div className="flex items-center justify-between">
                            <h1 className="font-semibold mr-5">Name:</h1>
                            <Field
                              type="text"
                              name="name"
                              className="border rounded px-2 py-1"
                            />
                          </div>
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        <div className="mb-5">
                          <div className="flex items-center justify-between">
                            <h1 className="font-semibold mr-5">Email:</h1>
                            <Field
                              type="email"
                              name="email"
                              className="border rounded px-2 py-1"
                            />
                          </div>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        <div className="mb-5">
                          <div className="flex items-center justify-between">
                            <h1 className="font-semibold mr-5">
                              Contact Number:
                            </h1>
                            <Field
                              type="text"
                              name="contact_number"
                              className="border rounded px-2 py-1"
                            />
                          </div>
                          <ErrorMessage
                            name="contact_number"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        <div className="mb-5">
                          <div className="flex items-center justify-between">
                            <h1 className="font-semibold mr-5">Age:</h1>
                            <Field
                              type="number"
                              name="age"
                              className="border rounded px-2 py-1"
                            />
                          </div>
                          <ErrorMessage
                            name="age"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        <div className="mb-5">
                          <div className="flex items-center justify-between">
                            <h1 className="font-semibold mr-5">Gender:</h1>
                            <Field
                              component="select"
                              name="gender"
                              className="border rounded px-2 py-1"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Field>
                          </div>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </Form>
                </Formik>
                <div className="flex mt-auto mb-[5rem]">
                  <button
                    type="submit"
                    className="bg-white m-1 text-orange-500 border-orange-500 border flex p-3 rounded-lg mt-6 w-full justify-center"
                    //dhruv make api call to edit the user info here.
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-orange-500 m-1 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="p-6">
                    <div className="flex items-center mb-8 justify-between">
                      <h1 className="font-semibold mr-5">Name:</h1>
                      <h2>{data.name}</h2>
                    </div>
                    <div className="flex items-center mb-8 justify-between">
                      <h1 className="font-semibold mr-5">Email:</h1>
                      <h2 className="text-blue-400">{data.email}</h2>
                    </div>
                    <div className="flex items-center mb-8 justify-between">
                      <h1 className="font-semibold mr-5">Contact Number:</h1>
                      <h2 className="text-blue-400">{data.contact_number}</h2>
                    </div>
                    <div className="flex items-center mb-8 justify-between">
                      <h1 className="font-semibold mr-5">Age:</h1>
                      <h2>{data.age}</h2>
                    </div>
                    <div className="flex items-center mb-8 justify-between">
                      <h1 className="font-semibold mr-5">Gender:</h1>
                      <h2>{data.gender}</h2>
                    </div>
                  </div>
                </div>
                <div className="flex mt-auto mb-[5rem]">
                  <button
                    type="button"
                    className="bg-white m-1 text-orange-500 border-orange-500 border flex p-3 rounded-lg mt-6 w-full justify-center"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="bg-orange-500 m-1 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null
        // <Navigate to={'/logout'} />
      }
    </>
  );
};

export default Profile;
