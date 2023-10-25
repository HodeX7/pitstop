import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import CustomSelect from "../utils/CustomSelect";
const defaultValues = {
  multiLanguages: [],
};

const MultiSelectForm = () => {
  const [customLanguage, setCustomLanguage] = useState("");

  const [languageOptions, setLanguageOptions] = useState([
    {
      label: "Chinese",
      value: "zh-CN",
    },
    {
      label: "English (US)",
      value: "en-US",
    },
    {
      label: "English (GB)",
      value: "en-GB",
    },
    {
      label: "French",
      value: "fr-FR",
    },
    {
      label: "Spanish",
      value: "es-ES",
    },
  ]);

  const addCustomLanguage = () => {
    if (customLanguage) {
      setLanguageOptions((prevOptions) => [
        ...prevOptions,
        {
          label: customLanguage,
          value: customLanguage.toLowerCase(),
        },
      ]);
      setCustomLanguage("");
    }
  };

  const onSubmit = (values, actions) => {
    alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);
  };

  const renderForm = (formikBag) => (
    <Form>
      <Field
        className="custom-select"
        name="multiLanguages"
        options={languageOptions}
        component={CustomSelect}
        placeholder="Select multi languages..."
        isMulti={true}
      />

      <div>
        <input
          type="text"
          placeholder="Enter a custom language..."
          value={customLanguage}
          onChange={(e) => setCustomLanguage(e.target.value)}
        />
        <button
          type="button"
          onClick={addCustomLanguage}
          disabled={!customLanguage}
        >
          Add Language
        </button>
      </div>

      <button type="submit">Submit Form</button>
    </Form>
  );

  return (
    <Formik
      initialValues={defaultValues}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};

const EventTest = () => {
  return (
    <div className="app">
      <h1 className="title">Mutliselect form</h1>
      <MultiSelectForm />
    </div>
  );
};

export default EventTest;
