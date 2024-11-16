import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File uploaded successfully
        fs.unlinkSync(localFilePath); // Remove file from local server
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove file from local server on failure
        return null;
    }
};

export { uploadOnCloudinary }; 