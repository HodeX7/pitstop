import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/ParticipantsFormLogo.png";
import { Formik, Form, Field, ErrorMessage } from "formik";

import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { FORM_OPTIONS } from "../../services/misc.services";
import { TournamentAPI, useAxios } from "../../services/api.service";
import { NavigationHeaderComponent } from "../../services/header.service"
import Shimmer from "../Shimmer";
import { Toast } from "@capacitor/toast";

const EditTournamentForm = () => {
    const { id } = useParams();
    // const [tournament, setTournament] = useState()
    const [tournament, isReady] = useAxios({
        url: `tournament/${parseInt(id)}`,
        method: "get",
    });
    const [initialValues, setInitialValues] = useState({
        title: "",
        sport: "",
        venue: "",
        gender: "",
        description: "",

        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",

        participationType: "",
        maxNumOfTeams: "",
        numOfPlayersPerTeam: "",

        teamRegistrationFees: ""
    })

    const playAsTeams = FORM_OPTIONS.ParticipationType.filter(item => item.value != '1vs1' && item.value != '2vs2')
    const playAsSingles = FORM_OPTIONS.ParticipationType.filter(item => item.value === '1vs1')
    const playAsBoth = FORM_OPTIONS.ParticipationType.filter(item => item.value === '1vs1' || item.value === '2vs2')

    const participationTypeOptions = {
        football: playAsTeams,
        basketball: playAsTeams,
        cricket: playAsTeams,
        badminton: playAsBoth,
        skating: playAsSingles,
        snooker: playAsSingles,
        table_tennis: playAsBoth,
        swimming: playAsBoth,
        hockey: playAsTeams
    };

    const ref = useRef(null);

    const maxNumOfTeamsOptions = Array.from({ length: 19 }, (_, index) => index + 2);
    const numOfPlayersPerTeamOptions = Array.from(
        { length: 11 },
        (_, index) => index + 1
    );

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Event Title is required"),
        sport: Yup.string().required("Sport is required"),
        venue: Yup.string().required("Venue is required"),
        gender: Yup.string().required("Gender is required"),
        description: Yup.string(),

        fromDate: Yup.string().required("Start Date is required"),
        toDate: Yup.string().required("End Date is required"),
        fromTime: Yup.string().required("Start Time is required"),
        toTime: Yup.string().required("End Time is required"),

        participationType: Yup.string().required("Participation Type is required"),
        maxNumOfTeams: Yup.string().required("Maximum number of teams is required"),
        numOfPlayersPerTeam: Yup.string().required(
            "Maximum number of team members is required"
        ),
        teamRegistrationFees: Yup.number().positive('Fees must be positive').required('Team Registration Fees is required.')
    });

    useEffect(() => {
        if (isReady) {
            setInitialValues(prevValues => {
                const updatedValues = { ...prevValues };
    
                Object.keys(updatedValues).forEach(key => {
                    if (tournament.hasOwnProperty(key)) {
                        updatedValues[key] = tournament[key];
                    }
                });
    
                return updatedValues;
            });
        }
    }, [isReady])

    const handleSubmit = (values, { setSubmitting }) => {
        TournamentAPI.updateTournament(id, values)
            .then(res => {
                if (res.status == 200) {
                    Toast.show({
                        text: "Your tournament was updated!",
                        duration: "long"
                    })
                }
            })
            .catch(err => {
                alert(JSON.stringify(err))
            })

        setSubmitting(false);
    };

    return (
        <>
            {isReady ? (
                <>
                    {!tournament?.user_is_host ? (
                        <h1 className="p-6 text-2xl">Page Not Found</h1>
                    ) : (
                        <>
                            <div className="p-6">
                                <NavigationHeaderComponent title="Edit Tournament" />
                                <img src={logo} alt="" />
                                <div className="flex justify-center">
                                    <h1 className="text-xl font-semibold">Enter Event Details</h1>
                                </div>
                                <Formik
                                    enableReinitialize
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
                                                        placeholder="Event Title"
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
                                                        <option value="">Select a sport</option>
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
                                                        placeholder="Venue"
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
        
                                            {/* Apply From To placeholders in date and time and also do start end date validation, start < end, start and end date should be in the future  - Dhruv */}
                                            <div className="mt-5 flex justify-between items-center">
                                                <div>
                                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center ">
                                                        <Field
                                                            className="outline-none bg-gray-100"
                                                            type="date"
                                                            id="fromDate"
                                                            name="fromDate"
                                                        />
                                                    </div>
                                                    <ErrorMessage
                                                        className="error text-red-500"
                                                        name="fromDate"
                                                        component="div"
                                                    />
                                                </div>
                                                <span>-</span>
                                                <div>
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
                                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center w-36 ">
                                                        <Field
                                                            className="outline-none  bg-gray-100 "
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
                                                <span>-</span>
                                                <div className="flex flex-col">
                                                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                                        <Field
                                                            className="outline-none bg-gray-100"
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
                                                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                                    <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                                    <Field
                                                        className="outline-none flex-1 bg-gray-100 "
                                                        placeholder="Participation Type"
                                                        as="select"
                                                        id="participationType"
                                                        name="participationType"
                                                    >
                                                        <option value="">Participation Type</option>
                                                        {ref.current &&
                                                            ref.current.values.sport &&
                                                            participationTypeOptions[ref.current.values.sport]?.map(
                                                                (option) => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                )
                                                            )}
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
                                                        as="select"
                                                        id="maxNumOfTeams"
                                                        name="maxNumOfTeams"
                                                    >
                                                        <option value="">Maximum number of teams</option>
                                                        {maxNumOfTeamsOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </Field>
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
                                                        className="outline-none flex-1 bg-gray-100"
                                                        as="select"
                                                        id="numOfPlayersPerTeam"
                                                        name="numOfPlayersPerTeam"
                                                    >
                                                        <option value="">Maximum number of team members</option>
                                                        {numOfPlayersPerTeamOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </Field>
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
                                                        <option value="">Gender</option>
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
        
                                            {/* <div className="mt-5">
                                                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                                    <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                                                    <Field
                                                        className="outline-none flex-1 bg-gray-100"
                                                        as="select"
                                                        id="ageGroup"
                                                        name="ageGroup"
                                                    >
                                                        <option value="">Age group</option>
                                                        {FORM_OPTIONS.ageGroup.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </div>
                                                <ErrorMessage
                                                    className="error text-red-500"
                                                    name="ageGroup"
                                                    component="div"
                                                />
                                            </div> */}
        
                                            <div className="mt-5">
                                                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                                    <CurrencyRupeeIcon className="text-gray-600 mr-2" />
                                                    <Field
                                                        placeholder="Team Registration Fees"
                                                        className="outline-none flex-1 bg-gray-100"
                                                        type="number"
                                                        id="teamRegistrationFees"
                                                        name="teamRegistrationFees"
                                                    />
                                                </div>
                                                <ErrorMessage className="error text-red-500" name="teamRegistrationFees" component="div" />
                                            </div>
        
                                            <div className="mt-5">
                                                <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                                                    <Field
                                                        className="outline-none h-28 flex-1 bg-gray-100"
                                                        as="textarea"
                                                        id="description"
                                                        name="description"
                                                        placeholder="Type any additional instructions for Event"
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
                                                className="bg-orange-500 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
                                                disabled={isSubmitting}
                                            >
                                                Submit Details
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </>
                    )}
                </>
            ) : <Shimmer />}
        </>
    );
};

export default EditTournamentForm;
