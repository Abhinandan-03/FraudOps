import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import Footer from './Footer';

export default function Layout({ children, showSideNav = true }) {
  return (
    <>
      <TopNavBar />
      {showSideNav && <SideNavBar />}
      <main className={`flex-grow mt-16 ${showSideNav ? 'md:ml-64' : ''} p-4 md:p-8 flex flex-col relative z-10 pb-16 min-h-[calc(100vh-64px)]`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
