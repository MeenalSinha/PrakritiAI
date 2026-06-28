<!-- TopNavBar (Shared Component) -->
<nav className="flex justify-between items-center px-margin-desktop h-16 w-full fixed top-0 z-50 bg-surface border-b border-outline-variant shadow-sm text-primary font-body-lg text-body-lg">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md font-bold text-primary">AgriIntel AI</span>
</div>
<div className="hidden md:flex items-center gap-6">
<!-- Navigation Links -->
<a className="text-primary font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Dashboard</a>
<a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Crops</a>
<a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Soil</a>
<a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Fleet</a>
<a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Markets</a>
<a className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform" href="#">Insights</a>
</div>
<div className="flex items-center gap-4">
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<img alt="User profile" className="w-8 h-8 rounded-full border border-outline" data-alt="AgriIntel AI brand logo featuring a stylized green leaf motif on a white background, representing natural farming." src="PLACEHOLDER"/>
</div>
</nav>
<!-- SideNavBar (Shared Component) -->
<aside className="hidden lg:flex flex-col p-base w-72 h-screen fixed left-0 top-16 bg-surface-container text-primary font-label-md text-label-md transition-all duration-200 ease-in-out">
<div className="p-4 mb-4">
<div className="font-title-lg text-title-lg text-on-surface flex items-center gap-3">
<img alt="AgriIntel Logo" className="w-8 h-8" data-alt="AgriIntel AI Logo showing a green leaf symbol, clean modern aesthetic." src="PLACEHOLDER"/>
                Farm Command
            </div>
<div className="text-on-surface-variant mt-1">Enterprise Tier</div>
</div>
<button className="mx-4 mb-6 bg-primary text-on-primary rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors">
<span className="material-symbols-outlined">add</span> New Analysis
        </button>
<nav className="flex-1 flex flex-col gap-1 px-2">
<a className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-xl p-3 hover:bg-surface-container-highest" href="#">
<span className="material-symbols-outlined fill-icon" data-icon="dashboard">dashboard</span> Overview
            </a>
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span> Analytics
            </a>
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="map">map</span> Yield Maps
            </a>
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="cloud_sync">cloud_sync</span> Weather AI
            </a>
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="mic">mic</span> Voice Assistant
            </a>
</nav>
<div className="mt-auto px-2 pb-24 flex flex-col gap-1 border-t border-outline-variant pt-4">
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span> Support
            </a>
<a className="flex items-center gap-3 text-on-surface-variant p-3 hover:bg-surface-container-highest rounded-xl" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span> Account
            </a>
</div>
</aside>
<!-- Main Content Canvas -->
<main className="lg:ml-72 pt-[88px] px-margin-mobile md:px-margin-desktop pb-gutter flex-1">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-container-max mx-auto">
<!-- Left Column (65%) -->
<div className="lg:col-span-8 flex flex-col gap-gutter">
<!-- Hero Card -->
<div className="relative rounded-2xl overflow-hidden h-[320px] shadow-sm border border-outline-variant bg-surface-container-low" data-alt="A wide, sweeping landscape photograph of lush, rolling green farmlands at golden hour sunrise. A modern green tractor is visible in the foreground, managing the healthy crop lines. The lighting is warm and inspiring, evoking high-tech, precision ecological stewardship." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJurDjbP20Hgiq_vxCZBWzXS5N03lcNcq9wic5bXohUNydqRNU3lv4wPATlef66rCMkpTg6kOdS1TPo96LmACl6ClOGPSCMe1oGhNa12I1z89ZSdfJweEl0ypOWEH2R0XGZE4VIGITKbrb0HX8sGWYKHf-BPeWzVthc8P1sq5Y1AbvErjhsH685DCe7DVFqb7tCn3aTJI2k8DdGPOEZbHvyyC6Q9VooK6tYI2_nSRuTUUzBww2OnQ679ZWScuvKNAZ2rZ3lSi6-jo'); background-size: cover; background-position: center;">
<div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/60 to-transparent"></div>
<div className="relative z-10 p-8 h-full flex flex-col justify-center max-w-md">
<h1 className="font-display-lg text-display-lg text-on-surface mb-4">
                            Smart Advice for <span className="text-primary">Stronger Harvests</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                            Voice-powered AI assistant for natural farming. Ask, learn and grow better – the natural way.
                        </p>
<div className="flex gap-4">
<button className="bg-primary text-on-primary px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
<span className="material-symbols-outlined">mic</span> Talk to AI
                            </button>
<button className="bg-surface text-primary border border-primary px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">upload</span> Upload Image
                            </button>
