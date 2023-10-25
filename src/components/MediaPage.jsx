import PropTypes from "prop-types";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import MediaPopup from "./MediaPopup";
import { API_MEDIA, API_URL } from "../services/api.service";

const MediaPage = ({ files, media, setMedia }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  const handleEditClick = (index) => {
    setSelectedFileIndex(index);
  };

  const handleFileEdit = (newName) => {
    // Handle editing the file name in your media array
    const updatedMedia = [...media];
    updatedMedia[selectedFileIndex].editedName = newName;
    setMedia(updatedMedia);
  };

  const handleFileDelete = (fileToDelete) => {
    // Handle deleting the file from your media array
    const updatedMedia = media.filter((file) => file !== fileToDelete);
    setMedia(updatedMedia);
  };

  const renderMediaPreview = (file) => {
    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      return (
        <img className="" src={URL.createObjectURL(file)} alt={file.name} />
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <video className="" controls>
          <source src={URL.createObjectURL(file)} type={fileType} />
        </video>
      );
    } else {
      return (
        <div>
          <p>Unsupported file type: {file.name}</p>
        </div>
      );
    }
  };

  const renderFilePreview = (file) => {
    const fileType = file.media_type;
    if (fileType === "image") {
      return (
        <img className="" src={API_MEDIA + file.media_file.url} alt={file.media_file.name} />
      );
    } else if (fileType === "video") {
      return (
        <video controls>
          <source src={API_MEDIA + file.media_file.url} />
        </video>
      );
    }
    return null;
  };

  return (
    <>
      <div className="p-6 min-h-screen flex flex-col items-center">
        <h1 className="font-semibold">{`Media (${media.length + files?.length})`}</h1>
        {files?.length > 0 && files?.map((file, index) => (
          <div key={index} className="my-4">
            {renderFilePreview(file)}
            <div>
              <div className="flex mt-2 justify-between">
                <h1 className="font-semibold">
                  {file.title}
                </h1>
                <EditIcon
                  className="cursor-pointer"
                // onClick={() => handleEditClick(index)}
                />
              </div>
              <div className="flex justify-between mt-2">
                <h1>{file.views} views</h1>
                <h1>July 01 2023</h1>
              </div>
            </div>
          </div>
        ))}

        {media.map((file, index) => (
          <div key={index} className="my-4">
            {renderMediaPreview(file)}
            <div>
              <div className="flex mt-2 justify-between">
                <h1 className="font-semibold">
                  {file.editedName?.name || file.name}
                </h1>
                <EditIcon
                  className="cursor-pointer"
                  onClick={() => handleEditClick(index)}
                />
              </div>
              <div className="flex justify-between mt-2">
                <h1>12,34,567 views</h1>
                <h1>July 01 2023</h1>
              </div>
            </div>
            {selectedFileIndex === index && (
              <MediaPopup
                file={file}
                onEdit={handleFileEdit}
                onDelete={handleFileDelete}
                onClose={() => setSelectedFileIndex(null)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

MediaPage.propTypes = {
  media: PropTypes.array.isRequired,
  setMedia: PropTypes.func.isRequired,
};

export default MediaPage;
