import { useEffect, useState } from 'react';
import { getSolanaClockLag } from 'web3/Accounts';

interface IMortuaryDurationProps {
  hoursLimit: number;
  createTimestampNFT: number;
}

const MortuaryDuration = ({ hoursLimit, createTimestampNFT }: IMortuaryDurationProps) => {
  const milliSecondesLimit = hoursLimit * 60 * 60 * 1000;
  const [lag, setLag] = useState<number>(0);
  const [durationLeft, setDurationLeft] = useState<string>('00:00:00');
  const [timestampLimit, setTimestampLimit] = useState(new Date().getTime() - milliSecondesLimit);
  const sizeBarreTotal = 64;
  const [barreSize, setBarreSize] = useState(sizeBarreTotal);

  useEffect(() => {
    (async () => {
      let lag = await getSolanaClockLag();
      setLag(lag);
    })();
  }, [milliSecondesLimit, lag]);

  useEffect(() => {
    const interval = setInterval(() => setTimestampLimit(new Date().getTime() - lag - milliSecondesLimit), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [milliSecondesLimit, lag]);

  useEffect(() => {
    if (!timestampLimit || !createTimestampNFT) return;

    const diffLeft = (createTimestampNFT - timestampLimit) / 1000;
    let hours = Math.floor(diffLeft / 60 / 60);
    let minutes = Math.floor((diffLeft / 60) % 60);
    let secondes = Math.floor(diffLeft % 60);
    const formatTime = (time: number) => (time < 10 ? '0' + time : time);

    setDurationLeft(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(secondes)}`);
    setBarreSize((sizeBarreTotal * diffLeft) / (hoursLimit * 60 * 60));
  }, [timestampLimit, createTimestampNFT, hoursLimit]);

  return (
    <>
      <div className="h-1 w-16 bg-grayDuration">
        <div className="h-1 bg-third" style={{ width: barreSize + 'px' }}></div>
      </div>
      <div className="text-secondary mt-1 font-sansLight text-xs text-center">{durationLeft}</div>
    </>
  );
};

export default MortuaryDuration;
