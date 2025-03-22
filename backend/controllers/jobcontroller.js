const Job = require("../models/jobmodel");

// Get all jobs
const getAllJobs = async (req, res, next) => {
    let jobs;
    try {
        jobs = await Job.find();
    } catch (err) {
        console.log(err);
    }

    if (!jobs) {
        return res.status(404).json({ message: "No jobs found" });
    }
    return res.status(200).json({ jobs });
};

// Add a new job (posted by customer)
const addJob = async (req, res, next) => {
    const { adTitle, serviceType, reqDate, noOfDays, area, adDescription, contactNumber, email, date, Name, customerId } = req.body;

    let job;
    try {
        job = new Job({ adTitle, serviceType, reqDate, noOfDays, area, adDescription, contactNumber, email, date, Name, customerId, status: "open" });
        await job.save();
    } catch (err) {
        console.log(err);
    }

    if (!job) {
        return res.status(404).json({ message: "Unable to post job" });
    }

    // Emit real-time job posting notification (Socket.io)
    // io.emit('newJob', job); // If Socket.io is set up

    return res.status(200).json({ job });
};

// Get a specific job by ID
const getJobById = async (req, res, next) => {
    const id = req.params.id;

    let job;
    try {
        job = await Job.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job });
};

// Update job status (e.g., from open to assigned)
const updateJobStatus = async (req, res, next) => {
    const id = req.params.id;
    const { status, assignedProviderId } = req.body;

    let job;
    try {
        job = await Job.findByIdAndUpdate(id, { status, assignedProviderId }, { new: true });
        await job.save();
    } catch (err) {
        console.log(err);
    }

    if (!job) {
        return res.status(404).json({ message: "Unable to update job status" });
    }

    // Emit real-time status update notification (Socket.io)
    // io.emit('jobStatusUpdate', job); // If Socket.io is set up

    return res.status(200).json({ job });
};

// Delete a job
const deleteJob = async (req, res, next) => {
    const id = req.params.id;

    let job;
    try {
        job = await Job.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!job) {
        return res.status(404).json({ message: "Unable to delete job" });
    }

    return res.status(200).json({ job });
};

// Accept or decline a job by the provider
const acceptDeclineJob = async (req, res, next) => {
    const id = req.params.id;
    const { providerId, action } = req.body; // action = 'accept' or 'decline'

    let job;
    try {
        job = await Job.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    if (action === "accept" && job.status === "open") {
        job.status = "assigned";
        job.assignedProviderId = providerId;
        await job.save();
    } else if (action === "decline" && job.status === "open") {
        return res.status(400).json({ message: "Job is already taken or completed" });
    } else {
        return res.status(400).json({ message: "Invalid action or job status" });
    }

    // Emit real-time job acceptance/decline notification (Socket.io)
    // io.emit('jobAccepted', job); // If Socket.io is set up

    return res.status(200).json({ job });
};

exports.getAllJobs = getAllJobs;
exports.addJob = addJob;
exports.getJobById = getJobById;
exports.updateJobStatus = updateJobStatus;
exports.deleteJob = deleteJob;
exports.acceptDeclineJob = acceptDeclineJob;
