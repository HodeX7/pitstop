import { Formik, Field, ErrorMessage, FieldArray, Form } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import logo from "../../assets/ParticipantsFormLogo.png";
import { useParams } from "react-router-dom";
import FileInput, { loadAndDisplayImage } from "../../utils/FileInput";
import { useState, useEffect } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Team name is required"),
  participantsDetails: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      age: Yup.number().required("Age is required"),
      id_proof: Yup.mixed().required("Identity Proof is required"),
    })
  ),
});

const ParticipantForm = ({
  tournament,
  numberOfCards,
  ageGroups,
  continueNextPage,
  form,
  setForm,
}) => {
  const { id } = useParams();

  const [cards, setCards] = useState(0);

  // useEffect(() => {
  //   if (values.participationType === "2v2") {
  //     setCards(2);
  //   }
  // }, [])

  useEffect(() => {
    setCards(numberOfCards);
  }, [numberOfCards]);

  const [participantsDetails, setParticipantsDetails] = useState(
    Array.from({ length: numberOfCards }, () => ({
      name: "",
      gender: "",
      age: "",
      id_proof: {},
    }))
  );

  const initialValues = {
    name: form.data.name,
    ageGroup: ageGroups[0],
    participationType: form.data.participationType || "1v1",
    participantsDetails: participantsDetails,
  };

  const [pictures, setPictures] = useState({});
  const acceptingFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  const handleSetPictures = async (index, setFieldValue) => {
    const res = await FilePicker.pickFiles({
      types: acceptingFileTypes,
      multiple: false,
      readData: true,
    });
    const fileObj = res.files[0];

    setPictures((prev) => ({ ...prev, [index]: fileObj }));
    const updatedParticipants = participantsDetails.map((participant, i) =>
      i === index ? { ...participant, id_proof: fileObj } : participant
    );

    setParticipantsDetails(updatedParticipants);

    setFieldValue(`participantsDetails[${index}].id_proof`, fileObj);
  };

  const handleCardsChange = (e, setFieldValue) => {
    const val = e.target.value;

    if (val === "2v2") {
      setFieldValue("participationType", "2v2");
      setCards(2);
      setParticipantsDetails(
        Array.from({ length: 2 }, () => ({
          name: "",
          gender: "",
          age: "",
          id_proof: {},
        }))
      );
    } else {
      setFieldValue("participationType", "1v1");
      setCards(1);
      setParticipantsDetails(
        Array.from({ length: 1 }, () => ({
          name: "",
          gender: "",
          age: "",
          id_proof: {},
        }))
      );
    }
  };

  const handleSubmit = (values) => {
    // console.log("form", form); // idhar pe pura values bara bar aara
    setTimeout(() => {
      // dispatch(update({ data: values }));
      setForm((prevState) => ({
        ...prevState,
        data: values,
      }));
      continueNextPage("player_pay");
      // setSubmitting(false);
    }, 500);
  };

  const addParticipant = () => {
    setCards((prev) => prev + 1);
  };

  return (
    <div className="p-6">
      <img src={logo} alt="" className="mx-auto mb-4" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, errors }) => (
          <Form encType="multipart/form-data">
            <div className="mt-5">
              <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                <PersonOutlineOutlinedIcon className="text-gray-600 mr-2" />
                <Field
                  className="outline-none flex-1 bg-gray-100"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Team Name *"
                />
              </div>
              <ErrorMessage
                name="name"
                component="div"
                className="error text-red-500"
              />
            </div>

            {ageGroups.length !== 0 && (
              <div className="mt-5">
                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                  <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                  <Field
                    className="outline-none flex-1 bg-gray-100"
                    as="select"
                    id="ageGroup"
                    name="ageGroup"
                    placeholder="Select Age Group to apply for"
                  >
                    {ageGroups?.map((group, index) => (
                      <option key={index} value={group}>
                        {group}
                      </option>
                    ))}
                  </Field>
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="ageGroup"
                  component="div"
                />
              </div>
            )}

            {tournament.participationType === "both" ? (
              <div className="mt-5">
                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                  <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                  <select
                    className="outline-none flex-1 bg-gray-100"
                    id="participationType"
                    name="participationType"
                    placeholder="Select Your Participation Type"
                    onChange={(e) => handleCardsChange(e, setFieldValue)}
                  >
                    <option value={"1v1"}>Singles</option>
                    <option value={"2v2"}>Doubles</option>
                  </select>
                </div>
                <ErrorMessage
                  className="error text-red-500"
                  name="ageGroup"
                  component="div"
                />
              </div>
            ) : null}

            <div className="flex mt-7 pl-0 justify-between items-center">
              <h1 className="text-md font-[600]">
                Enter Participant Details ({cards})
              </h1>
              {/* This would be only visible for team sports. New state isTeam -> boolean. Need to make an API call onComponentMount */}
              {tournament?.participationType !== "1vs1" &&
              tournament?.participationType !== "2vs2" &&
              tournament?.participationType !== "both" ? (
                <button
                  className="border-2 border-orange-500 rounded-lg p-2"
                  type="button"
                  onClick={addParticipant}
                >
                  Add
                </button>
              ) : null}
            </div>
            <FieldArray name="participantsDetails">
              {() => (
                <>
                  {cards > 0 &&
                    Array.from({ length: cards }).map((_, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-4 border-gray-200 mb-3"
                      >
                        <h2 className="text-sm">Participant #{index + 1}</h2>
                        <div className="mt-3">
                          <div className="bg-gray-100 flex p-3 rounded-lg  flex-col">
                            <div className="flex">
                              <PersonOutlineOutlinedIcon className="text-gray-600 mr-2" />
                              <Field
                                name={`participantsDetails[${index}].name`}
                                type="text"
                                placeholder="Name *"
                                className="outline-none bg-gray-100"
                              />
                            </div>
                          </div>
                          <ErrorMessage
                            name={`participantsDetails[${index}].name`}
                            component="div"
                            className="error text-red-500"
                          />
                        </div>

                        <div className="mt-3 flex justify-between">
                          <div className="flex flex-col">
                            <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                              <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                              <Field
                                as="select"
                                placeholder="Gender *"
                                className="outline-none bg-gray-100 md:w-28 w-[4.5rem] flex-1"
                                id={`participantsDetails[${index}].gender`}
                                name={`participantsDetails[${index}].gender`}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </Field>
                            </div>
                            <ErrorMessage
                              name={`participantsDetails[${index}].gender`}
                              component="div"
                              className="error text-red-500"
                            />
                          </div>

                          <div className="flex flex-col">
                            <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                              <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                              <Field
                                className="outline-none bg-gray-100 md:w-28 w-[4rem] flex-1"
                                placeholder="Age *"
                                type="number"
                                id="age"
                                name={`participantsDetails[${index}].age`}
                              />
                            </div>
                            <ErrorMessage
                              name={`participantsDetails[${index}].age`}
                              component="div"
                              className="error text-red-500"
                            />
                          </div>
                        </div>

                        {/* This needs refactoring, placeholder should be displayed, upload pdf file logic, changing upin and cross button on toggle the file  */}
                        <div className="mt-3">
                          <label>
                            ID Proof<span className="text-red-500"> *</span>{" "}
                            <span className="text-xs">(Aadhar/Passport)</span>
                          </label>
                          <div className="bg-gray-100 flex p-3 rounded-lg flex-col">
                            <div className="flex flex-col items-center">
                              <div className="mb-4">
                                {pictures[index] ? (
                                  <>
                                    {["application/pdf"].includes(
                                      pictures[index].mimeType
                                    ) ? (
                                      <h1>
                                        {" "}
                                        <strong>Uploaded PDF:</strong>{" "}
                                        {pictures[index].name}
                                      </h1>
                                    ) : (
                                      <img
                                        src={loadAndDisplayImage(
                                          pictures[index]
                                        )}
                                        alt="Uploaded"
                                        className="w-64 h-64 object-cover"
                                      />
                                    )}
                                  </>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSetPictures(
                                      index,
                                      setFieldValue,
                                      errors
                                    )
                                  }
                                  className="cursor-pointer bg-orange-500 text-white py-1 px-4 mt-4 ml-10 rounded"
                                >
                                  Upload Image / PDF
                                </button>
                              </div>
                              {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
                            </div>
                            {/* <input
                              type="file"
                              placeholder="Identity Proof"
                              className="outline-none bg-gray-100 flex-1"
                              onChange={(event) =>
                                handleFileUpload(event, index, setFieldValue)
                              }
                            /> */}
                            {/* <ErrorMessage
                              name={`participantsDetails[${index}].id_proof`}
                              component="div"
                              className="error"
                            /> */}
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </FieldArray>

            <button
              type="submit"
              className={`text-white flex p-3 rounded-lg mt-6 w-full justify-center ${
                isSubmitting || !isValid || !dirty
                  ? "cursor-not-allowed bg-orange-200"
                  : "cursor-pointer bg-orange-500"
              }`}
              disabled={isSubmitting || !isValid || !dirty}
              onClick={handleSubmit}
            >
              Continue
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
ParticipantForm.propTypes = {
  tournament: PropTypes.object.isRequired,
  numberOfCards: PropTypes.number.isRequired,
  ageGroups: PropTypes.array.isRequired,
  continueNextPage: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
};

export default ParticipantForm;
