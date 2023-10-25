import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import logo from "../assets/HostFormLogo.png";
import { UserAPI } from "../services/api.service";

import { useNavigate } from "react-router-dom";

const UserSigninView = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        contact_number: Yup.string().required("Contact number is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        age: Yup.number()
            .typeError("Age must be a number")
            .required("Age is required")
            .positive("Age must be a positive number"),
        gender: Yup.string().required("Gender is required"),
    });

    const initialValues = {
        name: "Dummy Name",
        contact_number: "",
        email: "dummy@gmail.com",
        age: "18",
        gender: "male",
    };

    const handleSubmit = (values, { setSubmitting }) => {
        UserAPI.signup(values)
            .then(res => {
                if (res.status == 201) {
                    let uid = res.data.data.id

                    const state = { uid: uid, contact_number: values.contact_number };
                    navigate('/verify', { state: state });
                }
            })
            .catch(err => {
                Object.keys(err.response.data).forEach((key) => {
                    const value = err.response.data[key];
                    alert(`${key}: ${value[0]}`)
                });
            })
    };

    return (
        <div className="flex flex-col p-6">
            <img src={logo} alt="" />
            <div className="flex justify-center">
                <h1 className="text-xl font-semibold">Enter Host Details</h1>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mt-2">
                            <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                <PersonOutlineOutlinedIcon className="text-gray-600 mr-2" />
                                <Field
                                    className="outline-none bg-gray-100 flex-1"
                                    placeholder="Name"
                                    type="text"
                                    id="name"
                                    name="name"
                                />
                            </div>
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="error text-red-500 "
                            />
                        </div>

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

                        <div className="mt-2">
                            <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                <AlternateEmailOutlinedIcon className="text-gray-600 mr-2" />
                                <Field
                                    className="outline-none bg-gray-100 flex-1"
                                    placeholder="E-mail ID"
                                    type="email"
                                    id="email"
                                    name="email"
                                />
                            </div>
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="error text-red-500"
                            />
                        </div>

                        <div className="mt-2">
                            <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                <CalendarTodayOutlinedIcon className="text-gray-600 mr-2" />
                                <Field
                                    className="outline-none bg-gray-100 flex-1"
                                    placeholder="Age"
                                    type="number"
                                    id="age"
                                    name="age"
                                />
                            </div>
                            <ErrorMessage
                                name="age"
                                component="div"
                                className="error text-red-500"
                            />
                        </div>

                        <div className="mt-2 font-semibold">
                            <label htmlFor="gender">Gender</label>
                            <div className="flex justify-start items-center mt-2">
                                <label htmlFor="gender-male" className="font-semibold mr-2">
                                    <Field
                                        type="radio"
                                        id="gender-male"
                                        name="gender"
                                        value="male"
                                        className="appearance-none rounded-full w-4 h-4 border-2 checked:bg-orange-500 mr-2 flex-1"
                                    />
                                    Male
                                </label>
                                <label htmlFor="gender-female" className="font-semibold mr-2">
                                    <Field
                                        type="radio"
                                        id="gender-female"
                                        name="gender"
                                        value="female"
                                        className="appearance-none rounded-full w-4 h-4 border-2 checked:bg-orange-500 mr-2 flex-1"
                                    />
                                    Female
                                </label>
                                <label htmlFor="gender-other" className="font-semibold mr-2">
                                    <Field
                                        type="radio"
                                        id="gender-other"
                                        name="gender"
                                        value="other"
                                        className="appearance-none rounded-full w-4 h-4 border-2 checked:bg-orange-500 mr-2 flex-1"
                                    />
                                    Other
                                </label>
                            </div>
                            <ErrorMessage
                                name="gender"
                                component="div"
                                className="error-message"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-orange-500 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
                            disabled={isSubmitting}
                        >
                            Submit Details
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="flex items-center justify-center mt-5">
                <h1 className="text-blue">
                    Already have an account?
                    <span onClick={() => navigate('/login')} className="text-blue-500 ml-2 cursor-pointer" >Login</span>
                </h1>
            </div>
        </div>
    );
};

export default UserSigninView;
