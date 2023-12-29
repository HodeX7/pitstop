import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRef } from "react";
import * as Yup from "yup";
import logo from "./assets/ParticipantsFormLogo.png";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { FORM_OPTIONS } from "./services/misc.services";
import { NavigationHeaderComponent } from "./services/header.service";
import { useNavigate } from "react-router-dom";
import useCamera from "./utils/useCamera";
import FileInput from "./utils/FileInput";

const Test = () => {
  const navigate = useNavigate();

  const ref = useRef(null);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  const initialValues = {
    title: "",
    sport: "",
    venue: "",

    fromDate: formattedDate,
    toDate: formattedDate,
    fromTime: formattedTime,
    toTime: formattedTime,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Event Title is required"),
    sport: Yup.string().required("Sport is required"),
    venue: Yup.string().required("Venue is required"),

    fromDate: Yup.string().required("Start Date is required"),
    toDate: Yup.string().required("End Date is required"),
    fromTime: Yup.string().required("Start Time is required"),
    toTime: Yup.string().required("End Time is required"),
  });

  const [hostQR, error, takePicture, removePicture] = useCamera({
    filename: "host_QRCode",
    type: "image",
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // const formData = new FormData();

    // Object.keys(values).map((item) => {
    //   formData.set(item, values[item]);
    // });

    // if (hostQR) {
    //   const imageBlob = await fetch(hostQR.imageUrl);
    //   formData.append("host_QRCode", await imageBlob.blob(), hostQR.name);

    //   // for (const [key, value] of formData.entries()) {
    //   //   console.log(`${key}: ${value}`);
    //   // }

    //   const res = await axiosAuthRequest(
    //     "tournament/",
    //     {
    //       method: "post",
    //       data: formData,
    //     },
    //     true
    //   );

    //   if (res.status == 201) {
    //     Toast.show({
    //       text: "Your Tournament request was received. Wait for confirmation from pitstop",
    //       duration: "long",
    //     });

    //     navigate("/");
    //   } else {
    //     alert(JSON.stringify("error", res));
    //   }
    // } else {
    //   Toast.show({
    //     text: "Please upload a qr code as well",
    //     duration: "long",
    //   });
    // }

    console.log(values);
    navigate("/testSub");
    setSubmitting(false);
  };

  return (
    <div className="p-6">
      <NavigationHeaderComponent title={"Start a Tournament"} />
      <img src={logo} alt="" className="mb-4 mx-auto" />
      <div className="flex justify-center">
        <h1 className="text-xl font-semibold">Enter Event Details</h1>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={ref}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mt-5">
              <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                <DirectionsRunRoundedIcon className="text-gray-600 mr-2" />
                <Field
                  className="outline-none flex-1 bg-gray-100"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Event Title *"
                />
              </div>
              <ErrorMessage
                name="title"
                component="div"
                className="error text-red-500"
              />
            </div>

            <div className="mt-5">
              <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                <DirectionsRunRoundedIcon className="text-gray-600 mr-1" />
                <Field
                  className="outline-none w-full bg-gray-100"
                  as="select"
                  id="sport"
                  name="sport"
                  placeholder="Select a sport"
                >
                  <option value="">Select a sport *</option>
                  {FORM_OPTIONS.Sports.map((sport) => (
                    <option key={sport.value} value={sport.value}>
                      {sport.label}
                    </option>
                  ))}
                </Field>
              </div>
              <ErrorMessage
                className="error text-red-500"
                name="sport"
                component="div"
              />
            </div>

            <div className="mt-5">
              <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                <FmdGoodOutlinedIcon className="text-gray-600 mr-2" />
                <Field
                  placeholder="Venue *"
                  className="outline-none flex-1 bg-gray-100"
                  type="text"
                  id="venue"
                  name="venue"
                />
              </div>
              <ErrorMessage
                className="error text-red-500"
                name="venue"
                component="div"
              />
            </div>

            <div className="mt-5 flex justify-between items-center">
              <div>
                <label htmlFor="fromDate">Start Date</label>
                <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                  <Field
                    className="outline-none bg-gray-100"
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    placeholder="Select a date"
                  />
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="fromDate"
                  component="div"
                />
              </div>
              <span className="mt-5">-</span>
              <div>
                <label htmlFor="fromDate">End Date</label>
                <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                  <Field
                    className="outline-none flex-1 bg-gray-100"
                    type="date"
                    id="toDate"
                    name="toDate"
                  />
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="toDate"
                  component="div"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <div className="flex flex-col">
                <label htmlFor="fromDate">Start Time</label>
                <div className="bg-gray-100 flex p-3 rounded-lg items-center w-44">
                  <Field
                    className="outline-none bg-gray-100 flex-1"
                    type="time"
                    id="fromTime"
                    name="fromTime"
                  />
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="fromTime"
                  component="div"
                />
              </div>
              <span className="mt-5">-</span>
              <div className="flex flex-col">
                <label htmlFor="fromDate">End Time</label>
                <div className="bg-gray-100 flex p-3 rounded-lg items-center w-44">
                  <Field
                    className="outline-none bg-gray-100 flex-1"
                    type="time"
                    id="toTime"
                    name="toTime"
                  />
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="toTime"
                  component="div"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="bg-gray-100 flex flex-col p-3 rounded-lg ">
                <label className="text-gray-600 mr-2 mb-3">
                  Upload Payment QR Code *
                </label>
                <FileInput
                  picture={hostQR}
                  error={error}
                  takePicture={takePicture}
                  removePicture={removePicture}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center items-center text-xs cursor-pointer mb-2 text-blue-400">
              Terms and Conditions *
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white flex p-3 rounded-lg w-full justify-center"
              disabled={isSubmitting}
            >
              Add Sub-Tournament Details
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Test;
