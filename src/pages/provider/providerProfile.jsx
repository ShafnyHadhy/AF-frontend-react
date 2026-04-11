import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdVerifiedUser } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
import { FcCancel } from "react-icons/fc";
import { GoogleMap, Marker, useLoadScript, Circle } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';

export default function ProviderProfile() {

  const [profile, setProfile] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [providerType, setProviderType] = useState('');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState(['Electronics Repair', 'Battery Recycling']);
  const [serviceInput, setServiceInput] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [serviceRadiusKm, setServiceRadiusKm] = useState(10);
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612 });
  const [errors, setErrors] = useState({});

  const textOnlyRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const nextErrors = {};

    if (!businessName.trim()) {
      nextErrors.businessName = 'Business name is required.';
    } else if (!textOnlyRegex.test(businessName.trim())) {
      nextErrors.businessName = 'Business name should contain letters only.';
    }

    if (!providerType) {
      nextErrors.providerType = 'Provider type is required.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!phone.trim()) {
      nextErrors.phone = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      nextErrors.phone = 'Mobile number must be exactly 10 digits.';
    }

    if (contactPerson.trim() && !textOnlyRegex.test(contactPerson.trim())) {
      nextErrors.contactPerson = 'Contact person should contain letters only.';
    }

    const radiusValue = Number(serviceRadiusKm);
    if (Number.isNaN(radiusValue) || radiusValue <= 0) {
      nextErrors.serviceRadiusKm = 'Radius should be a positive number.';
    }

    if (!addressLine.trim()) {
      nextErrors.addressLine = 'Address line is required.';
    }

    if (!city.trim()) {
      nextErrors.city = 'City is required.';
    }

    if (!district.trim()) {
      nextErrors.district = 'District is required.';
    }

    return nextErrors;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login again.');
      return;
    }

    axios.get(import.meta.env.VITE_API_URL + '/api/providers/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      // API may return an array or a single object
      const profileData = Array.isArray(response.data) ? response.data[0] : response.data;

      if (!profileData) {
        setProfile(null);
        toast('No provider profile found yet.');
        return;
      }
      
      setProfile(profileData);
      setBusinessName(profileData.businessName || '');
      setProviderType(profileData.providerType || '');
      setBio(profileData.description || '');
      setContactPerson(profileData.contactPerson || '');
      setEmail(profileData.email || '');
      setPhone(profileData.phone || '');
      setAddressLine(profileData.addressLine || '');
      setCity(profileData.city || '');
      setDistrict(profileData.district || '');
      setServiceRadiusKm(profileData.serviceRadiusKm || 10);
      setServices(profileData.categories || ['Electronics Repair', 'Battery Recycling']);
      setLocation({
        lat: profileData.location?.coordinates?.[1] || 6.9271,
        lng: profileData.location?.coordinates?.[0] || 79.8612,
      });

      console.log('Profile loaded:', profileData);
    })
    .catch((error) => {
      console.error('Error fetching services:', error);
    });

  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const updateProfile = async () => {

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const token = localStorage.getItem('token');

    const updatedData = {
      businessName,
      providerType,
      description: bio,
      contactPerson,
      email,
      phone,
      addressLine,
      city,
      district,
      serviceRadiusKm,
      categories: services,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      }
    }

    const providerCode = profile?.providerCode; 

    try {

      await axios.put(import.meta.env.VITE_API_URL + `/api/providers/${providerCode}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
    
  }

  const handleDiscard = () => {
    if (!profile) return;

    setBusinessName(profile.businessName || '');
    setProviderType(profile.providerType || '');
    setBio(profile.description || '');
    setContactPerson(profile.contactPerson || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
    setAddressLine(profile.addressLine || '');
    setCity(profile.city || '');
    setDistrict(profile.district || '');
    setServiceRadiusKm(profile.serviceRadiusKm || 10);
    setServices(profile.categories || ['Electronics Repair', 'Battery Recycling']);
    setServiceInput('');
    setLocation({
      lat: profile.location?.coordinates?.[1] || 6.9271,
      lng: profile.location?.coordinates?.[0] || 79.8612,
    });
  };

  const addService = () => {
    const next = serviceInput.trim();
    if (!next) return;

    const exists = services.some((service) => service.toLowerCase() === next.toLowerCase());
    if (exists) {
      setServiceInput('');
      return;
    }

    setServices((prev) => [...prev, next]);
    setServiceInput('');
  };

  const removeService = (indexToRemove) => {
    setServices((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen text-slate-900 font-['Inter']">

      <main className="pb-20 px-8">
        {/* Header Section */}
        <header className="mb-8 flex justify-between">
          <div>
              <h1 className="text-lg font-bold text-slate-900 mb-2">
                Provider Profile Setup
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Define your facility's capabilities and pin your location to the map.
              </p>
            </div>
          <div>
              {profile?.approvalStatus === 'approved' ? (
                <div className="flex items-center gap-1">
                  <MdVerifiedUser className="text-green-500" /> 
                  <span className="text-sm font-semibold text-green-600"> Approved</span>
                </div>
              ) : profile?.approvalStatus === 'rejected' ? (
                <div className="flex items-center gap-1">
                  <FcCancel className="text-red-500" />
                  <span className="text-sm font-semibold text-red-600"> Rejected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <GoUnverified className="text-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-600"> Pending Approval</span>
                </div>
              )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-5 space-y-4">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
              <h2 className="text-sm font-bold mb-4">Core Information</h2>
              
              <div className="space-y-4">
                {/* Business Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="business-name">Business Name</label>
                  <input 
                    id="business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      setBusinessName(value);
                      if (errors.businessName) {
                        setErrors((prev) => ({ ...prev, businessName: '' }));
                      }
                    }}
                    placeholder="e.g. GreenLoop Restoration Hub"
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder:text-slate-400 text-sm"
                  />
                  {errors.businessName && <p className="text-xs text-red-600">{errors.businessName}</p>}
                </div>

                {/* Provider Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="provider-type">Provider Type</label>
                  <div className="relative">
                    <select 
                      id="provider-type"
                      value={providerType}
                      onChange={(e) => setProviderType(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 appearance-none transition-all text-sm"
                    >
                      <option value="">Select facility type</option>
                      <option value="repair_center">Repair Center</option>
                      <option value="recycler">Recycler</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                  </div>
                  {errors.providerType && <p className="text-xs text-red-600">{errors.providerType}</p>}
                </div>

                {/* Services Multi-select */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Services Provided</label>
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg min-h-10 border border-slate-200">
                    {services.map((service, index) => (
                      <span key={`${service}-${index}`} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold gap-1">
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="material-symbols-outlined text-[8px] cursor-pointer hover:text-green-900"
                          aria-label={`Remove ${service}`}
                        >
                          close
                        </button>
                      </span>
                    ))}
                    <div className="w-full flex gap-2 mt-1">
                      <input
                        type="text"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addService();
                          }
                        }}
                        placeholder="Add a service and press Enter"
                        className="flex-1 h-9 px-3 rounded-full bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={addService}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[8px]">add</span> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="Tell us about your experience and what makes you unique"
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all resize-none text-sm"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Service Radius (KM)</label>
                  <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={serviceRadiusKm}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setServiceRadiusKm(value);
                      if (errors.serviceRadiusKm) {
                        setErrors((prev) => ({ ...prev, serviceRadiusKm: '' }));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                  />
                  {errors.serviceRadiusKm && <p className="text-xs text-red-600">{errors.serviceRadiusKm}</p>}
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
              <h2 className="text-sm font-bold mb-4">Contact Information</h2>

              <div className="space-y-4">

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Contact Person</label>
                  <input 
                    type="text"
                    value={contactPerson}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      setContactPerson(value);
                      if (errors.contactPerson) {
                        setErrors((prev) => ({ ...prev, contactPerson: '' }));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                  />
                  {errors.contactPerson && <p className="text-xs text-red-600">{errors.contactPerson}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <input 
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                  />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                </div>

              </div>
            </section>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-7 h-full sticky top-24 space-y-4">
            <div className="relative w-full h-100 bg-slate-200 rounded-2xl overflow-hidden shadow-md border border-slate-300">
              {/* Map Mockup Background */}

                {!isLoaded ? (
                  <div className="flex items-center justify-center h-full">Loading Map...</div>
                ) : (
                  <GoogleMap
                    zoom={12}
                    center={location}
                    mapContainerClassName="w-full h-full"
                    onClick={(e) => {
                      const lat = e.latLng.lat();
                      const lng = e.latLng.lng();
                      setLocation({ lat, lng });
                      map.panTo({ lat, lng });
                    }}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                      zoomControl: true,
                    }}
                  >
                    <Marker 
                      position={location}
                      draggable={true}
                      onDragEnd={(e) => {
                        setLocation({
                          lat: e.latLng.lat(),
                          lng: e.latLng.lng(),
                        });
                      }} 
                    />

                    <Circle
                      center={location}
                      radius={Number(serviceRadiusKm) * 1000}
                      options={{
                        fillColor: "#22c55e",
                        fillOpacity: 0.2,
                        strokeColor: "#16a34a",
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                      }}
                    />
                  </GoogleMap>
                )}
             
              {/* Live Status Overlay */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-lg px-3 py-1.5 rounded-full shadow-sm border border-white/60 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-900 uppercase tracking-tight">Live</span>
              </div>

              {/* Marker Mockup */}
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg relative z-10 border-2 border-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home_repair_service</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-600 rotate-45 border-r border-b border-white z-0"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-600/10 rounded-full animate-ping"></div>
                </div>
              </div> */}

              {/* Map Interaction Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-lg px-4 py-2 rounded-full text-white flex items-center gap-2 w-max">
                <span className="material-symbols-outlined text-green-400 text-sm">info</span>
                <p className="text-xs font-medium">Click on the map to set location</p>
              </div>
            </div>

            <section className="bg-slate-50 w-full p-4 rounded-2xl space-y-3 border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Geographic Coordinates</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Latitude</span>
                  <span className="text-green-700 font-mono font-semibold text-sm">
                    {location.lat?.toFixed(4)}° N
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Longitude</span>
                  <span className="text-green-700 font-mono font-semibold text-sm">
                    {location.lng?.toFixed(4)}° {location.lng >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      });
                    },
                    (err) => {
                      alert("Location access denied");
                    }
                  );
                }}
                className="w-full flex items-center justify-center gap-2 h-10 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-green-100 transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-sm">my_location</span>
                Use My Location
              </button>
            </section>

            <section className="bg-slate-50 w-full p-4 rounded-2xl space-y-3 border border-slate-200">
              <h2 className="text-sm font-bold mb-4">Address Details</h2>

              <div className="space-y-4">

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700">Address Line</label>
                  <input 
                    type="text"
                    value={addressLine}
                    onChange={(e) => {
                      setAddressLine(e.target.value);
                      if (errors.addressLine) {
                        setErrors((prev) => ({ ...prev, addressLine: '' }));
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm"
                  />
                  {errors.addressLine && <p className="text-xs text-red-600">{errors.addressLine}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">City</label>
                    <input 
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) {
                          setErrors((prev) => ({ ...prev, city: '' }));
                        }
                      }}
                      className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm"
                    />
                    {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">District</label>
                    <input 
                      type="text"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        if (errors.district) {
                          setErrors((prev) => ({ ...prev, district: '' }));
                        }
                      }}
                      className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-sm"
                    />
                    {errors.district && <p className="text-xs text-red-600">{errors.district}</p>}
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-green-600 text-sm">verified_user</span>
            <span className="text-xs font-medium">Information is encrypted and verified.</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleDiscard}
              className="flex-1 md:flex-none px-6 h-10 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all text-sm"
            >
              Discard
            </button>
            <button 
              onClick={updateProfile}
              className="flex-1 md:flex-none px-8 h-10 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all text-sm"
            >
              Save Profile
            </button>
          </div>
        </div>
      </main>
     
    </div>
  );
};
