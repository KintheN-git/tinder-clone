import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { ...otherData } = req.body;
    let updatedData = otherData;

    // Dosya varsa Cloudinary'ye yükle
    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Error uploading image:", error);
              return res
                .status(400)
                .json({ success: false, message: "Image upload failed" });
            }
            updatedData.image = result.secure_url;
            updateUserProfile(req, res, updatedData);
          }
        );

        uploadResponse.end(req.file.buffer);
      } catch (error) {
        console.error("Error uploading image:", error);
        return res
          .status(400)
          .json({ success: false, message: "Image upload failed" });
      }
    } else {
      updateUserProfile(req, res, updatedData);
    }
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res, updatedData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};
