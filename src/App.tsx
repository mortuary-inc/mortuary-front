import React, { lazy, Suspense } from 'react';

import { Wallet } from 'features/Connect/Wallet';
import { createContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Routes } from 'routes/conf';
const Homepage = lazy(() => import('./features/misc/routes/HomePage'));
const ThemeWrapper = lazy(() => import('components/ThemeWrapper'));
const FakeMint = lazy(() => import('features/misc/routes/FakeMint'));
const TermCondition = lazy(() => import('features/misc/routes/TermCondition'));
const About = lazy(() => import('features/misc/routes/About'));
const Roadmap = lazy(() => import('features/misc/routes/Roadmap'));
const RoadmapDetails = lazy(() => import('features/Roadmap/RoadmapDetails'));
const RoadmapImage = lazy(() => import('features/Roadmap/RoadmapImage'));
const Partners = lazy(() => import('features/misc/routes/Partners'));
const Expendable = lazy(() => import('features/Partners/Expandable'));
const ExpendableZen0 = lazy(() => import('features/Partners/ExpandableZen0'));
const EmptyPartners = lazy(() => import('features/Partners/EmptyPartners'));
const MyMortuary = lazy(() => import('features/misc/routes/MyMortuary2'));
const MyMortuaryGate = lazy(() => import('features/misc/routes/MyMortuaryGate'));
const Commons = lazy(() => import('features/misc/routes/Commons'));
const CommonsList = lazy(() => import('features/misc/routes/CommonsList'));
const AdminEdit = lazy(() => import('features/Admin/AdminEdit'));
const Cleaner = lazy(() => import('features/misc/routes/Cleaner'));
const Lexicon = lazy(() => import('features/misc/routes/Lexicon'));
const AllNecrology = lazy(() => import('features/misc/routes/AllNecrology'));
const Grant = lazy(() => import('features/misc/routes/Grant'));
const isMaintenance = process.env.REACT_APP_MAINTENANCE
const renderLoader = () => (
  <div className="inline-flex items-center px-4 py-2 font-sans leading-6 text-sm shadow rounded-md text-primary bg-third transition ease-in-out duration-150 cursor-not-allowed ml-4 mt-4">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Loading...
  </div>
);

const defaultAppContext = {
};
export const AppContext = createContext(defaultAppContext);

function App() {

  const contextapp = {
  };

  return (
    <>
      {isMaintenance == "1" ? (
        <BrowserRouter>
        <Suspense fallback={renderLoader()}>
          <div className='h-screen w-screen'>
              <button type="button" className="inline-flex mt-4 ml-4 transform px-4 py-2 font-sans leading-6 text-sm shadow rounded-md text-black bg-third hover:bg-third-h transition ease-in-out duration-150 cursor-not-allowed" disabled>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Under Maintenance
                  </button>
          </div>
          
        </Suspense>
        </BrowserRouter>
        
        
      ) : (
        <AppContext.Provider value={contextapp}>
      <Wallet>
        <BrowserRouter>
          <Switch>
            <Route path={Routes.HomePage} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true} className={' overflow-hidden'}>
                  <Homepage />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.About} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={false} nav={true} footer={true}>
                  <About />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Partners} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={false} nav={true} footer={false}>
                  <Partners />
                </ThemeWrapper>
                <ExpendableZen0 />
                <Expendable />
                <EmptyPartners />
                <ThemeWrapper darkMode={false} nav={false} footer={true}>
                  <></>
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Roadmap} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={false} nav={true} footer={false}>
                  <Roadmap />
                </ThemeWrapper>
                <RoadmapImage />
                <ThemeWrapper darkMode={true} nav={false} footer={true} className=" bg-cover bg-no-repeat bg-center bg-roadmap">
                  <RoadmapDetails />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.TermCondition} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true}>
                  <TermCondition />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.FakeMint} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true}>
                  <FakeMint />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.MyMortuary} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true}>
                  <MyMortuaryGate />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.MyMortuary + ':mint'} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true} forceH={true}>
                  <MyMortuary />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Commons + ':mint'} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true} forceH={true}>
                  <Commons />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.CommonsList} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true} forceH={true}>
                  <CommonsList />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Cleaner} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true} forceH={true}>
                  <Cleaner />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.AllNecrology} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true}>
                  <AllNecrology />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Lexicon} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={false} nav={true} footer={true}>
                  <Lexicon />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.Grant} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={false} nav={true} footer={true}>
                  <Grant />
                </ThemeWrapper>
              </Suspense>
            </Route>
            <Route path={Routes.AdminEdit} exact>
              <Suspense fallback={renderLoader()}>
                <ThemeWrapper darkMode={true} nav={true} footer={true}>
                  <AdminEdit />
                </ThemeWrapper>
              </Suspense>
            </Route>
          </Switch>
        </BrowserRouter>
      </Wallet>
    </AppContext.Provider>
      )}
    </>
  );
}
export default App;
