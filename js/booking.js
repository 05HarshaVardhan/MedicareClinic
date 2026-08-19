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

  let previouslyFocusedElement = null;

  function openModal() {
    if (!successModal) return;
    previouslyFocusedElement = document.activeElement;
    successModal.classList.add('active');
    
    const focusable = successModal.querySelector('button, [tabindex="0"]');
    if (focusable) focusable.focus();

    document.addEventListener('keydown', handleModalKeydown);
  }

  function closeModal() {
    if (!successModal) return;
    successModal.classList.remove('active');
    document.removeEventListener('keydown', handleModalKeydown);
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  }

  function handleModalKeydown(e) {
    if (!successModal || !successModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(successModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  function updateControlValidity(control) {
    const isInvalid = !control.checkValidity();
    control.classList.toggle('invalid', isInvalid);
    control.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  }

  function updateAppointmentDateState() {
    if (!appointmentDateInput) return;

    const isAvailable = validateAppointmentAvailability();
    if (appointmentDateInput.value) {
      const isInvalid = !isAvailable;
      appointmentDateInput.classList.toggle('invalid', isInvalid);
      appointmentDateInput.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
    } else {
      appointmentDateInput.classList.remove('invalid');
      appointmentDateInput.setAttribute('aria-invalid', 'false');
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
        updateControlValidity(control);
        if (!control.checkValidity()) {
          isValid = false;
        }
        
        control.addEventListener('input', () => updateControlValidity(control));
      });
      
      if (isValid && successModal) {
        openModal();
        appointmentForm.reset();
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const formControls = contactForm.querySelectorAll('.form-control');

      formControls.forEach(control => {
        updateControlValidity(control);
        if (!control.checkValidity()) {
          isValid = false;
        }
        control.addEventListener('input', () => updateControlValidity(control));
      });

      if (isValid) {
        alert('Thank you for contacting MedCare Clinic! We will get back to you shortly.');
        contactForm.reset();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
}

window.initBookingModule = initBookingModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingModule);
} else {
  initBookingModule();
}
