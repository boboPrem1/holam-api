const Organisation = require("../organisations/organisationModel.js");
const Post = require("../posts/postModel.js");
const Job = require("../jobs/jobModel.js");
const Event = require("../events/eventModel.js");
const Opportunity = require("../opportunities/opportunityModel.js");
const bcrypt = require("bcryptjs");

function calculateSecondsDiff(date1, date2) {
  const diffInMilliseconds = Math.abs(date2 - date1);
  const seconds = diffInMilliseconds / 1000;
  const secondsWithTwoDecimals = parseFloat(seconds.toFixed(2));
  return secondsWithTwoDecimals;
}

function filterByAlphabeticalOrder(array) {
  array.sort((a, b) => {
    if (a.name && b.name) {
      return a.name > b.name ? 1 : -1;
    } else if (a.title && b.title) {
      return a.title > b.title ? 1 : -1;
    } else if (a.title && b.name) {
      return a.title > b.name ? 1 : -1;
    } else {
      return a.name > b.title ? 1 : -1;
    }
  });
}

// @Get all users
// @route GET /api/v1/users
// @access Public
exports.getAllFound = async (req, res) => {
  try {
    let q = req.query.q;
    // console.log(q);
    // const results = await Organisation.find({ $text: { $search: q } });
    // build a regex
    const regex = new RegExp(q, "i");
    const startDate = new Date();
    const results = await Promise.all([
      (async () => {
        const allFounds = await Organisation.find({
          $or: [
            { name: regex },
            { description: regex },
            // { owner: regex },
            { description: regex },
            { email: regex },
            { telephone: regex },
            { site_web: regex },
            { linkedin_url: regex },
            { facebook_url: regex },
            { twitter_url: regex },
            { adresse: regex },
          ],
        });
        if (allFounds.length) {
          const allFoundsCopy = [...allFounds];
          const finalFounds = allFoundsCopy.map((el) => {
            const newEl = { searchType: "organisation", ...el._doc };
            return newEl;
          });
          return finalFounds;
        } else {
          return allFounds;
        }
      })(),
      (async () => {
        const allFounds = await Post.find({
          $or: [{ title: regex }, { slug: regex }, { content: regex }],
        });
        if (allFounds.length) {
          const allFoundsCopy = [...allFounds];
          const finalFounds = allFoundsCopy.map((el) => {
            const newEl = { searchType: "post", ...el._doc };
            return newEl;
          });
          return finalFounds;
        } else {
          return allFounds;
        }
      })(),
      (async () => {
        const allFounds = await Job.find({
          $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { skills: regex },
            { slug: regex },
          ],
        });
        if (allFounds.length) {
          const allFoundsCopy = [...allFounds];
          const finalFounds = allFoundsCopy.map((el) => {
            const newEl = { searchType: "job", ...el._doc };
            return newEl;
          });
          return finalFounds;
        } else {
          return allFounds;
        }
      })(),
      (async () => {
        const allFounds = await Event.find({
          $or: [
            { title: regex },
            { format: regex },
            // { target_country: regex },
            { activity_area: regex },
            { description: regex },
            { slug: regex },
            { location: regex },
            { frequence: regex },
          ],
        });
        if (allFounds.length) {
          const allFoundsCopy = [...allFounds];
          const finalFounds = allFoundsCopy.map((el) => {
            const newEl = { searchType: "event", ...el._doc };
            return newEl;
          });
          return finalFounds;
        } else {
          return allFounds;
        }
      })(),
      (async () => {
        const allFounds = await Opportunity.find({
          $or: [
            { title: regex },
            { target_people: regex },
            // { target_country: regex },
            { activity_area: regex },
            { description: regex },
            { eligibility: regex },
            { processus: regex },
            { slug: regex },
            { beneficies: regex },
            { registration_link: regex },
            { frequency: regex },
          ],
        });
        if (allFounds.length) {
          const allFoundsCopy = [...allFounds];
          const finalFounds = allFoundsCopy.map((el) => {
            const newEl = { searchType: "ooportunity", ...el._doc };
            return newEl;
          });
          return finalFounds;
        } else {
          return allFounds;
        }
      })(),
    ]);

    const combinedResults = [].concat(...results);
    const endDate = new Date();
    const duration = calculateSecondsDiff(startDate, endDate);
    const resultLength = combinedResults.length;
    const addon = {
      duration,
      resultLength,
    };
    filterByAlphabeticalOrder(combinedResults);
    combinedResults.unshift(addon);
    res.status(200).json(combinedResults);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
