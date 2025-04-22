const Job = require('../models/Job_model');
const mongoose = require('mongoose');

const createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      customerId: req.body.customerId
    });
    await job.save();
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCustomerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ customerId: req.params.customerId });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    console.log('Delete job request for ID:', req.params.id);
    
    if (!req.params.id) {
      console.log('No ID provided');
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Verify ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ID format');
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('Job not found');
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    console.log('Job deleted successfully');
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this new function to get all jobs
const getAllJobs = async (req, res) => {
  try {
    console.log('Getting all jobs');
    
    // Find all jobs from the database
    const jobs = await Job.find();
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = { createJob, getCustomerJobs, updateJob, deleteJob, getAllJobs };
