const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobcontroller");


// Get all jobs
router.get("/", jobController.getAllJobs);

// Post a new job (customer side)
router.post("/", authMiddleware, jobController.addJob);

// Get a specific job by ID
router.get("/:id", jobController.getJobById);

// Update job status (e.g., assigned or completed)
router.put("/:id/status", authMiddleware, jobController.updateJobStatus);

// Delete a job
router.delete("/:id", authMiddleware, jobController.deleteJob);

// Accept or decline a job (service provider)
router.patch("/:id/acceptDecline", authMiddleware, jobController.acceptDeclineJob);

module.exports = router;
