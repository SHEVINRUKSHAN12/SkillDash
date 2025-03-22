import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WorkerAvailability.css"; // Ensure styles.css is in the same folder

const WorkerAvailability = () => {
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({
        workerName: "",
        date: "",
        time: "",
        location: ""
    });

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/availability");
            setSlots(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/availability", formData);
            fetchSlots();
            setFormData({ workerName: "", date: "", time: "", location: "" });
        } catch (error) {
            console.error("Error adding availability:", error);
        }
    };

    return (
        <div className="container">
            <h2>Worker Availability & Scheduling</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="workerName" placeholder="Worker Name" value={formData.workerName} onChange={handleChange} required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <button type="submit">Add Availability</button>
            </form>
            <ul>
                {slots.map((slot) => (
                    <li key={slot._id}>
                        {slot.workerName} - {slot.date} - {slot.time} ({slot.location})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkerAvailability;
