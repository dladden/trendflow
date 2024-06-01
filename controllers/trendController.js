import trendModel from '../models/trendModel.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeHTML } from '../utils/sanitization.js';
import { executePythonScript } from '../utils/script_controller.js';
import { generatePostContent } from '../api/trendPostGenerator.js';
import {
  constructQueryObject,
  constructSortKey,
  paginateAndSortTrends,
} from '../utils/trendUtils.js';
/**
 * This is where functionality of trends implemented
 * @param {*} req
 * @param {*} res
 * @returns
 */
//test data for local storage set as 'let' for modification
// let trends = [
//   { id: nanoid(), trend: 'chatgpt', category: 'language model' },
//   { id: nanoid(), trend: 'react', category: 'javascript framework' },
// ];
export const submitTrend = async (req, res) => {
  let { trend } = req.body; //using scoped variable
  trend = sanitizeHTML(trend); //sanitize the trend input to prevent XSS
  const existingTrend = await trendModel.findOne({ trend });
  if (existingTrend) {
    return res.status(400).json({ msg: 'Trend already exists' });
  }
  req.body.createdBy = req.user.userID; //adding createdBy property storing user id
  const trendObject = await trendModel.create({
    ...req.body,
    isApproved: false,
  }); //create a new document spreading current properties
  res.status(StatusCodes.CREATED).json({ trendObject });
}; //end SUBMIT

//GET ALL TRENDS (only for ADMIN)
export const getAllTrends = async (req, res) => {
  // console.log(req);
  let { search, trendTech, trendCategory, sort, page, limit } = req.query;
  const queryObject = constructQueryObject(search, trendTech, trendCategory);
  const sortKey = constructSortKey(sort);
  console.log('user object: ', req.user);

  page = Number(page) || 1;
  limit = Number(limit) || 36;

  try {
    const { totalTrends, pagesNumber, trends } = await paginateAndSortTrends(
      queryObject,
      sortKey,
      page,
      limit
    );
    res
      .status(StatusCodes.OK)
      .json({ totalTrends, pagesNumber, currentPage: page, trends });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  } //if there is anything but response 200 resource is not found response fot the client
};

//GET A TREND (setting up a retrieve/read all trends in a route /api/v1/trends belonging to user)
export const getUserTrends = async (req, res) => {
  // console.log(req.user);
  const trends = await trendModel.find({ createdBy: req.user.userID }); //getting the trends belonging to user that provided cookie and token
  res.status(StatusCodes.OK).json({ trends }); //if there is anything but response 200 resource is not found response fot the client
};

//CREATE TREND
export const createTrend = async (req, res) => {
  // if (req.user.role !== 'admin') {
  //   return res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ msg: 'Unauthorized access' });
  // }
  req.body.createdBy = req.user.userID; //createdBy populated with userDI
  const trendObject = await trendModel.create(req.body); //async adding a new trend object to the database (create looks for an object)
  res.status(StatusCodes.CREATED).json({ trendObject }); //response fot the client with created trend is 201
};

//GET SINGLE TREND
export const getSingleTrend = async (req, res) => {
  const { slug } = req.params; //retrieving the id
  const trendObject = await trendModel
    .findOne({ slug: slug })
    .populate('createdBy', 'username profile_img -_id'); //retrieve the trend if it equals the id in the data
  if (!trendObject) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  trendObject.generatedBlogPost = sanitizeHTML(trendObject.generatedBlogPost); //sanitizing html in case
  res.status(StatusCodes.OK).json({ trendObject }); //returning the found trend
};

//UPDATE TREND
export const editTrend = async (req, res) => {
  const { slug } = req.params;
  // use Mongoose's findOneAndUpdate method to find a trend by its slug and update it with the new data provided in req.body.
  // the option { new: true } ensures that the method returns the modified document rather than the original.
  const updateTrend = await trendModel.findOneAndUpdate(
    { slug: slug }, // the filter to find the document by slug.
    req.body,
    {
      new: true, // option to return the updated document instead of the original document before the update.
    }
  );
  if (!updateTrend) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  //response
  res
    .status(StatusCodes.OK)
    .json({ msg: 'trend modified', trend: updateTrend }); //returning the found trend
};

