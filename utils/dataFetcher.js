import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAndCacheRoute = async (from, to) => {
  let url = null;
  if (from === 'নরসিংদী' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/NarsingdiToKamalapurAirport';
  }
  if (from === 'ঢাকা' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToNarsingdi';
  }
  if (from === 'বিমানবন্দর' && to === 'নরসিংদী') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToNarsingdi';
  }
  if (from === 'মেথিকান্দা' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/MethikandaToKamalapurAirport';
  }
  if (from === 'ঢাকা' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToMethikanda';
  }
  if (from === 'বিমানবন্দর' && to === 'মেথিকান্দা') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/AirportToMethikanda';
  }
    if (from === 'ভৈরব' && (to === 'ঢাকা' || to === 'বিমানবন্দর')) {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/BhairabToKamalapurAirport';
  }
    if (from === 'ঢাকা' && to === 'ভৈরব') {
    url = 'https://opensheet.elk.sh/1lTyZqxeUvkAEkqZ-W_wciuboS2K5np7Ximr_DdsSCpI/KamalapurToBhairab';
  }
  if (from === 'বিমানবন্দর' && to === 'ভৈরব') {
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
