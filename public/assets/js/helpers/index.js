import axios from "axios";

export const getImageAsBase64  = async (imgUrl, callback) => {
  try {
    const response = await axios.get(imgUrl, {
      responseType: 'blob',
    });
    const blob = response.data;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      callback(base64String)
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error fetching image or converting to base64:', error);
  }
}
 