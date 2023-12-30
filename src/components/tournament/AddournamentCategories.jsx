import * as Yup from "yup";
import { Toast } from "@capacitor/toast";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { FORM_OPTIONS } from "../../services/misc.services";
import CustomSelect from "../../utils/CustomSelect";
import { NavigationHeaderComponent } from "../../services/header.service";
import { toFormData } from "axios";
import { axiosAuthRequest } from "../../services/api.service";


export default () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [ageOptions, setAgeOptions] = useState(FORM_OPTIONS.ageGroup);
    const [customAge, setCustomAge] = useState("");
    const [added, setAdded] = useState(null);
    const [subTournaments, setSubTournaments] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    let formik = null;

    useEffect(() => {
        if (added) {
            const timer = setTimeout(() => {
                setAdded(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [added]);

    const playAsTeams = FORM_OPTIONS.ParticipationType.filter(
        (item) =>
            item.value != "1vs1" && item.value != "2vs2" && item.value != "both"
    );
    const playAsSingles = FORM_OPTIONS.ParticipationType.filter(
        (item) => item.value === "1vs1"
    );
    const playAsBoth = FORM_OPTIONS.ParticipationType.filter(
        (item) =>
            item.value === "1vs1" || item.value === "2vs2" || item.value === "both"
    );

    const participationTypeOptions = {
        football: playAsTeams,
        basketball: playAsTeams,
        cricket: playAsTeams,
        badminton: playAsBoth,
        skating: playAsSingles,
        snooker: playAsSingles,
        table_tennis: playAsBoth,
        swimming: playAsBoth,
        hockey: playAsTeams,
    };

    const initialSubValues = {
        gender: "",
        ageGroup: [],
        description: "",

        participationType: "",
        maxNumOfTeams: "",
        numOfPlayersPerTeam: "",

        teamRegistrationFees: "",
    };

    const validationSubSchema = Yup.object().shape({
        gender: Yup.string().required("Gender is required"),
        ageGroup: Yup.array()
            .min(1, "At least one age group must be selected")
            .required("Age group is required"),

        description: Yup.string(),

        participationType: Yup.string().required("Participation Type is required"),
        maxNumOfTeams: Yup.number()
            .positive("This field must be positive")
            .required("Maximum number of teams is required"),
        numOfPlayersPerTeam: Yup.number()
            .positive("This field must be positive")
            .required("Maximum number of team members is required"),
        teamRegistrationFees: Yup.number()
            .positive("Fees must be positive")
            .required("Team Registration Fees is required."),
    });

    const addCustomAge = () => {
        if (customAge) {
            setAgeOptions((prevOptions) => [
                ...prevOptions,
                {
                    label: customAge,
                    value: customAge.toLowerCase(),
                },
            ]);
            setCustomAge("");
            setAdded("Added Custom Age Group Successfully!");
        }
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        // Populate the form with the values of the selected sub-tournament
        const selectedSubTournament = subTournaments[index];
        // Use Formik's setValues to set the form values
        formik.setValues(selectedSubTournament);
    };

    const handleSubSubmit = async (values, { setSubmitting, resetForm }) => {
        if (editingIndex !== null) {
            // If editing, replace the existing sub-tournament
            const updatedSubTournaments = [...subTournaments];
            updatedSubTournaments[editingIndex] = values;
            setSubTournaments(updatedSubTournaments);
            setEditingIndex(null);
        } else {
            // If not editing, add a new sub-tournament
            setSubTournaments([...subTournaments, values]);
        }

        setSubmitting(false);
        resetForm();
        // setAdded("Sub-tournament details added successfully!");
        Toast.show({
            text: "Tournament Categories was added",
            duration: "long",
        });
    };

    const handleCategoriesSubmit = async () => {
        if (subTournaments.length > 0) {
            const res = await axiosAuthRequest(
                `tournament/wrapper/${id}/categories/`,
                {
                    method: "post",
                    data: subTournaments,
                },
                false
            );
    
            if (res.status == 201) {
                Toast.show({
                    text: "Tournament Categories were added. Wait for the confirmation from pitstop.",
                    duration: "long",
                });
                navigate('/')
            } else {
                alert(JSON.stringify("error", res));
            }
        } else {
            Toast.show({
                text: "Please add atleast one category to submit the tournament request.",
                duration: "long",
            });
        }
    }

    return (
        <>
            <NavigationHeaderComponent title={"Add Tournament Categories"} />
            <div className="p-6 pt-2">
                <p className="text-xs text-center text-gray-500">Tournament can have multiple categories for example, badminton tournament having 2 categories that is Single (male) and Doubles (Mixed)</p>
                <Formik
                    initialValues={initialSubValues}
                    validationSchema={validationSubSchema}
                    onSubmit={handleSubSubmit}
                    innerRef={(formikRef) => (formik = formikRef)}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                        <Field
                                            className="outline-none flex-1 bg-gray-100 "
                                            placeholder="Participation Type"
                                            as="select"
                                            id="participationType"
                                            name="participationType"
                                        >
                                            <option value="">Participation Type *</option>
                                            {participationTypeOptions["badminton"]?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="participationType"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                        <Field
                                            className="outline-none flex-1 bg-gray-100"
                                            type="number"
                                            id="maxNumOfTeams"
                                            name="maxNumOfTeams"
                                            placeholder="Max no. of Teams *"
                                        />
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="maxNumOfTeams"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                        <Field
                                            className="outline-none flex-1 bg-gray-100 text-sm"
                                            type="number"
                                            id="numOfPlayersPerTeam"
                                            name="numOfPlayersPerTeam"
                                            placeholder="Max no. of Teams Members*"
                                        />
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="numOfPlayersPerTeam"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                        <Field
                                            className="outline-none flex-1 bg-gray-100"
                                            as="select"
                                            id="gender"
                                            name="gender"
                                        >
                                            <option value="">Gender *</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="all">All Genders</option>
                                        </Field>
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="gender"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                        <Field
                                            className="outline-none flex-1 bg-gray-100 focus:outline-none"
                                            name="ageGroup"
                                            options={ageOptions}
                                            component={CustomSelect}
                                            placeholder="Select Age Group *"
                                            isMulti={true}
                                        />
                                    </div>
                                    <div className="text-sm text-green-400">{added}</div>
                                    <div className="flex gap-10 justify-between mt-2">
                                        <input
                                            type="text"
                                            className="outline-none flex-1 focus:outline-none border-2 p-1"
                                            placeholder="Enter a custom age group..."
                                            value={customAge}
                                            onChange={(e) => setCustomAge(e.target.value)}
                                        />
                                        <button
                                            className="outline-none flex-1 focus:outline-none cursor-pointer bg-slate-100 hover:bg-slate-200 p-2"
                                            type="button"
                                            onClick={addCustomAge}
                                            disabled={!customAge}
                                        >
                                            Add Age Group
                                        </button>
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="ageGroup"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <CurrencyRupeeIcon className="text-gray-600 mr-2" />
                                        <Field
                                            placeholder="Team Registration Fees *"
                                            className="outline-none flex-1 bg-gray-100"
                                            type="number"
                                            id="teamRegistrationFees"
                                            name="teamRegistrationFees"
                                        />
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="teamRegistrationFees"
                                        component="div"
                                    />
                                </div>

                                <div className="mt-5">
                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                        <Field
                                            className="outline-none h-28 flex-1 bg-gray-100"
                                            as="textarea"
                                            id="description"
                                            name="description"
                                            placeholder="Any additional information you’d like to share with Pitstop about the tournament"
                                        />
                                    </div>
                                    <ErrorMessage
                                        className="error text-red-500"
                                        name="description"
                                        component="div"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`bg-white text-orange-500 flex p-3 rounded-lg w-full justify-center border-2 my-4 border-orange-500 ${isSubmitting
                                        ? "cursor-progress"
                                        : "cursor-pointer"
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {editingIndex !== null
                                        ? "Update Category"
                                        : "Add Tournament Category"}
                                </button>
                                <button
                                    type="button"
                                    className={`text-white flex p-3 rounded-lg w-full justify-center border-2 my-4 bg-orange-500 border-orange-500 ${subTournaments.length === 0
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                    onClick={handleCategoriesSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <h1 className="flex justify-center font-bold">Added Tournament Categories</h1>

                {subTournaments.map((subTour, id) => (
                    <div key={id} className="border-2 rounded-md my-2 p-4">
                        <h1 className="text-lg font-bold text-center mb-4">
                            Category {id + 1}
                        </h1>
                        <div className="mb-2">
                            <span className="font-bold">Participation Type:</span>{" "}
                            {subTour.participationType === "1vs1"
                                ? "Singles"
                                : subTour.participationType === "2vs2"
                                    ? "Doubles"
                                    : "Both"}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Maximum Number of Teams:</span>{" "}
                            {subTour.maxNumOfTeams}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">
                                Maximum Number of Players in a Team:
                            </span>{" "}
                            {subTour.numOfPlayersPerTeam}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Team Registration Fees:</span>{" "}
                            {subTour.teamRegistrationFees}
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                            <span className="font-bold">Age Groups:</span>{" "}
                            {subTour.ageGroup.map((age, index) => (
                                <div key={index} className="bg-gray-200 px-2 py-1 rounded">
                                    {age}
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={() => handleEditClick(id)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};
