import { useState } from 'react';

const EmptyPartners = () => {
  const [isOpen] = useState<boolean>(false);

  return (
    <>
      <section className="pb-16 bg-secondary">
        <article className={(isOpen ? 'opened bg-primary' : '') + ' selected lg:px-8'}>
          <div className="max-w-7xl m-auto px-4 lg:px-0">
            <header className={(isOpen ? 'bg-primary text-secondary mb-8 lg:mb-16' : 'bg-secondary-h') + ' relative rounded-xl  h-56 '}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="w-ful text-base font-sans opacity-40">We will reveal our next collaboration soon...</p>
              </div>
            </header>
          </div>
        </article>
      </section>
    </>
  );
};

export default EmptyPartners;
