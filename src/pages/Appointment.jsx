import React, { useState, useEffect, useContext } from 'react';
import RelatedDoctor from '../components/RelatedDoctor'; // Adjust the path if needed
import { useParams } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets_frontend/assets';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (doctors && docId) {
      const doctor = doctors.find((doc) => doc._id === docId);
      setDocInfo(doctor);
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      generateSlots();
    }
  }, [docInfo]);

  const generateSlots = () => {
    let today = new Date();
    let allDaysSlots = [];

    for (let i = 0; i < 7; i++) {
      let slots = [];
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);
      endTime.setHours(17, 0, 0, 0);
      startTime.setHours(10, 0, 0, 0);

      while (startTime < endTime) {
        slots.push({
          datetime: new Date(startTime),
          time: startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      allDaysSlots.push(slots);
    }

    setDocSlots(allDaysSlots);
  };

  const getDayLabel = (index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      dayName: daysOfWeek[date.getDay()],
      dayNumber: date.getDate(),
    };
  };

  return (
    docInfo && (
      <div className="p-6 max-w-6xl mx-auto min-h-screen">
        {/* Doctor Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={docInfo.image}
            alt="doctor"
            className="w-full sm:w-64 rounded-xl bg-primary"
          />

          <div className="flex-1 bg-white rounded-xl p-6 shadow border border-gray-200">
            <p className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              {docInfo.name}
              <img src={assets.verified_icon} className="w-5 h-5" alt="verified" />
            </p>
            <p className="text-gray-600 mt-1">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <span className="text-sm inline-block mt-1 bg-gray-100 px-2 py-1 rounded-full text-gray-700">
              {docInfo.experience}
            </span>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-gray-600 text-sm mt-1">{docInfo.about}</p>
            </div>

            <p className="mt-4 text-gray-600">
              Appointment fee:{' '}
              <span className="text-gray-800 font-medium">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots Section */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-xl font-medium text-gray-800">Booking slots</p>

          {/* Day Buttons */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-4">
            {Array.from({ length: 7 }).map((_, index) => {
              const { dayName, dayNumber } = getDayLabel(index);
              const isActive = selectedDay === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDay(index);
                    setSelectedTime('');
                  }}
                  className={`w-14 h-20 flex flex-col items-center justify-center rounded-full text-sm font-semibold transition 
                    ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  <span>{dayName}</span>
                  <span className="text-lg font-bold">{dayNumber}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="mt-6 flex justify-center">
            <div className="overflow-x-auto">
              <div className="flex gap-3 w-max">
                {docSlots[selectedDay]?.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`px-4 py-2 rounded-full border text-sm transition whitespace-nowrap
                      ${selectedTime === slot.time
                        ? 'bg-blue-100 text-black border-blue-400'
                        : 'hover:bg-gray-100 border-gray-300 text-gray-800'}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Book Button */}
          <div className="mt-8 flex justify-center">
            <button
              disabled={!selectedTime}
              className={`px-8 py-3 rounded-full text-white font-medium transition duration-200 ${
                selectedTime
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
             <p>Book an appointment</p>  
            </button>
          </div>
        </div>
        {/* Listing Related Doctors */}
          <RelatedDoctor docId={docId} speciality={docInfo.speciality} />

      </div>
    )
  );
};

export default Appointment;

