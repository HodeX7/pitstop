import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import DirectionsRunRoundedIcon from "@mui/icons-material/FmdGoodOutlined";
import { FORM_OPTIONS } from "../../services/misc.services";

const EditEventForm = ({ initialValues, onSubmit }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Event Title is required"),
    sport: Yup.string().required("Sport is required"),
    venue: Yup.string().required("Venue is required"),
    fromDate: Yup.string().required("Start Date is required"),
    toDate: Yup.string().required("End Date is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
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

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Save Changes
        </button>
      </Form>
    </Formik>
  );
};

export default EditEventForm;
