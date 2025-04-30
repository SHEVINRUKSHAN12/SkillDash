const express = require('express');
const router = express.Router();
const { createJob, getCustomerJobs, updateJob, deleteJob, getAllJobs } = require('../controllers/Job_controller');

// Add the route to get all jobs
router.get('/', getAllJobs);

// Job routes
router.post('/create', createJob);
router.get('/customer/:customerId', getCustomerJobs);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
