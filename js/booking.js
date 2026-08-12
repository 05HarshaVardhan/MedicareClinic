/* =================================================================
   MedCare Clinic - Booking Form Module
   ================================================================ */

function initBookingModule() {
  const appointmentForm = document.getElementById('appointmentForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const doctorSelect = document.getElementById('doctorSelect');
  const appointmentDateInput = document.getElementById('date');
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!appointmentForm && !doctorSelect) return;

  function getTodayDateValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getErrorMessageElement(control) {
    return control ? control.parentElement.querySelector('.error-msg') : null;
  }

  const defaultDateError = getErrorMessageElement(appointmentDateInput)?.textContent || 'Please select a valid date.';

  function setDateError(message) {
    const dateError = getErrorMessageElement(appointmentDateInput);
    if (dateError) {
      dateError.textContent = message;
    }
  }

  function getSelectedDoctor() {
    if (!doctorSelect || typeof doctors === 'undefined') return null;
    return doctors.find(doc => doc.name === doctorSelect.value);
  }

  function validateAppointmentAvailability() {
    if (!appointmentDateInput) return true;

    appointmentDateInput.setCustomValidity('');
    setDateError(defaultDateError);

    const selectedDateValue = appointmentDateInput.value;
    if (!selectedDateValue) {
      return appointmentDateInput.checkValidity();
    }

    if (selectedDateValue < getTodayDateValue()) {
      const message = 'Please choose today or a future date.';
      appointmentDateInput.setCustomValidity(message);
      setDateError(message);
      return false;
    }

    const selectedDoctor = getSelectedDoctor();
    if (!selectedDoctor) {
      return appointmentDateInput.checkValidity();
    }

    const selectedDate = new Date(`${selectedDateValue}T00:00:00`);
    const selectedDay = dayNames[selectedDate.getDay()];

    if (!selectedDoctor.availableDays.includes(selectedDay)) {
      const message = `${selectedDoctor.name} is not available on ${selectedDay}. Available days: ${selectedDoctor.availableDays.join(', ')}.`;
      appointmentDateInput.setCustomValidity(message);
      setDateError(message);
      return false;
    }

    return appointmentDateInput.checkValidity();
  }

  function updateAppointmentDateState() {
    if (!appointmentDateInput) return;

    const isAvailable = validateAppointmentAvailability();
    if (appointmentDateInput.value) {
      appointmentDateInput.classList.toggle('invalid', !isAvailable);
    } else {
      appointmentDateInput.classList.remove('invalid');
    }
  }

  if (appointmentDateInput) {
    appointmentDateInput.min = getTodayDateValue();
    appointmentDateInput.addEventListener('input', updateAppointmentDateState);
    appointmentDateInput.addEventListener('change', updateAppointmentDateState);
  }

  if (doctorSelect && typeof doctors !== 'undefined' && doctorSelect.options.length <= 1) {
    doctors.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.name;
      option.textContent = `${doc.name} - ${doc.specialty} (${doc.experience}) - Available: ${doc.availableDays.join(', ')}`;
      doctorSelect.appendChild(option);
    });

    doctorSelect.addEventListener('change', updateAppointmentDateState);
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      validateAppointmentAvailability();
      
      const formControls = appointmentForm.querySelectorAll('.form-control');
      
      formControls.forEach(control => {
        if (!control.checkValidity()) {
          control.classList.add('invalid');
          isValid = false;
        } else {
          control.classList.remove('invalid');
        }
        
        control.addEventListener('input', () => {
          if (control.checkValidity()) {
            control.classList.remove('invalid');
          }
        });
      });
      
      if (isValid && successModal) {
        successModal.classList.add('active');
        appointmentForm.reset();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingModule);
} else {
  initBookingModule();
}
