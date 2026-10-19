import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Calendar from "../Components/Calendar";
const AppointmentPlanner = () => {
  const [showModal, setShowModal] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  /**Upcoming Appointments */
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Riya Sharma",
      specialist: "Cardiologist",
      date: "2026-10-18",
      time: "10:30 AM",
      type: "In-person visit",
    },
    {
      id: 2,
      doctor: "Dr. Arjun Mehta",
      specialist: "Dermatologist",
      date: "2026-10-19",
      time: "12:00 PM",
      type: "Online consultation",
    },
    {
      id: 3,
      doctor: "Dr. Neha Kapoor",
      specialist: "General Physician",
      date: "2026-10-20",
      time: "09:00 AM",
      type: "In-person visit",
    },
    {
      id: 4,
      doctor: "Dr. Kabir Singh",
      specialist: "Orthopedic",
      date: "2026-10-22",
      time: "04:30 PM",
      type: "In-person visit",
    },
    {
      id: 5,
      doctor: "Dr. Ananya Verma",
      specialist: "Dentist",
      date: "2026-10-24",
      time: "11:15 AM",
      type: "Online consultation",
    },
    {
      id: 6,
      doctor: "Dr. Rahul Malhotra",
      specialist: "Neurologist",
      date: "2026-10-26",
      time: "02:00 PM",
      type: "In-person visit",
    },
  ];
  /**Recent Appointments */
  const recentAppointments = [
    {
      id: 1,
      doctor: "Dr. Priya Malhotra",
      specialist: "General Physician",
      date: "2026-10-12",
      time: "11:00 AM",
      type: "In-person visit",
      status: "Completed",
    },
    {
      id: 2,
      doctor: "Dr. Arjun Mehta",
      specialist: "Dermatologist",
      date: "2026-10-10",
      time: "02:30 PM",
      type: "Online consultation",
      status: "Completed",
    },
    {
      id: 3,
      doctor: "Dr. Simran Kaur",
      specialist: "Dentist",
      date: "2026-10-08",
      time: "10:00 AM",
      type: "In-person visit",
      status: "Completed",
    },
    {
      id: 4,
      doctor: "Dr. Rahul Sharma",
      specialist: "Orthopedic",
      date: "2026-10-05",
      time: "04:00 PM",
      type: "In-person visit",
      status: "Cancelled",
    },
    {
      id: 5,
      doctor: "Dr. Neha Kapoor",
      specialist: "Cardiologist",
      date: "2026-10-02",
      time: "12:15 PM",
      type: "Online consultation",
      status: "Completed",
    },
    {
      id: 6,
      doctor: "Dr. Kabir Singh",
      specialist: "Neurologist",
      date: "2026-09-28",
      time: "09:30 AM",
      type: "In-person visit",
      status: "Missed",
    },
  ];
  /**Toast notification for next appointment */
  useEffect(() => {
    const nextAppointment = upcomingAppointments
      .filter((appointment) => new Date(appointment.date) >= new Date())
      .sort((a, b) => new Date(a.date) - b.date)[0];
    if (nextAppointment) {
      toast.info(
        <>
          Your Next Appointment
          <br />
          {nextAppointment.doctor} · {nextAppointment.specialist}
          <br />
          {nextAppointment.date} · {nextAppointment.time}
        </>,
      );
    }
  }, []);
  const [appointments, setAppointments] = useState(() => {
    const savedUpcomingAppointments = localStorage.getItem("appointments");
    return savedUpcomingAppointments
      ? JSON.parse(savedUpcomingAppointments)
      : upcomingAppointments;
  });
  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id),
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!time) {
      toast.error("Please select a time slot!");
    }
    const newAppointment = {
      id: Date.now(),
      doctor: "Dr. Riya Sharma",
      specialist: specialist,
      date: date,
      time: time,
      type: type,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    toast.success("Appointment Booked Successfully!");
    setShowModal(false);
  };
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);
  const [showMorningSlots, setShowMorningSlots] = useState(false);
  const [showEveningSlots, setShowEveningSlots] = useState(false);
  const MorningSlots = () => {
    return (
      <div>
        <button
          type="button"
          className={time === "8:00 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("8:00 AM")}
        >
          8:00 AM
        </button>
        <button
          type="button"
          className={time === "8:30 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("8:30 AM")}
        >
          8:30 AM
        </button>
        <button
          type="button"
          className={time === "9:00 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("9:00 AM")}
        >
          9:00 AM
        </button>
        <button
          type="button"
          className={time === "9:30 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("9:30 AM")}
        >
          9:30 AM
        </button>
        <button
          type="button"
          className={time === "10:00 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("10:00 AM")}
        >
          10:00 AM
        </button>
        <button
          type="button"
          className={time === "10:30 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("10:30 AM")}
        >
          10:30 AM
        </button>
        <button
          type="button"
          className={time === "11:00 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("11:00 AM")}
        >
          11:00 AM
        </button>
        <button
          type="button"
          className={time === "11:30 AM" ? "selected-time-slot" : ""}
          onClick={() => setTime("11:30 AM")}
        >
          11:30 AM
        </button>
      </div>
    );
  };
  const EveningSlots = () => {
    return (
      <div>
        <button
          type="button"
          className={time === "4:00 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("4:00 PM")}
        >
          4:00 PM
        </button>
        <button
          type="button"
          className={time === "4:30 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("4:30 PM")}
        >
          4:30 PM
        </button>
        <button
          type="button"
          className={time === "5:00 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("5:00 PM")}
        >
          5:00 PM
        </button>
        <button
          type="button"
          className={time === "5:30 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("5:30 PM")}
        >
          5:30 PM
        </button>
        <button
          type="button"
          className={time === "6:00 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("6:00 PM")}
        >
          6:00 PM
        </button>
        <button
          type="button"
          className={time === "6:30 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("6:30 PM")}
        >
          6:30 PM
        </button>
        <button
          type="button"
          className={time === "7:00 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("7:00 PM")}
        >
          7:00 PM
        </button>
        <button
          type="button"
          className={time === "7:30 PM" ? "selected-time-slot" : ""}
          onClick={() => setTime("7:30 PM")}
        >
          7:30 PM
        </button>
      </div>
    );
  };
  return (
    <div className="appointment-planner">
      <div className="header-div">
        <h2>
          <i class="fa-solid fa-calendar"></i>&nbsp;&nbsp;Smart Appointment
          Planner
        </h2>
        <p>Manage your healthcare visits in one place.</p>
      </div>
      <div className="planner-top">
        <div className="calendar">
          <h2>
            <i class="fa-regular fa-calendar"></i>&nbsp;&nbsp;Calendar
          </h2>
          <Calendar
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>
        <div className="book-appointment">
          <h2>Book New Appointment</h2>
          <p>Choose a specialist,&nbsp;&nbsp;date and time.</p>
          <button
            type="button"
            onClick={() => {
              setShowModal(true);
            }}
            style={{ marginTop: "12px" }}
          >
            + Book Appointment
          </button>
          <div className="appointment-benefits">
            <div className="benefit-item">
              <div className="benefit-icon scheduling-icon">
                <i className="fa-regular fa-calendar-check"></i>
              </div>
              <div className="benefit-content">
                <h3>Flexible Scheduling</h3>
                <p>Choose a date and time that works for you.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon specialist-icon">
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <div className="benefit-content">
                <h3>Specialist Care</h3>
                <p>Find the right specialist for your healthcare needs.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon organized-icon">
                <i className="fa-solid fa-clipboard-check"></i>
              </div>
              <div className="benefit-content">
                <h3>Stay Organized</h3>
                <p>Keep upcoming visits together in one place.</p>
              </div>
            </div>
          </div>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="close">
                  <h2>Book New Appointment</h2>
                  <button type="button" onClick={() => setShowModal(false)}>
                    <i class="fa-solid fa-x"></i>
                  </button>
                </div>
                <p>Schedule your next doctor visit.</p>
                <form onSubmit={handleBooking}>
                  <label>Patient Name</label>
                  <input type="text" placeholder="Enter your name" />
                  <label>Specialist</label>
                  <select
                    value={specialist}
                    onChange={(e) => setSpecialist(e.target.value)}
                  >
                    <option>Select specialist</option>
                    <option>General Physician</option>
                    <option>Cardiologist</option>
                    <option>Dermatologist</option>
                    <option>Neurologist</option>
                    <option>Orthopedic</option>
                    <option>Gynecologist</option>
                    <option>Pediatrician</option>
                    <option>Ophthalmologist</option>
                    <option>ENT Specialist</option>
                    <option>Dentist</option>
                    <option>Psychiatrist</option>
                    <option>Gastroenterologist</option>
                    <option>Endocrinologist</option>
                    <option>Pulmonologist</option>
                    <option>Nephrologist</option>
                    <option>Urologist</option>
                    <option>Oncologist</option>
                    <option>Physiotherapist</option>
                    <option>Dietitian / Nutritionist</option>
                  </select>
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    placeholder="Select date..."
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <label>Choose a time slot</label>
                  <div className="time-accordion-container">
                    <div className="time-accordion">
                      <button
                        type="button"
                        onClick={() => setShowMorningSlots(!showMorningSlots)}
                      >
                        <i class="fa-solid fa-sun"></i> Morning{" "}
                        {showMorningSlots ? (
                          <i class="fa-solid fa-angle-down"></i>
                        ) : (
                          <i class="fa-solid fa-angle-up"></i>
                        )}
                      </button>
                      {showMorningSlots && <MorningSlots />}
                    </div>
                    <div className="time-accordion">
                      <button
                        type="button"
                        onClick={() => setShowEveningSlots(!showEveningSlots)}
                      >
                        <i class="fa-solid fa-moon"></i> Evening{" "}
                        {showEveningSlots ? (
                          <i class="fa-solid fa-angle-down"></i>
                        ) : (
                          <i class="fa-solid fa-angle-up"></i>
                        )}
                      </button>
                      {showEveningSlots && <EveningSlots />}
                    </div>
                  </div>
                  <label>Appointment Type</label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="In-person visit"
                      checked={type === "In-person visit"}
                      onChange={(e) => setType(e.target.value)}
                      check
                    />
                    In-person visit
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="Online consultation"
                      checked={type === "Online consultation"}
                      onChange={(e) => setType(e.target.value)}
                    />
                    Online consultation
                  </label>
                  <button type="submit">Book Appointment</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="planner-bottom">
        <div className="recent-appointment">
          <h2>
            <i class="fa-regular fa-calendar-check"></i>&nbsp;&nbsp;Recent
            Appointments
          </h2>
          <div className="appointments-list">
            {recentAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment.id}>
                <h3>{appointment.doctor}</h3>
                <p>
                  {appointment.specialist} · {appointment.date},{" "}
                  {appointment.time}
                </p>
                <p>{appointment.type}</p>
                <span
                  className={
                    appointment.status === "Completed"
                      ? "status-completed"
                      : "status-cancelled"
                  }
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="upcoming-appointment">
          <h2>
            <i class="fa-solid fa-arrow-trend-up"></i>&nbsp;&nbsp;Upcoming
            Appointments
          </h2>
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div className="appointment-card" key={appointment.id}>
                <h3>{appointment.doctor}</h3>
                <p>
                  {appointment.specialist} · {appointment.date},{" "}
                  {appointment.time}
                </p>
                <p>{appointment.type}</p>
                <div className="appointment-actions">
                  <span className="upcoming-badge">Upcoming</span>
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={() => {
                      handleCancel(appointment.id);
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPlanner;
