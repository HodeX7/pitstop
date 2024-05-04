import * as Yup from "yup";
import { Toast } from "@capacitor/toast";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  CATEGORIES_GENERATION,
  FORM_CONDITIONS,
  FORM_OPTIONS,
} from "../../services/misc.services";
import CustomSelect from "../../utils/CustomSelect";
import { NavigationHeaderComponent } from "../../services/header.service";
import { axiosAuthRequest } from "../../services/api.service";
import Shimmer from "../Shimmer";

const AddTournamentCategories = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addedCategoriesView = useRef(null);

  const [ageOptions, setAgeOptions] = useState(FORM_OPTIONS.ageGroup);
  const [customAge, setCustomAge] = useState("");
  const [added, setAdded] = useState(null);
  const [subTournaments, setSubTournaments] = useState([]);
  const [tournamentWrapper, setTournamentWrapper] = useState();
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

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosAuthRequest(
          `tournament/wrapper/${id}/get_categories/`,
          {
            method: "GET",
          },
          false
        );

        if (res.status === 200) {
          setSubTournaments(res.data);
        }
      } catch (err) {
        console.log(err);
      }

      const tourney = await axiosAuthRequest(
        `tournament/wrapper/${id}/`,
        {
          method: "GET",
        },
        false
      );

      if (tourney.status === 200) {
        setTournamentWrapper(tourney.data);
      }
    })();
  }, []);

  const initialSubValues = {
    gender: "",
    additionalDetails: [],
    description: "",

    participationType: "",
    subCategory: null,
    maxNumOfTeams: "",
    numOfPlayersPerTeam: null,

    teamRegistrationFees: "",
    singlesRegistrationFees: null,
    doublesRegistrationFees: null,
  };

  const validationSubSchema = Yup.object().shape({
    gender: Yup.string().required("Gender is required"),
    additionalDetails: Yup.array()
      .min(1, "At least one age group must be selected")
      .required("Age group is required"),

    description: Yup.string(),

    participationType: Yup.string().nullable(),
    subCategory: Yup.string().nullable(),
    maxNumOfTeams: Yup.number()
      .positive("This field must be positive")
      .required("Maximum number of teams is required"),
    numOfPlayersPerTeam: Yup.number()
      .positive("This field must be positive")
      .nullable(),
    teamRegistrationFees: Yup.number()
      .positive("Fees must be positive")
      .nullable(),

    singlesRegistrationFees: Yup.number()
      .positive("Fees must be positive")
      .nullable(),
    doublesRegistrationFees: Yup.number()
      .positive("Fees must be positive")
      .nullable(),
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeSubCategory = (id) => {
    setSubTournaments([
      ...subTournaments.slice(0, id),
      ...subTournaments.slice(id + 1),
    ]);
  };

  const handleSubSubmit = (values, { setSubmitting, resetForm }) => {
    if (editingIndex !== null) {
      // If editing, replace the existing sub-tournament
      const updatedSubTournaments = [...subTournaments];
      updatedSubTournaments[editingIndex] = values;
      setSubTournaments(updatedSubTournaments);
      setEditingIndex(null);
    } else {
      // If not editing, add a new sub-tournament

      const generatedCategories = generateCategoriesCombinations(
        values.participationType.toLowerCase(),
        values.subCategories,
        values.gender.toLowerCase(),
        tournamentWrapper?.sport,
        values.singlesRegistrationFees,
        values.doublesRegistrationFees,
        values.teamRegistrationFees
      );
      console.log(generatedCategories);

      // generatedCategories.map(category => {
      //     setSubTournaments([...subTournaments, {
      //         ...values,
      //         ...category
      //     }])
      // })
      const updatedTournaments = generatedCategories.map((category) => ({
        ...values,
        ...category,
      }));

      // Update the state once with all changes
      setSubTournaments((prevSubTournaments) => [
        ...prevSubTournaments,
        ...updatedTournaments,
      ]);

      addedCategoriesView.current.scrollIntoView({ behavior: "smooth" });

      console.log(subTournaments);
    }

    setSubmitting(false);
    // resetForm();

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
        navigate(-1);
      } else {
        alert(JSON.stringify("error", res));
      }
    } else {
      Toast.show({
        text: "Please add atleast one category to submit the tournament request.",
        duration: "long",
      });
    }
  };

  const getCategoryObject = (pc, sc, g, trf = null) =>
    new Object({
      participationType: pc.toLowerCase() || null,
      subCategory: sc || null,
      gender: g,
      teamRegistrationFees: trf,
    });

  // participation type, sub category, .., ..., team reg singles, team reg doubles
  const generateCategoriesCombinations = (
    pt,
    sc,
    gender,
    sport,
    trs,
    trd,
    trf
  ) => {
    const categories = [];
    console.log("ye ayaa form se : ", pt, sc, gender);

    if (gender === "all" && pt === "both") {
      // Iterate over participation types and subcategories
      for (const _pt of CATEGORIES_GENERATION[sport].pt) {
        for (const _sc of CATEGORIES_GENERATION[sport].sc) {
          // Generate categories for male and female
          categories.push(
            getCategoryObject(_pt, _sc, "male", _pt === "singles" ? trs : trd)
          );
          categories.push(
            getCategoryObject(_pt, _sc, "female", _pt === "singles" ? trs : trd)
          );
        }
      }
      categories.push(getCategoryObject("doubles", sc, "all", trd));
    } else {
      // If PT is Both
      if (pt === "both") { // for table tennis and badminton
        for (const _pt of CATEGORIES_GENERATION[sport].pt) {
          for (const _sc of CATEGORIES_GENERATION[sport].sc) {
            // Generate Both categories for the gender
            categories.push(
              getCategoryObject(_pt, _sc, gender, _pt === "singles" ? trs : trd)
            );
          }
        }
      } else if (gender === "all" && pt) { // If All genders but particular PT
        for (const _sc of CATEGORIES_GENERATION[sport].sc) {
          categories.push(getCategoryObject(pt, _sc, "male", trf));
          categories.push(getCategoryObject(pt, _sc, "female", trf));
          if (pt === "doubles") {
            categories.push(
              getCategoryObject(pt, _sc, "all", pt === "singles" ? trs : trd)
            );
          }
        }
      } else {
        if (!pt) { // cricket basketball football
          categories.push(getCategoryObject(pt, sc, "male", trf));
          categories.push(getCategoryObject(pt, sc, "female", trf));
        } else {
          categories.push(getCategoryObject(pt, sc, gender, trf));
        }
      }
    }

    return categories;
  };

  const SPORT = "skating";

  // if (!tournamentWrapper) {
  //     return <Shimmer />
  // }

  return (
    <>
      <NavigationHeaderComponent title={"Add Tournament Categories"} />

      {tournamentWrapper ? (
        <div className="p-6 pt-2">
          <p className="text-xs text-center text-gray-500">
            Tournament can have multiple categories for example, badminton
            tournament having 2 categories that is Single (Male) and Doubles
            (Mixed)
          </p>
          <Formik
            initialValues={initialSubValues}
            validationSchema={validationSubSchema}
            onSubmit={handleSubSubmit}
            enableReinitialize={true}
            innerRef={(formikRef) => (formik = formikRef)}
          >
            {({ isSubmitting, values, submitForm }) => (
              <Form>
                <div>
                  {FORM_CONDITIONS[tournamentWrapper?.sport]
                    .participationType && (
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
                            {FORM_CONDITIONS[
                              tournamentWrapper?.sport
                            ].participationType.map((type, idx) => (
                              <option key={idx} values={type.value}>
                                {type.label}
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
                    )}

                  {FORM_CONDITIONS[tournamentWrapper?.sport].subCategories && (
                    <div className="mt-5">
                      <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                        <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                        <Field
                          className="outline-none flex-1 bg-gray-100 "
                          placeholder="Sub Categories"
                          as="select"
                          id="subCategories"
                          name="subCategories"
                        >
                          <option value="">Sub Categories *</option>
                          {FORM_CONDITIONS[
                            tournamentWrapper?.sport
                          ].subCategories.map((category, idx) => (
                            <option key={idx} values={category}>
                              {category}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage
                        className="error text-red-500"
                        name="subCategories"
                        component="div"
                      />
                    </div>
                  )}

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

                  {FORM_CONDITIONS[tournamentWrapper?.sport].noOfPlayers && (
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
                  )}

                  <div className="mt-5">
                    <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                      <PeopleAltOutlinedIcon className="text-gray-600 mr-2" />
                      <Field
                        className="outline-none flex-1 bg-gray-100 focus:outline-none"
                        name="additionalDetails"
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
                      name="additionalDetails"
                      component="div"
                    />
                  </div>

                  {values.participationType.toLowerCase() === "both" ? (
                    <>
                      <div className="mt-5">
                        <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                          <CurrencyRupeeIcon className="text-gray-600 mr-2" />
                          <Field
                            placeholder="Singles Registration Fees *"
                            className="outline-none flex-1 bg-gray-100"
                            type="number"
                            id="singlesRegistrationFees"
                            name="singlesRegistrationFees"
                          />
                        </div>
                        <ErrorMessage
                          className="error text-red-500"
                          name="singlesRegistrationFees"
                          component="div"
                        />
                      </div>
                      <div className="mt-5">
                        <div className="bg-gray-100 flex p-3 rounded-lg items-center">
                          <CurrencyRupeeIcon className="text-gray-600 mr-2" />
                          <Field
                            placeholder="Doubles Registration Fees *"
                            className="outline-none flex-1 bg-gray-100"
                            type="number"
                            id="doublesRegistrationFees"
                            name="doublesRegistrationFees"
                          />
                        </div>
                        <ErrorMessage
                          className="error text-red-500"
                          name="doublesRegistrationFees"
                          component="div"
                        />
                      </div>
                    </>
                  ) : (
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
                  )}

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
                    className={`bg-white text-orange-500 flex p-3 rounded-lg w-full justify-center border-2 my-4 border-orange-500 ${isSubmitting ? "cursor-progress" : "cursor-pointer"
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
          <h1
            className="flex justify-center font-bold"
            id="added-tournament-categories"
            ref={addedCategoriesView}
          >
            Added Tournament Categories
          </h1>

          {subTournaments?.map((subTour, id) => (
            <div key={id} className="border-2 rounded-md my-2 p-4">
              <h1 className="text-lg font-bold text-center mb-4">
                {subTour.participationType && `${subTour.participationType} - `}{" "}
                {subTour.subCategory && `${subTour.subCategory} - `}{" "}
                {subTour.gender}
              </h1>
              {FORM_CONDITIONS[tournamentWrapper?.sport].subCategories && (
                <div className="mb-2">
                  <span className="font-bold">Participation Type:</span>{" "}
                  {subTour.participationType}
                </div>
              )}
              {FORM_CONDITIONS[tournamentWrapper?.sport].subCategories && (
                <div className="mb-2">
                  <span className="font-bold">Sub Category:</span>{" "}
                  {subTour.subCategory}
                </div>
              )}
              <div className="mb-2">
                <span className="font-bold">Gender:</span> {subTour.gender}
              </div>
              <div className="mb-2">
                <span className="font-bold">Maximum Number of Teams:</span>{" "}
                {subTour.maxNumOfTeams}
              </div>
              {FORM_CONDITIONS[tournamentWrapper?.sport].noOfPlayers && (
                <div className="mb-2">
                  <span className="font-bold">
                    Maximum Number of Players in a Team:
                  </span>{" "}
                  {subTour.numOfPlayersPerTeam}
                </div>
              )}
              <div className="mb-2">
                <span className="font-bold">Team Registration Fees:</span>{" "}
                {subTour.teamRegistrationFees}
              </div>
              <div className="flex gap-2 items-center mb-2">
                <span className="font-bold">Age Groups:</span>{" "}
                {subTour?.ageGroup?.map((age, index) => (
                  <div key={index} className="bg-gray-200 px-2 py-1 rounded">
                    {age}
                  </div>
                ))}
                {subTour?.additionalDetails?.map((age, index) => (
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
              <button
                className="bg-red-500 text-white p-2 rounded ml-4"
                onClick={() => removeSubCategory(id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Shimmer />
      )}
    </>
  );
};

export default AddTournamentCategories;
