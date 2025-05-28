const { default: mongoose } = require("mongoose");
const ProjectContribution = require("../models/contributionModel");


module.exports.createContribution = async (req, res) => {
  const { userId, projects } = req.body;

  const operations = projects.map(async (project) => {
    const { date, contribution, subProjectCode, projectCode } = project;

    if (!date || !contribution || !subProjectCode || !projectCode) {
      return { success: false, message: 'Some information is missing' };
    }

    const [month, day, year] = date.split('/');
    const monthKey = `${month}-${year}`;

    try {
      let userProject = await ProjectContribution.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        subProjectCode: subProjectCode,
        month: monthKey
      });

      if (userProject) {
        const existingContribution = userProject.dateAndContribution.find(entry => entry.date === date);
        if (existingContribution) {
          existingContribution.contribution = contribution;
        } else {
          userProject.dateAndContribution.push({ date, contribution });
        }
      } else {
        userProject = new ProjectContribution({
          userId: new mongoose.Types.ObjectId(userId),
          subProjectCode: subProjectCode,
          projectCode: projectCode,
          dateAndContribution: [{ date, contribution }],
          month: monthKey
        });
      }

      await userProject.save();
      return { success: true, message: 'Contribution added successfully' };
    } catch (error) {
      console.error('Error adding contribution:', error);
      return { success: false, error: 'An error occurred while adding contribution' };
    }
  });

  try {
    const results = await Promise.all(operations);
    if (results.some(result => !result.success)) {
      const errors = results.filter(result => !result.success);
      res.status(400).json({ message: 'Some contributions could not be added', errors });
    } else {
      res.status(200).json({ message: 'All contributions added successfully' });
    }
  } catch (error) {
    console.error('Error processing contributions:', error);
    res.status(500).json({ error: 'An error occurred while processing contributions' });
  }
};

module.exports.getProjectContributionSingleDay = async (req, res) => {

  const { userId, date } = req.body;

  // Validate input
  if (!userId || !date) {
    return res.status(400).json({ error: 'Both userId and date are required.' });
  }

  // Extract month and year from the date for easier searching
  const [month, day, year] = date.split('/');
  if (!month || !day || !year) {
    return res.status(400).json({ error: 'Date must be in the format mm-dd-yyyy.' });
  }
  const monthKey = `${month}-${year}`;

  try {
    // Find documents for the user in the specified month
    const userProjects = await ProjectContribution.find({
      userId: new mongoose.Types.ObjectId(userId),
      month: monthKey
    });

    // Find the specific contribution for the given date
    const results = [];
    userProjects.forEach(project => {
      const contribution = project.dateAndContribution.find(entry => entry.date === date);
      if (contribution) {
        results.push({
          projectCode: project.projectCode,
          subProjectCode: project.subProjectCode,
          date: contribution.date,
          contribution: contribution.contribution,
          mergedProjectCode: `${project.projectCode}-${project.subProjectCode}`
        });
      }
    });

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: 'No contributions found for the given date.' });
    }
  } catch (error) {
    console.error('Error retrieving contribution:', error);
    res.status(500).json({ error: 'An error occurred while retrieving contribution' });
  }
}

module.exports.deleteProjectContributionSingleDay = async (req, res) => {
  const { userId, subProjectCode, date } = req.body;
  console.log("delete API", req.body);
  // Validate input
  if (!userId || !subProjectCode || !date) {
    return res.status(400).json({ error: 'All fields (userId, projectId, date) are required.' });
  }

  // Extract month and year from the date for easier searching
  const [month, day, year] = date.split('/');
  if (!month || !day || !year) {
    return res.status(400).json({ error: 'Date must be in the format mm-dd-yyyy.' });
  }
  const monthKey = `${month}-${year}`;

  try {
    // Find the document for the user, project, and month
    let userProject = await ProjectContribution.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      subProjectCode: subProjectCode,
      month: monthKey
    });

    if (!userProject) {
      return res.status(404).json({ error: 'No contributions found for the given criteria.' });
    }

    // Find the index of the date to be deleted
    const dateIndex = userProject.dateAndContribution.findIndex(entry => entry.date === date);

    if (dateIndex === -1) {
      return res.status(404).json({ error: 'Date not found in contributions.' });
    }

    // Remove the date from the dateAndContribution array
    userProject.dateAndContribution.splice(dateIndex, 1);

    // Check if dateAndContribution is empty
    if (userProject.dateAndContribution.length === 0) {
      // Remove the entire document if it's empty
      await ProjectContribution.deleteOne({ subProjectCode });
      res.status(200).json({ message: 'Delete Successfully' });
    } else {
      // Save the document if there are other dates
      await userProject.save();
      res.status(200).json({ message: 'Delete Successfully' });
    }
  } catch (error) {
    console.error('Error deleting contribution:', error);
    res.status(500).json({ error: 'An error occurred while deleting the contribution.' });
  }
}

module.exports.getProjectContribution = async (req, res) => {

  try {
    const { userId, date } = req.body;
    console.log("planner", req.body);
    // Convert date to mm-yyyy format
    const dateObj = new Date(date);
    const month = `${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

    // Query the database
    const contributions = await ProjectContribution.find({
      userId: new mongoose.Types.ObjectId(userId),
      month: month
    });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 
}