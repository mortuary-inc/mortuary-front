interface ISimplePaginationProps {
  className?: string;
  index: number;
  length: number;
  setIndex: (_index: number) => void;
}

const SimplePagination = ({ className, index, length, setIndex }: ISimplePaginationProps) => {
  return (
    <div className={`${className ?? ''} text-center text-xl flex justify-between cursor-pointer`}>
      {index ? (
        <div className="absolute -left-16 top-1/2 border border-primary p-2 rounded-full z-20 bg-secondary text-primary" onClick={() => setIndex(index - 1)}>
          {' ⟵ '}
        </div>
      ) : (
        <></>
      )}
      {index < length - 1 ? (
        <div className="absolute -right-16 top-1/2 border border-primary p-2 rounded-full z-20 bg-secondary text-primary" onClick={() => setIndex(index + 1)}>
          {' ⟶ '}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SimplePagination;