</div>
</div>
</div>
<!-- Crop Doctor Section -->
<section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
<h2 className="font-title-lg text-title-lg text-on-surface mb-6">Crop Doctor</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Upload Area -->
<div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-low text-center">
<span className="material-symbols-outlined text-4xl text-outline mb-2">add_a_photo</span>
<p className="font-title-lg text-title-lg text-on-surface mb-1">Upload or Capture</p>
<p className="font-body-md text-body-md text-on-surface-variant mb-4">Select a photo of the affected plant</p>
<button className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant">
<span className="material-symbols-outlined">camera_alt</span> Open Camera
                            </button>
</div>
<!-- Recent Diagnoses -->
<div className="flex flex-col gap-4">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recent Diagnoses</h3>
<div className="flex items-center gap-4 p-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
<img alt="Diseased leaf" className="w-16 h-16 rounded-lg object-cover" data-alt="A close-up macro photograph of a vibrant green tomato leaf infected with early blight. The leaf shows distinct circular, concentric brown spots characteristic of the fungal disease, set against a soft, out-of-focus light grey background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1iZhlTxtjODFbho4Lgl64BPao7YHU1j5jsg5nDiIPNI3tKEhW5HtmcG1RDuUhP55PK0P1bwTRt5eYDmS5I9DdNX7ZPrXqe1y_Ro5BMxVJptTcPbxgTJDz-JxzKGPW7-covoZ0tfcnrMBykZFdUqWJq4kN4QX1QQhLcv0YlMy1DUTCFkjnBrtgq3AEQoDsVvCYBAVSUVzTJbXAInQPjfzg0lV_F8unpozfbBqC_ZaBRDuqBykUgTSID_V63Nt0Ftp3K-313qnXlbI"/>
<div className="flex-1">
<h4 className="font-title-lg text-title-lg text-on-surface text-base">Tomato - Early Blight</h4>
<div className="flex gap-2 mt-1">
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-md text-[10px]">98% Confidence</span>
<span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-label-md text-[10px]">Treatment Available</span>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
</div>
</div>
</div>
</section>
</div>
<!-- Right Column (35%) -->
<div className="lg:col-span-4 flex flex-col gap-gutter">
<!-- Ask Assistant -->
<div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant flex flex-col items-center text-center">
<div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-4 animate-pulse shadow-md cursor-pointer hover:scale-105 transition-transform">
<span className="material-symbols-outlined text-5xl text-on-primary-container fill-icon">mic</span>
</div>
<h2 className="font-title-lg text-title-lg text-on-surface mb-2">Ask AI Assistant</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">Tap to speak or type your farming questions</p>
<div className="w-full flex flex-col gap-2">
<button className="bg-surface-container text-on-surface py-2 px-4 rounded-lg text-left text-sm hover:bg-surface-container-highest transition-colors flex justify-between items-center">
                            "Which crop should I grow?" <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
</button>
<button className="bg-surface-container text-on-surface py-2 px-4 rounded-lg text-left text-sm hover:bg-surface-container-highest transition-colors flex justify-between items-center">
                            "How to make jeevamrut?" <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
</button>
</div>
</div>
<!-- Weather Widget -->
<div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant">
<div className="flex justify-between items-start mb-4">
<div>
<h2 className="font-title-lg text-title-lg text-on-surface">Hisar, Haryana</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Partly Cloudy</p>
</div>
<span className="material-symbols-outlined text-4xl text-tertiary-fixed-dim fill-icon">partly_cloudy_day</span>
</div>
<div className="text-4xl font-display-lg text-on-surface mb-4">32°C</div>
<div className="flex gap-4 font-label-md text-label-md text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">humidity_percentage</span> 48%</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">air</span> 12 km/h</span>
</div>
</div>
</div>
</div>
</main>
<!-- Footer (Shared Component) -->
<footer className="w-full py-12 px-margin-desktop flex justify-between items-center mt-auto bg-secondary-fixed text-on-secondary-fixed font-body-md text-body-md mt-gutter">
<div className="flex items-center gap-4">
<span className="font-headline-md text-headline-md text-primary">AgriIntel AI</span>
<span>© 2024 AgriIntel Systems. Precision Stewardship.</span>
</div>
<div className="flex gap-6">
<a className="text-on-secondary-fixed-variant hover:underline" href="#">Privacy Policy</a>
<a className="text-on-secondary-fixed-variant hover:underline" href="#">Terms of Service</a>
<a className="text-on-secondary-fixed-variant hover:underline" href="#">API Status</a>
</div>
</footer>