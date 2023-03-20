import { useState, useEffect } from 'react';

export type TimeLeft = {
  diff: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// endTime in s.
const useCountdown = (endTime0: number): [TimeLeft, React.Dispatch<React.SetStateAction<number>>] => {
  const [endTime, setEndTime] = useState(endTime0);
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft(endTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      let et = computeTimeLeft(endTime);

      if (et.diff < -1) return;
      setTimeLeft(et);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, endTime]);

  return [timeLeft, setEndTime];
};

// end time in s.
const computeTimeLeft = (endTime: number) => {
  let now = Date.now() / 1000;
  let diff = endTime - now;
  if (diff <= 0) {
    return {
      diff: diff,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    diff: diff,
    days: Math.floor(diff / (60 * 60 * 24)),
    hours: Math.floor((diff / (60 * 60)) % 24),
    minutes: Math.floor((diff / 60) % 60),
    seconds: Math.floor(diff % 60),
  };
};

export const formatTimeLeftForBurn = (timeLeft: TimeLeft) => {
  // ignore days
  let s = formatNum2(timeLeft.hours) + ':';
  s += formatNum2(timeLeft.minutes) + ':';
  s += formatNum2(timeLeft.seconds);
  return s;
};

function formatNum2(n: number) {
  return n.toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export default useCountdown;
