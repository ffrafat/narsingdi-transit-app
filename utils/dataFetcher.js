import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAndCacheRoute = async (from, to) => {
  let url = null;
  if (from === 'নরসিংদী' && (to === 'কমলাপুর' || to === 'এয়ারপোর্ট')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/NarsingdiToKamalapurAirport';
  }
  if (from === 'কমলাপুর' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToNarsingdi';
  }
  if (from === 'এয়ারপোর্ট' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToNarsingdi';
  }
  if (from === 'মেথিকান্দা' && (to === 'কমলাপুর' || to === 'এয়ারপোর্ট')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/MethikandaToKamalapurAirport';
  }
  if (from === 'কমলাপুর' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToMethikanda';
  }
  if (from === 'এয়ারপোর্ট' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToMethikanda';
  }
    if (from === 'ভৈরব' && (to === 'কমলাপুর' || to === 'এয়ারপোর্ট')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/BhairabToKamalapurAirport';
  }
    if (from === 'কমলাপুর' && to === 'ভৈরব') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToBhairab';
  }
  if (from === 'এয়ারপোর্ট' && to === 'ভৈরব') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToBhairab';
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
