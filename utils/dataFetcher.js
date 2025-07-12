import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAndCacheRoute = async (from, to) => {
  let url = null;

// Narsingdi
  if (from === 'নরসিংদী' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/NarsingdiToKamalapurAirport';
  }
  if (from === 'নরসিংদী' && (to === 'তেজগাঁও')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/NarsingdiToTejgaon';
  }
  if (from === 'ঢাকা' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToNarsingdi';
  }
  if (from === 'বিমানবন্দর' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToNarsingdi';
  }


  // Methikanda
  if (from === 'মেথিকান্দা' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/MethikandaToKamalapurAirport';
  }
  if (from === 'মেথিকান্দা' && to === 'তেজগাঁও') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/MethikandaToTejgaon';
  }
  if (from === 'ঢাকা' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToMethikanda';
  }
  if (from === 'বিমানবন্দর' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToMethikanda';
  }


  // Bhairab
    if (from === 'ভৈরব' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/BhairabToKamalapurAirport';
  }
  if (from === 'ভৈরব' && to === 'তেজগাঁও') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/BhairabToTejgaon';
  }
    if (from === 'ঢাকা' && to === 'ভৈরব') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToBhairab';
  }
  if (from === 'বিমানবন্দর' && to === 'ভৈরব') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToBhairab';
  }



// Doulotkandi
  if (from === 'দৌলতকান্দি' && (to === 'ঢাকা' || to === 'বিমানবন্দর' || to === 'তেজগাঁও')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/DoulotkandiToAirportTejgaonKamalapur';
  }

  if (from === 'বিমানবন্দর' && (to === 'দৌলতকান্দি')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToDoulotkandi';
  }

  if (from === 'ঢাকা' && (to === 'দৌলতকান্দি')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToDoulotkandi';
  }



// Tejgaon
    if (from === 'তেজগাঁও' && (to === 'নরসিংদী' || to === 'মেথিকান্দা' || to === 'ভৈরব')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/TejgaonToNarsingdiMethikandaBhairab';
  }

    if (from === 'তেজগাঁও' && (to === 'দৌলতকান্দি')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/TejgaonToDoulotkandi';
  }


  if (!url) return;

  try {
    const res = await fetch(url);
    const data = await res.json();
    await AsyncStorage.setItem(`route_${from}_${to}`, JSON.stringify(data));
  } catch (e) {
    console.error(`❌ Failed to cache ${from} → ${to}`, e);
  }
};

export const loadFromCache = async (from, to) => {
  const cacheKey = `route_${from}_${to}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('Failed to load from cache', e);
    return null;
  }
};
