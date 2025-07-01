import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import VersionCheck from 'react-native-version-check';

const useUpdatePrompt = () => {
  const [skippedThisSession, setSkippedThisSession] = useState(false);

  useEffect(() => {
    const checkAndPromptUpdate = async () => {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) return;

      try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = VersionCheck.getCurrentVersion();

        const updateNeeded = await VersionCheck.needUpdate({
          currentVersion,
          latestVersion,
        });

        if (updateNeeded?.isNeeded && !skippedThisSession) {
          Alert.alert(
            'নতুন আপডেট এসেছে!',
            'অ্যাপের একটি নতুন আপডেট এসেছে। এই আপডেটে অ্যাপটি ব্যবহারে আরও ভালো এক্সপেরিয়েন্স পাবেন।',
            [
              {
                text: 'পরে করবো',
                onPress: () => setSkippedThisSession(true),
                style: 'cancel',
              },
              {
                text: 'এখনই আপডেট করব',
                onPress: () => {
                  Linking.openURL('https://play.google.com/store/apps/details?id=cc.rafat.narsingditransit');
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.warn('Version check failed:', error);
      }
    };

    checkAndPromptUpdate();
  }, [skippedThisSession]);
};

export default useUpdatePrompt;
