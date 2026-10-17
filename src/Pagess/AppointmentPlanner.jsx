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
  const [appointments, setAppointments] = useState(upcomingAppointments);
  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id),
    );
  };

  const handleBooking = (e) => {
    e.preventDefault();
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
  const [showMorningSlots, setShowMorningSlots] = useState(false);
  const [showEveningSlots, setShowEveningSlots] = useState(false);
  const MorningSlots = () => {
    return (
      <div>
        <button>8:00 AM</button>
        <button>8:30 AM</button>
        <button>9:00 AM</button>
        <button>9:30 AM</button>
        <button>10:00 AM</button>
        <button>10:30 AM</button>
        <button>11:00 AM</button>
        <button>11:30 AM</button>
      </div>
    );
  };
  const EveningSlots = () => {
    return (
      <div>
        <button>4:00 PM</button>
        <button>4:30 PM</button>
        <button>5:00 PM</button>
        <button>5:30 PM</button>
        <button>6:00 PM</button>
        <button>6:30 PM</button>
        <button>7:00 PM</button>
        <button>7:30 PM</button>
      </div>
    );
  };
  return (
    <div className="appointment-planner">
      <div className="header-div">
        <h2>
          <i class="fa-solid fa-calendar"></i>&nbsp;Smart Appointment Planner
        </h2>
        <p>Manage your healthcare visits in one place.</p>
      </div>
      <div className="planner-top">
        <div className="calendar">
          <h2>
            <i class="fa-regular fa-calendar"></i>&nbsp;Calendar
          </h2>
          <Calendar
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>
        <div className="book-appointment">
          <h2>Book New Appointment</h2>
          <p>Choose a specialist,&nbsp;date and time.</p>
          <button
            type="button"
            onClick={() => {
              setShowModal(true);
            }}
            style={{ marginTop: "12px" }}
          >
            + Book Appointment
          </button>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Book New Appointment</h2>
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
                  <button
                    type="button"
                    onClick={() => setShowMorningSlots(true)}
                  >
                    Morning
                  </button>
                  {showMorningSlots && <MorningSlots />}
                  <button
                    type="button"
                    onClick={() => setShowEveningSlots(true)}
                  >
                    Evening
                  </button>
                  {showEveningSlots && <EveningSlots />}

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
                  <button type="button" onClick={() => setShowModal(false)}>
                    Close <i class="fa-solid fa-square-xmark"></i>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="planner-bottom">
        <div className="recent-appointment">
          <h2>
            <i class="fa-regular fa-calendar-check"></i>&nbsp;Recent
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
            <i class="fa-solid fa-arrow-trend-up"></i>&nbsp;Upcoming
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
