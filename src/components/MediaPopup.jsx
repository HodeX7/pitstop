import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

const MediaPopup = ({ file, onEdit, onDelete, onClose }) => {
  const [editedName, setEditedName] = useState(
    file.editedName?.name || file.name
  );

  const handleSave = () => {
    const updatedFile = new File([file], editedName, { type: file.type });
    onEdit(updatedFile);
    onClose();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 flex justify-center items-center h-screen">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{file.name}</h2>
          <button onClick={onClose} className="text-gray-600">
            Close
          </button>
        </div>
        <div>
          <label className="block mb-2">New Name:</label>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full border rounded p-1"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => onDelete(file)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

MediaPopup.propTypes = {
  file: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MediaPopup;
