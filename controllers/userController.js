import { StatusCodes } from 'http-status-codes';
import userModel from '../models/userModel.js';
import trendModel from '../models/trendModel.js';
import fs from 'fs/promises'; //allows to remove the image
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
/**
 * Since the user is authenticated using cookie token on the backend we need to send data about the user
 * This is where this data is passed to the frontend
 */

//GET CURRENT USER retrieved every time user is in the dashboard
export const getCurrentUser = async (req, res) => {
  const userID = req.user.userID;
  const user = await userModel.findOne({ _id: userID }); //NOTE user data is stored and managed server-side with JWT
  const approvedTrends = await trendModel.countDocuments({
    createdBy: userID,
    isApproved: true,
  }); //user stats
  const submittedTrends = await trendModel.countDocuments({
    createdBy: userID,
  }); //user stats
  const totalSiteTrends = await trendModel.countDocuments(); // this is a total trends, not user-specific
  const totalTrendViews = await trendModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userID) } }, //referencing the user with $match user specific
    { $group: { _id: null, totalViews: { $sum: '$views' } } }, //
  ]); //using mongodb aggregation operation (looks for array) to count views of each trend
  const viewsResult =
    totalTrendViews.length > 0 ? totalTrendViews[0].totalViews : 0;
  const userControlled = user.toJSON(); //userControlled is user without password implemented in the model
  res.status(StatusCodes.OK).json({
    user: userControlled,
    stats: {
      approvedTrends,
      submittedTrends,
      totalTrendViews: viewsResult,
      totalSiteTrends,
    },
  });
}; //end getCurrentUser

//UPDATE USER is not set back current user will get updates, this only updates changes + image compression
export const updateUser = async (req, res) => {
  const newUser = { ...req.body }; //using spread operator to copy properties from req.body into newUser object
  delete newUser.password; //if password somehow exists deleting it once again
  //if file attached with request then:
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path); //upload file
    await fs.unlink(req.file.path); //removing the image if file uploaded
    newUser.profile_img = response.secure_url; //updating newUser object with the URL and ID of the uploaded image
    newUser.profile_img_id = response.public_id; //public_id used for future reference or deletion.
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.userID,
    newUser //new data to update the user with
    // { new: true }
  ); //updating user by ID when user updates some value like last name (role not updatable)
  res.status(StatusCodes.OK).json({ msg: 'user updated' });
  //checking to see if there is already an image in cloud for the user
  if (req.file && updatedUser.profile_img_id) {
    await cloudinary.v2.uploader.destroy(updatedUser.profile_img_id); //then delete the old image from Cloudinary using its public_id
  }
}; //end updateUser

//STATS route which will display simple statistics
export const getApplicationStats = async (req, res) => {
  const users = await userModel.countDocuments();
  const trends = await trendModel.countDocuments();
  const approved = await trendModel.countDocuments({ isApproved: true });
  const unapproved = await trendModel.countDocuments({ isApproved: false });
  res.status(StatusCodes.OK).json({ users, trends, approved, unapproved });
}; //end getApplicationStats

//SAVE USER bookmarked TREND:
export const saveUserTrend = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await userModel.findById(req.user.userID);
    console.log('_id in saveUserTrend: ', _id);
    console.log('req.user.userID in saveUserTrend: ', req.user.userID);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }
    if (user.savedTrends.includes(_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Trend already saved' });
    } // checking if _id already exists in savedTrends array
    user.savedTrends.push(_id); // adding _id to savedTrends array
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Trend saved successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Something went wrong' });
  }
};
//GET USER bookmarked TREND
export const getUserSavedTrends = async (req, res) => {
  try {
    const user = await userModel // fetching the user document with savedTrends populated
      .findById(req.user.userID)
      .populate('savedTrends');
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }
    const savedTrends = user.savedTrends; // extracting the saved trends from the user document
    res.status(StatusCodes.OK).json({ savedTrends }); // returning the saved trends
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message }); // handle errors
  }
};
export const removeUserTrend = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await userModel.findById(req.user.userID);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }
    const index = user.savedTrends.indexOf(_id);
    if (index === -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Trend not found in saved Trends' });
    }
    user.savedTrends.splice(index, 1); // Removing the trend from the array
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Trend removed successfully' }); // Ensure to send a response here
  } catch (error) {
    console.error('Error during trend removal:', error); // Log any errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message }); // Handle errors
  }
}; // End removeUserTrend
