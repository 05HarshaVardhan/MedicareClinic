const flagshipClinic = {
  title: "MedCare Flagship Clinic",
  address: "123 Healthcare Avenue, Medical District",
  phone: "+1 (555) 234-5678",
  hours: "Mon-Sun: 8:00 AM - 8:00 PM",
  mapUrl: "https://maps.google.com/maps?q=123+Healthcare+Avenue+Medical+District&t=&z=14&ie=UTF8&iwloc=&output=embed"
};

function initLocatorModule() {
  const branchTitle = document.getElementById('branchTitle');
  const branchAddress = document.getElementById('branchAddress');
  const branchPhone = document.getElementById('branchPhone');
  const branchHours = document.getElementById('branchHours');
  const googleMapIframe = document.getElementById('googleMapIframe');

  if (branchTitle) branchTitle.textContent = flagshipClinic.title;
  if (branchAddress) branchAddress.innerHTML = `<i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${flagshipClinic.address}`;
  if (branchPhone) branchPhone.innerHTML = `<i class="fas fa-phone" aria-hidden="true"></i> ${flagshipClinic.phone}`;
  if (branchHours) branchHours.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> ${flagshipClinic.hours}`;
  if (googleMapIframe && !googleMapIframe.src) {
    googleMapIframe.src = flagshipClinic.mapUrl;
  }
}

window.initLocatorModule = initLocatorModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLocatorModule);
} else {
  initLocatorModule();
}
