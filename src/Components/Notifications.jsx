import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarCheck,
  faPills,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const APPOINTMENTS_KEY = "appointments";
const MEDICATIONS_KEY = "medilinkCurrentMedications";
const MEDICATION_ACTIONS_KEY = "medilinkMedicationReminderActions";
const DISMISSED_APPOINTMENTS_KEY = "medilinkDismissedAppointmentNotifications";

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const readActions = () => {
  try {
    return JSON.parse(localStorage.getItem(MEDICATION_ACTIONS_KEY) || "{}");
  } catch {
    return {};
  }
};

const readDismissedAppointments = () => {
  try {
    return JSON.parse(
      localStorage.getItem(DISMISSED_APPOINTMENTS_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

const parseAppointmentDateTime = (appointment) => {
  if (!appointment?.date || !appointment?.time) return null;

  const date = new Date(`${appointment.date}T00:00:00`);
  const match = appointment.time
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match || Number.isNaN(date.getTime())) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  if (hour > 23 || minute > 59) return null;

  date.setHours(hour, minute, 0, 0);
  return date;
};

const parseMedicationDateTime = (time, today) => {
  const match = String(time)
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  if (hour > 23 || minute > 59) return null;

  const doseDate = new Date(today);
  doseDate.setHours(hour, minute, 0, 0);
  return doseDate;
};

const formatDateTime = (date) =>
  date.toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const Notifications = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [medicationActions, setMedicationActions] = useState(readActions);
  const [dismissedAppointments, setDismissedAppointments] = useState(
  readDismissedAppointments
);

  useEffect(() => {
    const refresh = () => {
      setNow(new Date());
      setMedicationActions(readActions());
      setDismissedAppointments(readDismissedAppointments());
    };

    refresh();

    // Re-check periodically while the app is open.
    const intervalId = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const appointments = readArray(APPOINTMENTS_KEY);
  const medications = readArray(MEDICATIONS_KEY);

  const appointmentNotifications = appointments.flatMap((appointment) => {
    const appointmentDateTime = parseAppointmentDateTime(appointment);
    if (!appointmentDateTime) return [];
    if (dismissedAppointments.includes(String(appointment.id))) return [];
    const minutesUntil =
      (appointmentDateTime.getTime() - now.getTime()) / 60000;

    // Show from one hour before the appointment until its start time.
    if (minutesUntil < 0 || minutesUntil > 60) return [];
    return [
      {
        id: `appointment-${appointment.id}`,
        type: "appointment",
        title: "Upcoming appointment",
        message: `${appointment.doctor || "Doctor"} · ${
          appointment.specialist || "Appointment"
        }`,
        detail: formatDateTime(appointmentDateTime),
        appointmentId: appointment.id,
      },
    ];
  });

  const medicationNotifications = medications.flatMap((medication) => {
    if (!medication.reminderEnabled || !Array.isArray(medication.times)) {
      return [];
    }

    return medication.times.flatMap((time, index) => {
      const doseDateTime = parseMedicationDateTime(time, now);
      if (!doseDateTime) return [];

      const minutesSinceDose =
        (now.getTime() - doseDateTime.getTime()) / 60000;

      // Keep a due reminder visible for 30 minutes.
      if (minutesSinceDose < 0 || minutesSinceDose > 30) return [];

      const dateKey = now.toLocaleDateString("en-CA");
      const actionKey = `${dateKey}-${medication.id}-${index}`;
      if (medicationActions[actionKey]) return [];

      return [
        {
          id: `medication-${actionKey}`,
          type: "medication",
          title: "Medicine dose due",
          message: `${medication.name} · ${medication.dosage}`,
          detail: `Scheduled for ${time}`,
          actionKey,
        },
      ];
    });
  });

  const notifications = [
    ...appointmentNotifications,
    ...medicationNotifications,
  ];

  const saveMedicationAction = (actionKey, action) => {
    const updatedActions = {
      ...medicationActions,
      [actionKey]: action,
    };

    localStorage.setItem(
      MEDICATION_ACTIONS_KEY,
      JSON.stringify(updatedActions)
    );
    setMedicationActions(updatedActions);
  };
  const dismissAppointmentNotification = (appointmentId) => {
    const updated = [
      ...dismissedAppointments,
      String(appointmentId),
    ];

    localStorage.setItem(
      DISMISSED_APPOINTMENTS_KEY,
      JSON.stringify(updated)
    );

    setDismissedAppointments(updated);
  };

  const openAppointment = (appointmentId) => {
    setIsOpen(false);
    navigate(
      `/AppointmentPlanner?appointmentId=${encodeURIComponent(appointmentId)}`
    );
  };

  return (
    <div className="notification-menu">
      <button
        type="button"
        className="notification-bell-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${notifications.length ? `, ${notifications.length} new` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faBell} aria-hidden="true" />
        {notifications.length > 0 && (
          <span className="notification-count">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <section className="notification-panel" aria-label="Notifications">
          <div className="notification-panel-heading">
            <h2>Notifications</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
              className="notification-close-button"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="notification-empty">
              You’re all caught up. No reminders right now.
            </p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li className="notification-item" key={notification.id}>
                  <span className="notification-item-icon">
                    <FontAwesomeIcon
                      icon={
                        notification.type === "appointment"
                          ? faCalendarCheck
                          : faPills
                      }
                      aria-hidden="true"
                    />
                  </span>

                  <div className="notification-item-content">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{notification.detail}</small>

                    {notification.type === "appointment" ? (
                      <button
                        type="button"
                        className="notification-action"
                        onClick={() => openAppointment(notification.appointmentId)}
                      >
                        View appointment
                      </button>
                    ) : (
                      <div className="notification-actions">
                        <button
                          type="button"
                          className="notification-taken-button"
                          onClick={() =>
                            saveMedicationAction(
                              notification.actionKey,
                              "taken"
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          Taken
                        </button>

                        <button
                          type="button"
                          className="notification-dismiss-button"
                          onClick={() =>
                            saveMedicationAction(
                              notification.actionKey,
                              "dismissed"
                            )
                          }
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                  {notification.type === "appointment" && (
                    <button
                      type="button"
                      className="notification-item-dismiss"
                      onClick={() =>
                        dismissAppointmentNotification(notification.appointmentId)
                      }
                      aria-label="Dismiss appointment notification"
                      title="Dismiss notification"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default Notifications;