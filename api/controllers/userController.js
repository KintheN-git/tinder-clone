import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;
    let updatedData = otherData;

    // resim varsa yukle
    if (image) {
      // resim base64 olarak geldiyse
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (error) {
          console.log("Error uploading image:", error);
          return res
            .status(400)
            .json({ success: false, message: "Image upload failed" });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
