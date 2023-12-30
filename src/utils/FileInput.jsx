import React from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";

const FileInput = ({ picture, error, takePicture, removePicture }) => {
  return (
    <div className="flex flex-col items-center">
      {picture ? (
        <div className="mb-4">
          <img
            src={picture.imageUrl}
            alt="Uploaded"
            className="w-64 h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => removePicture()}
            className="mt-2 bg-red-500 text-white py-1 px-4 rounded"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => takePicture()}
          className="cursor-pointer bg-orange-500 text-white py-1 px-4 rounded"
        >
          Upload Image
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileInput;

export const loadAndDisplayImage = (imageData) => {
  try {
    const base64Data = `data:${imageData.mimeType};base64,${imageData.data}`;
    return base64Data;
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

export const base64ToBlob = (base64String, contentType = "image/jpeg") => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};
