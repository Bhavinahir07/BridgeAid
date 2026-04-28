import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA] flex flex-col font-inter">

      {/* Navbar - Deep Teal */}
      <nav className="bg-[#0F4C5C] text-white px-6 py-2 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* <span className="font-bold text-2xl tracking-tight">BridgeAid</span> */}

          {/* Added height (h-10), auto width (w-auto), and object-contain to prevent stretching */}
          <img
            src="src/assets/light-logo.png"
            alt="BridgeAid Logo"
            className="h-20 w-auto object-contain"
          />

          <div className="flex items-center gap-6">
            <Link to="/Login" className="text-sm font-medium text-[#E0EFF2] hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/login" className="bg-[#E8A020] text-[#3a2000] text-sm font-bold px-6 py-2.5 rounded-full hover:brightness-105 transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <main className="flex-grow flex items-center relative overflow-hidden px-6 py-20">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#E0EFF2] rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D6EDF1] rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">

          {/* Left Column: Copy & CTA */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-[#6C4BE8]/10 border border-[#6C4BE8]/20 text-[#6C4BE8] text-xs font-bold px-4 py-1.5 rounded-full w-max tracking-wide uppercase">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Smart Resource Allocation
            </div>

            {/* Heading matching the footer color */}
            <h1 className="font-grotesk font-extrabold text-5xl md:text-6xl text-[#0F4C5C] leading-[1.1] tracking-tight">
              Connect. Match. <span className="text-[#E8A020]">Solve.</span>
            </h1>

            <p className="text-lg text-[#1C2B33]/80 leading-relaxed max-w-lg mt-2">
              The platform that bridges the gap between those who need help and those who want to give it. We ensure the right volunteer is assigned to the right problem, instantly.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/login" className="bg-[#0F4C5C] text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_8px_20px_rgba(15,76,92,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(15,76,92,0.35)] transition-all">
                Join as Volunteer
              </Link>
              <Link to="/login" className="bg-white border-2 border-[#0F4C5C] text-[#0F4C5C] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#E0EFF2] transition-all">
                Register NGO
              </Link>
            </div>
          </div>

          {/* Right Column: Floating UI Component */}
          <div className="relative lg:ml-auto w-full max-w-md">
            <div className="bg-white border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-[#1C2B33] text-lg">Live Match</span>
                <span className="flex items-center gap-2 text-xs font-bold text-[#1AC99B] bg-[#1AC99B]/10 px-3 py-1 rounded-full border border-[#1AC99B]/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1AC99B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1AC99B]"></span>
                  </span>
                  System Active
                </span>
              </div>

              <div className="bg-[#F7F9FA] rounded-xl p-5 mb-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#E8A020] w-2 h-2 rounded-full"></span>
                  <p className="text-xs text-[#1C2B33]/60 uppercase tracking-widest font-bold">Urgent Request</p>
                </div>
                <p className="font-semibold text-[#1C2B33] text-lg">Food supplies needed in Rajkot</p>
                <p className="text-sm text-[#1C2B33]/60 mt-1">Posted 2 mins ago by Asha NGO</p>
              </div>

              <div className="flex items-start gap-3 text-sm font-medium text-[#6C4BE8] bg-[#6C4BE8]/5 p-4 rounded-xl border border-[#6C4BE8]/15">
                <div className="bg-[#6C4BE8] text-white p-1.5 rounded-lg shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="font-bold mb-0.5">AI Match Successful</p>
                  <p className="text-[#6C4BE8]/80 text-xs">Ravi Sharma (Logistics Expert) is 0.4 km away and has been notified.</p>
                </div>
              </div>
            </div>

            {/* Abstract decorative element behind the card */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-dashed border-[#8EC9D6] rounded-2xl -z-10"></div>
          </div>

        </div>
      </main>

      {/* Footer - Deep Teal to match Heading and Navbar */}
      <footer className="bg-[#0F4C5C] py-8 px-6 text-center border-t border-[#2E8BA0]/30 mt-auto">
        <p className="text-[#E0EFF2]/80 text-sm font-medium">
          &copy; 2026 BridgeAid Platform. Empowering NGOs & Volunteers.
        </p>
      </footer>
    </div>
  );
}