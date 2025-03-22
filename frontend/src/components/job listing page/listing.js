import React, { useState } from "react";
import "./listing.css";

const Listing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const jobs = [
    { id: 1, title: "Pipe Repair", category: "Plumbing", location: "Colombo", description: "Fixing leaks and repairing damaged pipes in homes or businesses." },
    { id: 2, title: "Wiring and Installation", category: "Electrical Work", location: "Kandy", description: "Installing wiring for homes, offices, or appliances." },
    { id: 3, title: "Furniture Making", category: "Carpentry", location: "Galle", description: "Creating or fixing furniture like tables, chairs, and cabinets." },
    { id: 4, title: "Bricklaying", category: "Masonry", location: "Kurunegala", description: "Building or repairing walls, foundations, and other brick structures." },
    { id: 5, title: "Interior Painting", category: "Painting", location: "Jaffna", description: "Painting homes, offices, or other buildings." },
    { id: 6, title: "Roof Repair", category: "Roofing", location: "Negombo", description: "Fixing leaks or damaged tiles and ensuring a secure roof." },
    { id: 7, title: "Metalwork", category: "Welding", location: "Ratnapura", description: "Repairing or fabricating metal items such as gates, fences, and furniture." },
    { id: 8, title: "Lawn Maintenance", category: "Gardening and Landscaping", location: "Matara", description: "Mowing, trimming, and caring for lawns." },
    { id: 9, title: "AC Installation", category: "HVAC", location: "Anuradhapura", description: "Installing air conditioners for homes, offices, or commercial spaces." },
    { id: 10, title: "Car Mechanic", category: "Automotive Repairs", location: "Badulla", description: "Fixing vehicle issues such as engine repair, tire replacement, or brake checks." },
    { id: 11, title: "Glass Cutting", category: "Glasswork", location: "Trincomalee", description: "Custom-cutting glass for specific needs like mirrors or shelves." },
    { id: 12, title: "Termite Treatment", category: "Pest Control", location: "Batticaloa", description: "Applying pest control measures to eliminate termites or prevent infestations." }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="listing-container">
      <h2>Job Listings</h2>
      <input
        type="text"
        placeholder="Search by title, category, or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="listing-search"
      />
      <div className="listing-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="listing-card">
              <h3>{job.title}</h3>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p>{job.description}</p>
              <button className="apply-btn">Apply Now</button>
            </div>
          ))
        ) : (
          <p className="no-jobs">No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default Listing;
