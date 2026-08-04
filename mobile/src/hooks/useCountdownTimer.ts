import { useState, useEffect } from 'react';

export interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
  formattedText: string;
}

export function useCountdownTimer(targetEndTime?: string): CountdownState {
  const [timerState, setTimerState] = useState<CountdownState>({
    hours: '01',
    minutes: '59',
    seconds: '59',
    isExpired: false,
    formattedText: '01:59:59',
  });

  useEffect(() => {
    // If targetEndTime is not provided, default to end of current 2-hour window
    const getTargetTime = () => {
      if (targetEndTime) {
        return new Date(targetEndTime).getTime();
      }
      const now = new Date();
      now.setHours(now.getHours() + 2, 0, 0, 0);
      return now.getTime();
    };

    const targetTime = getTargetTime();

    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimerState({
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
          formattedText: '00:00:00',
        });
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      const hoursStr = hrs.toString().padStart(2, '0');
      const minsStr = mins.toString().padStart(2, '0');
      const secsStr = secs.toString().padStart(2, '0');

      setTimerState({
        hours: hoursStr,
        minutes: minsStr,
        seconds: secsStr,
        isExpired: false,
        formattedText: `${hoursStr}:${minsStr}:${secsStr}`,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEndTime]);

  return timerState;
}