//DELETE TREND
// export const deleteTrend = async (req, res) => {
//   const { id } = req.params; //1: find trend
//   const removeTrend = await trendModel.findByIdAndDelete(id); //using findByIdAndDelete to delete data out of TrendModel based on id
//   console.log(removeTrend);
//   const newTrendObject = trends.filter((trend) => trend.id !== id); //2: filter out all trends besides the one that is provided
//   trends = newTrendObject; //3: Storing the new trends in the trends array
//   res.status(StatusCodes.OK).json({ msg: 'trend deleted', trend: removeTrend }); //returning the found trend
// };
//DELETE TREND
export const deleteTrend = async (req, res) => {
  const { slug } = req.params; //1: find trend
  const removeTrend = await trendModel.findOneAndDelete({ slug: slug });
  if (!removeTrend) {
    return res.status(404).json({ msg: 'Trend not found' });
  }
  res.status(StatusCodes.OK).json({ msg: 'Trend deleted', trend: removeTrend });
};

//APPROVE TREND
export const approveTrend = async (req, res) => {
  const { slug } = req.params; // Use slug from the request parameters
  try {
    const trend = await trendModel.findOne({ slug: slug }); // Find the trend using the slug
    if (!trend) {
      return res.status(404).json({ msg: 'Trend not found' });
    }
    //CALLING THE PYTHON SCRIPT

    const scriptOutput = await executePythonScript(trend.trend);
    console.log('Script output: ', scriptOutput);

    const data = JSON.parse(scriptOutput); //parsing the JSON output from scripts
    //CALLING THE OPENAI
    const { trendPost, trendDesc, trendUse } = await generatePostContent(
      trend.trend,
      trend.trendCategory,
      trend.trendTech
    );
    // Log intermediate outputs for verification
    console.log('Generated Blog Post:', trendPost);
    console.log('Generated Description:', trendDesc);
    console.log('Generated Use Cases:', trendUse);
    // const safeTrendPost = sanitizeHTML(trendPost); //content sanitization from external sources before saving
    //UPDATING MONGO
    const updatedTrend = await trendModel.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          interestOverTime: data.trends_data,
          trendStatus: data.status,
          flashChart: data.flashChart,
          generatedBlogPost: trendPost,
          trendDesc: trendDesc,
          trendUse: trendUse,
          isApproved: true,
          forecast: data.forecast,
          t_score: data.t_score,
          f_score: data.f_score,
        },
      },
      { new: true } //returns the updated document instead of the original
    ); // updating the trend with the 'data' fetched from the script and approve it

    // await trend.save(); // save the updated trend document

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Trend approved', trend: updatedTrend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}; //end APPROVE TREND

//GET APPROVED TRENDS
export const getApprovedTrends = async (req, res) => {
  // console.log(req.query);
  let { search, trendTech, trendCategory, sort } = req.query; //destructuring the values coming from query which sent from the users search and dropdowns
  search = sanitizeHTML(search); // validating and sanitizing the search parameter
  const queryObject = {
    isApproved: true,
  }; //creating query parameters as an object
  if (search) {
    queryObject.$or = [
      { trend: { $regex: search, $options: 'i' } },
      { trendTech: { $regex: search, $options: 'i' } },
      { trendCategory: { $regex: search, $options: 'i' } },
    ];
  } // Matching against 'trend', 'trendTech', and 'trendCategory' fields using a 'i' case-insensitive '$regex' regex
  if (trendTech && trendTech !== 'all') {
    queryObject.trendTech = trendTech;
  } //dropdown query for trendTech
  if (trendCategory && trendCategory !== 'all') {
    queryObject.trendCategory = trendCategory;
  } //dropdown query for trendCategory
  const sortingOptions = {
    newest: { updatedAt: -1 },
    oldest: { updatedAt: 1 },
  };
  // const sortKey = sortingOptions[sort] || sortingOptions.recentlyUpdated;
  const sortKey = sortingOptions[sort] || null;

  const page = Number(req.query.page) || 1; //value page will be provided in the req
  const limit = Number(req.query.limit) || 36; //limit will be provided, defaulting to 10 trends initially
  const skip = (page - 1) * limit; //skipping 0 trends, displaying all 10 then skipping them to next 10

  console.log('Constructed Query Object:', queryObject);
  try {
    // Query the database for trends where isApproved is true (return without: generatedBlogPost, trendUse)
    const trends = await trendModel
      .find(queryObject)
      .select('-generatedBlogPost -trendUse')
      .populate('createdBy', 'username profile_img -_id')
      .sort(sortKey)
      .skip(skip)
      .limit(limit);
    const totalTrends = await trendModel.countDocuments(queryObject); //getting total trends based on query
    const pagesNumber = Math.ceil(totalTrends / limit); //calculating the pages
    res
      .status(StatusCodes.OK)
      .json({ totalTrends, pagesNumber, currentPage: page, trends }); // Directly respond with the list of approved trends (could be an empty array)
  } catch (error) {
    // Handle any potential errors during the database query
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
