import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { useParams } from "react-router-dom"
import { Toast } from "@capacitor/toast";

import logo from "../../assets/ParticipantsFormLogo.png";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import DirectionsRunRoundedIcon from "@mui/icons-material/FmdGoodOutlined";
import { FORM_OPTIONS } from "../../services/misc.services";
import { NavigationHeaderComponent } from "../../services/header.service";
import { useEffect, useState } from "react";
import { axiosAuthRequest } from "../../services/api.service";

const EditEventForm = () => {

  const { id } = useParams()

  const [initialValues, setInitialValues] = useState({
    title: "",
    sport: "",
    venue: "",

    fromDate: "",
    toDate: "",
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Event Title is required"),
    sport: Yup.string().required("Sport is required"),
    venue: Yup.string().required("Venue is required"),
    fromDate: Yup.string().required("Start Date is required"),
    toDate: Yup.string().required("End Date is required"),
  });

  const formatDate = (datetime) => {
    return `${new Date(datetime).getFullYear()}-${`${new Date(datetime).getMonth() + 1
      }`.padStart(2, 0)}-${`${new Date(datetime).getDate()}`.padStart(
        2,
        0
      )}T${`${new Date(datetime).getHours()}`.padStart(
        2,
        0
      )}:${`${new Date(datetime).getMinutes()}`.padStart(2, 0)}`;
  }

  useEffect(() => {
    (async () => {
      const res = await axiosAuthRequest(`tournament/wrapper/${id}/`, {
        method: 'GET',
      }, false)

      const values = res.data
      values["fromDate"] = formatDate(values?.fromDate)
      values["toDate"] = formatDate(values?.toDate)

      setInitialValues({
        title: res.data?.title,
        sport: res.data?.sport,
        venue: res.data?.venue,

        fromDate: formatDate(values?.fromDate),
        toDate: formatDate(values?.toDate),
      })
    })()
  }, [])

  const handleSubmit = async (values, { setSubmitting }) => {

    const res = await axiosAuthRequest(`tournament/wrapper/${id}/`, {
      method: 'PATCH',
      data: values
    }, false)

    if (res.status === 200) {
      Toast.show({
        text: "Your Tournament was updated.",
        duration: "long",
      });
    }

    setSubmitting(false)
  }

  return (
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={onSubmit}
    // >
    //   <Form>
    //     <div className="mt-5">
    //       <div className="bg-gray-100 flex p-3 rounded-lg items-center">
    //         <DirectionsRunRoundedIcon className="text-gray-600 mr-2" />
    //         <Field
    //           className="outline-none flex-1 bg-gray-100"
    //           type="text"
    //           id="title"
    //           name="title"
    //           placeholder="Event Title *"
    //         />
    //       </div>
    //       <ErrorMessage
    //         name="title"
    //         component="div"
    //         className="error text-red-500"
    //       />
    //     </div>

    //     <div className="mt-5">
    //       <div className="bg-gray-100 flex p-3 rounded-lg items-center">
    //         <DirectionsRunRoundedIcon className="text-gray-600 mr-1" />
    //         <Field
    //           className="outline-none w-full bg-gray-100"
    //           as="select"
    //           id="sport"
    //           name="sport"
    //           placeholder="Select a sport"
    //         >
    //           <option value="">Select a sport *</option>
    //           {FORM_OPTIONS.Sports.map((sport) => (
    //             <option key={sport.value} value={sport.value}>
    //               {sport.label}
    //             </option>
    //           ))}
    //         </Field>
    //       </div>
    //       <ErrorMessage
    //         className="error text-red-500"
    //         name="sport"
    //         component="div"
    //       />
    //     </div>

    //     <div className="mt-5">
    //       <div className="bg-gray-100 flex p-3 rounded-lg items-center">
    //         <FmdGoodOutlinedIcon className="text-gray-600 mr-2" />
    //         <Field
    //           placeholder="Venue *"
    //           className="outline-none flex-1 bg-gray-100"
    //           type="text"
    //           id="venue"
    //           name="venue"
    //         />
    //       </div>
    //       <ErrorMessage
    //         className="error text-red-500"
    //         name="venue"
    //         component="div"
    //       />
    //     </div>

    //     <div className="mt-5 p-3 flex flex-col">
    //       <label htmlFor="fromDate" className="font-semibold">
    //         Start Date & Time
    //       </label>
    //       <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
    //         <Field
    //           className="outline-none flex-1 bg-gray-100"
    //           type="datetime-local"
    //           id="fromDate"
    //           name="fromDate"
    //           placeholder="Select a date"
    //         />
    //       </div>
    //       <ErrorMessage
    //         className="error text-red-500"
    //         name="fromDate"
    //         component="div"
    //       />
    //     </div>
    //     <div className="mt-5 p-3 flex flex-col">
    //       <label htmlFor="toDate" className="font-semibold">
    //         End Date & Time
    //       </label>
    //       <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
    //         <Field
    //           className="outline-none flex-1 bg-gray-100"
    //           type="datetime-local"
    //           id="toDate"
    //           name="toDate"
    //         />
    //       </div>
    //       <ErrorMessage
    //         className="error text-red-500"
    //         name="toDate"
    //         component="div"
    //       />
    //     </div>

    //     <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
    //       Save Changes
    //     </button>
    //   </Form>
    // </Formik>
    <div className="p-6">
      <NavigationHeaderComponent title={"Edit Tournament"} />
      <img src={logo} alt="" className="mb-4 mx-auto" />
      <div className="flex justify-center">
        <h1 className="text-xl font-semibold">Edit Event Details</h1>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
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

            <div className="mt-5 p-3 flex flex-col">
              <label htmlFor="fromDate" className="font-semibold">
                Start Date & Time
              </label>
              <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                <Field
                  className="outline-none flex-1 bg-gray-100"
                  type="datetime-local"
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
            <div className="mt-5 p-3 flex flex-col">
              <label htmlFor="toDate" className="font-semibold">
                End Date & Time
              </label>
              <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                <Field
                  className="outline-none flex-1 bg-gray-100"
                  type="datetime-local"
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

            <button
              type="submit"
              className="bg-orange-500 text-white flex p-3 rounded-lg w-full justify-center mt-4"
              disabled={isSubmitting}
            >
              Update Tournament Info
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditEventForm;
