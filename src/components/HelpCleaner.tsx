import { Popover } from '@headlessui/react';
import { ReactComponent as TaxSVG } from 'assets/tax.svg';
import { ReactComponent as BoosterSVG } from 'assets/booster.svg';
import { ReactComponent as CommonsSVG } from 'assets/commons.svg';
import { ReactComponent as SharingSVG } from 'assets/sharing.svg';
import { ReactComponent as InfoBulleSVG } from 'assets/info_btn.svg';

interface HelpBoxProps {
  classNameBTN?: string;
  classNameCont?: string;
}

const HelpCleaner = ({ classNameBTN, classNameCont }: HelpBoxProps) => {
  return (
    <Popover className="relative">
      <Popover.Button>
        <InfoBulleSVG className={classNameBTN} />
      </Popover.Button>

      <Popover.Panel className={`${classNameCont ?? ''} absolute z-30 w-screen max-w-sm px-0 mt-3 transform`}>
        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
          <div className="relative grid gap-8 bg-white p-7">
            <span className="cursor-help flex items-top p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <CommonsSVG />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Commons</p>
                <p className="text-sm text-gray-500">You can decide to make your plot public or jealously keep it to yourself.</p>
              </div>
            </span>
            <span className="cursor-help flex items-top p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <TaxSVG />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Tax</p>
                <p className="text-sm text-gray-500">
                  In the new simplified tax system, the tax is automatically set at 4$ASH for boosted plots (renter will get 4$ASH) and 3$ASH for non boosted
                  plots (renter will get 2 $ASH).
                </p>
              </div>
            </span>
            <span className="cursor-help flex items-top p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <BoosterSVG />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Booster</p>
                <p className="text-sm text-gray-500">
                  To boost up your $ASH production, you need to hold a minion. Minions boost all plots held in your wallet.
                </p>
              </div>
            </span>
            <span className="cursor-help flex items-top p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <SharingSVG />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Sharing is caring</p>
                <p className="text-sm text-gray-500">When set to public, you can share an URL to your plot to maximize your earnings.</p>
              </div>
            </span>
          </div>
        </div>

        <img src="/solutions.jpg" alt="" />
      </Popover.Panel>
    </Popover>
  );
};

export default HelpCleaner;

/* <div className={(isHomepage ? 'hidden' : '') + ' lg:flex flex-1 justify-left pt-4'}> */
