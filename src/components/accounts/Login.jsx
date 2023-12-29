import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import logo from "../../assets/HostFormLogo.png";
import { UserAPI } from "../../services/api.service";

import { useNavigate } from "react-router-dom";
import { Toast } from "@capacitor/toast";

const UserLoginView = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    contact_number: Yup.string()
      .matches(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits and should have valid digits"
      )
      .required("Mobile number is required"),
  });

  const initialValues = {
    contact_number: "",
  };

  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    const res = await UserAPI.login({
      contact_number: "+91" + values.contact_number,
    });

    console.log("ye aaya bhai", JSON.stringify(res))

    if (res.status === 200) {
      let uid = res.data.data.id;
      const state = {
        uid: uid,
        contact_number: "+91" + values.contact_number,
      };
      navigate("/verify", { state: state });
    } else {
      Toast.show({
        text: "Something went wrong. Please try again",
        duration: "long",
      });
      setFieldValue("contact_number", "");
    }

    setSubmitting(false);
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
                  <div className="gap-1 flex w-full">
                    <span className="mr-2">+91</span>
                    <Field
                      className="outline-none bg-gray-100 flex-1 w-full"
                      placeholder="Mobile Number (without +91)"
                      type="text"
                      maxLength={10}
                      id="contact_number"
                      name="contact_number"
                    />
                  </div>
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
            {`Don't have an account?`}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 ml-2 cursor-pointer"
            >
              Signup
            </span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default UserLoginView;
