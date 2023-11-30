import { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Device } from '@capacitor/device';

const useCamera = ({ filename, type }) => {
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      const info = await Device.getInfo();

      if (image) {
        const pictureInfo = {
          name: `${filename}.${image.format}`,
          uri: (info.platform === 'web') ? image.webPath : image.path,
          type: `${type}/${image.format}`,
          imageUrl: image.webPath,
        };
        setPicture(pictureInfo);
        setError(null);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      setError(error);
    }
  };

  const removePicture = () => {
    setPicture(null);
  }

  return [ picture, error, takePicture, removePicture ];
};

export default useCamera;
