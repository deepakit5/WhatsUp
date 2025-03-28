import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath, mediaType, folder) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.log('localFilePath does not got');
      return null;
    }

    // configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // //////////console.log(
    //   "localFilePath, mediaType, folder: ",
    //   localFilePath,
    //   mediaType,
    //   folder
    // );
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: mediaType,
      folder: `WhatsUp/${folder}`,
      // public_id: "avatar333",
    });
    console.log('file is uploaded on cloudinary ', response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.log('error in cloudinary- ', error);
    return null;
  }
};

export {uploadOnCloudinary};
