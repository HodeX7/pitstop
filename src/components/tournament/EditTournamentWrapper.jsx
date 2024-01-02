import { useState, useEffect } from "react";
import EditEventForm from "./EditEventForm";
import { useParams } from "react-router-dom";

const EditTournamentWrapper = () => {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    // Fetch event details from the backend
  }, [id]);

  const handleSubmit = (values) => {
    // Submit updated details to the backend
  };

  return (
    <div>
      {console.log("first")}
      <h2>Edit Event</h2>
      <EditEventForm initialValues={eventDetails} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditTournamentWrapper;
