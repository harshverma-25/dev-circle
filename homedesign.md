///this is i paste from the stitch you have to implement using optimize react and next js use and tailwind css.
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>DevCircle - Elite Developer Interview Platform</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Space+Grotesk:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary": "#002e6a",
                        "primary": "#adc6ff",
                        "background": "#131313",
                        "error-container": "#93000a",
                        "outline-variant": "#424754",
                        "surface-container-high": "#2a2a2a",
                        "primary-fixed": "#d8e2ff",
                        "error": "#ffb4ab",
                        "outline": "#8c909f",
                        "on-secondary-fixed": "#002113",
                        "surface-container": "#201f1f",
                        "on-tertiary-container": "#340080",
                        "surface-bright": "#393939",
                        "tertiary": "#d0bcff",
                        "on-primary-fixed-variant": "#004395",
                        "surface-container-low": "#1c1b1b",
                        "on-surface-variant": "#c2c6d6",
                        "on-error-container": "#ffdad6",
                        "on-surface": "#e5e2e1",
                        "surface-container-highest": "#353534",
                        "secondary-fixed": "#6ffbbe",
                        "secondary-fixed-dim": "#4edea3",
                        "on-error": "#690005",
                        "inverse-on-surface": "#313030",
                        "on-secondary-fixed-variant": "#005236",
                        "on-primary-fixed": "#001a42",
                        "tertiary-fixed-dim": "#d0bcff",
                        "on-tertiary-fixed-variant": "#5516be",
                        "surface": "#131313",
                        "tertiary-container": "#a078ff",
                        "secondary": "#4edea3",
                        "tertiary-fixed": "#e9ddff",
                        "on-primary-container": "#00285d",
                        "inverse-primary": "#005ac2",
                        "on-secondary-container": "#00311f",
                        "primary-container": "#4d8eff",
                        "surface-variant": "#353534",
                        "on-background": "#e5e2e1",
                        "surface-dim": "#131313",
                        "secondary-container": "#00a572",
                        "inverse-surface": "#e5e2e1",
                        "surface-tint": "#adc6ff",
                        "primary-fixed-dim": "#adc6ff",
                        "on-tertiary": "#3c0091",
                        "on-secondary": "#003824",
                        "surface-container-lowest": "#0e0e0e",
                        "on-tertiary-fixed": "#23005c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "xs": "4px",
                        "md": "16px",
                        "navbar_height": "64px",
                        "sidebar_width": "260px",
                        "xl": "40px",
                        "unit": "4px",
                        "sm": "8px",
                        "lg": "24px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "h1": ["Inter"],
                        "label-caps": ["Inter"],
                        "code": ["Space Grotesk"],
                        "body-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-lg": ["Inter"],
                        "h3": ["Inter"],
                        "h2": ["Inter"]
                    },
                    "fontSize": {
                        "h1": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "code": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "h3": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                        "h2": ["30px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}]
                    }
                }
            }
        }
    </script>
<style>
        .glass-panel {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .code-canvas {
            background: #0e0e0e;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .active-nav-border {
            border-right: 2px solid #adc6ff;
        }
        .pulse-glow {
            box-shadow: 0 0 15px rgba(78, 222, 163, 0.4);
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md overflow-x-hidden">
<!-- TopAppBar -->
<nav class="fixed top-0 w-full h-16 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6">
<div class="text-xl font-bold tracking-tight text-white font-h2">DevCircle</div>
<div class="flex items-center gap-lg">
<button class="text-zinc-400 font-inter text-body-sm hover:text-white transition-colors duration-200">Sign In</button>
</div>
</nav>
<!-- SideNavBar -->
<aside class="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] z-40 bg-[#121212]/95 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 space-y-2 hidden md:flex">
<div class="px-6 mb-8">
<div class="text-label-caps text-zinc-500 uppercase tracking-widest mb-xs">Navigation</div>
<div class="text-body-sm font-medium text-blue-500">Interview Platform</div>
</div>
<a class="flex items-center px-6 py-3 space-x-md text-blue-400 bg-blue-500/10 active-nav-border transition-all duration-200 group" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-inter text-sm font-medium">Home</span>
</a>
<a class="flex items-center px-6 py-3 space-x-md text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors group" href="#">
<span class="material-symbols-outlined">terminal</span>
<span class="font-inter text-sm font-medium">Interview</span>
</a>
<a class="flex items-center px-6 py-3 space-x-md text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors group" href="#">
<span class="material-symbols-outlined">description</span>
<span class="font-inter text-sm font-medium">Resume</span>
</a>
</aside>
<!-- Main Content Canvas -->
<main class="md:ml-[260px] pt-16 min-h-screen">
<!-- Hero Section -->
<section class="relative px-lg py-xl md:px-xl md:py-[80px] overflow-hidden">
<div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
<div class="max-w-4xl mx-auto text-center md:text-left">
<div class="inline-flex items-center px-sm py-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-lg">
<span class="material-symbols-outlined text-[18px] mr-xs">bolt</span>
<span class="text-label-caps uppercase">Live sessions now available</span>
</div>
<h1 class="font-h1 text-h1 text-white mb-lg">Master the Technical Interview Together.</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl leading-relaxed">
                    DevCircle helps developers practice real interviews together through live, peer-to-peer sessions.
                </p>
<div class="flex flex-col sm:flex-row gap-md">
<button class="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold text-body-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center">
                        Join a Session
                    </button>
<button class="bg-white/5 text-white border border-white/10 px-lg py-md rounded-lg font-semibold text-body-md hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                        Host an Interview
                    </button>
</div>
</div>
<!-- Visual Dashboard Preview -->
<div class="mt-xl relative mx-auto max-w-5xl group">
<div class="glass-panel rounded-xl p-md shadow-2xl relative overflow-hidden">
<div class="flex items-center justify-between border-b border-white/5 pb-md mb-md">
<div class="flex gap-xs">
<div class="w-3 h-3 rounded-full bg-error/40"></div>
<div class="w-3 h-3 rounded-full bg-tertiary-container/40"></div>
<div class="w-3 h-3 rounded-full bg-secondary/40"></div>
</div>
<div class="text-label-caps text-zinc-500">LIVE SESSION: SYSTEM DESIGN</div>
</div>
<div class="grid grid-cols-12 gap-lg h-[400px]">
<div class="col-span-8 code-canvas rounded-lg p-lg font-code text-body-sm relative">
<div class="text-secondary opacity-80 mb-sm">/* Peer Interview Collaboration */</div>
<div class="text-white">
<span class="text-tertiary">async function</span> <span class="text-primary">solveProblem</span>(candidate) {<br/>
                                  <span class="text-tertiary">const</span> session = <span class="text-tertiary">await</span> LiveSession.start();<br/>
                                  <span class="text-zinc-500">// Real-time feedback loop initiated</span><br/>
                                  <span class="text-tertiary">return</span> session.optimizePerformance();<br/>
                                }
                            </div>
<div class="absolute bottom-md right-md flex gap-sm">
<div class="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" data-alt="Avatar of developer collaborator in a minimalist technical UI style"></div>
<div class="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">JD</div>
</div>
</div>
<div class="col-span-4 space-y-md">
<div class="glass-panel rounded-lg p-md h-full">
<div class="text-label-caps text-zinc-400 mb-sm">INTERVIEWERS NOTES</div>
<div class="space-y-sm">
<div class="h-2 w-full bg-white/5 rounded"></div>
<div class="h-2 w-3/4 bg-white/5 rounded"></div>
<div class="h-2 w-5/6 bg-white/5 rounded"></div>
</div>
<div class="mt-xl">
<div class="flex justify-between text-body-sm mb-xs">
<span class="text-zinc-400">ATS Score</span>
<span class="text-secondary font-bold">84%</span>
</div>
<div class="w-full bg-white/10 h-1 rounded-full overflow-hidden">
<div class="bg-secondary h-full w-[84%]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Bento Features Grid -->
<section class="px-lg py-xl md:px-xl">
<div class="max-w-6xl mx-auto">
<h2 class="font-h2 text-h2 text-white mb-xl text-center">Engineered for Excellence.</h2>
<div class="grid grid-cols-1 md:grid-cols-12 gap-lg">
<!-- Feature 1: Live Interview System -->
<div class="md:col-span-7 glass-panel rounded-xl p-xl flex flex-col justify-between group hover:border-primary/30 transition-all duration-300">
<div>
<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-lg">
<span class="material-symbols-outlined text-[32px]">sensors</span>
</div>
<h3 class="font-h3 text-h3 text-white mb-md">Live Interview System</h3>
<p class="font-body-md text-on-surface-variant mb-lg leading-relaxed">
                                Experience high-fidelity coding sessions with low-latency syncing. Practice data structures, algorithms, and system design in a real-time environment built for collaboration.
                            </p>
</div>
<div class="relative h-40 mt-md bg-black/40 rounded-lg overflow-hidden border border-white/5">
<div class="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
<div class="p-md flex gap-md">
<div class="w-1/2 h-full bg-white/5 rounded-md flex flex-col justify-center items-center">
<div class="w-12 h-12 rounded-full border-2 border-secondary pulse-glow mb-sm overflow-hidden bg-zinc-800">
<img alt="" class="w-full h-full object-cover" data-alt="professional portrait of a young male software engineer in a modern workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMK2UOltgTx1qYKZJd_ge5ImBO-dux_-KKnFaxT0D-47Ks8zrSblIK1L1IT9YgyYrbWRRbPC4yebzav2WouOO_VoRM1VmAm848TACJgaXbdgQcF25MaT1oV6BEzOXZQYGxi5lAnOTIbHRKvb07vdSaS3PzB01eVxXZhIs7ZuQUy5KMHw9obIUCfiTeTYNRPyJJckiGY9-OjE_XGKEmngEXosAmCscEydPER_mSEkZAiMJrsTOWUj38YDXVTOE9taarL7Hzu7o8Yg"/>
</div>
<span class="text-xs font-medium text-secondary">Live</span>
</div>
<div class="w-1/2 h-full bg-white/5 rounded-md flex flex-col justify-center items-center">
<div class="w-12 h-12 rounded-full border-2 border-zinc-700 mb-sm overflow-hidden bg-zinc-800">
<img alt="" class="w-full h-full object-cover" data-alt="professional portrait of a confident female tech recruiter with blurred office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPhuZhXJ6jKCvfNmp8Ns5eoyO1fzLBIvvdK3PdUGhi2mR4sK9pRj4TidTF_EW50F5IM8DLanlV50ij1R7PDgkVL8z7tRnXoUq9QVCr4XgSv1AFgH2qBaDGKi9l5E-rvmV7N3aY1nAJjjS1D1umsWDIcSKuIXY1ntUB0Guivq6qeMZpQ9kk2CToz-Vd98WtuNN-WFmNdsfQWki0nd1wGFnSkTGFbRIgvbjtYFKWlC6Skzs5mOpe-hsK8c0d58CkLGkx9-1eU8LPMw"/>
</div>
<span class="text-xs font-medium text-zinc-500">Peer</span>
</div>
</div>
</div>
</div>
<!-- Feature 2: Resume Intelligence -->
<div class="md:col-span-5 glass-panel rounded-xl p-xl flex flex-col group hover:border-tertiary/30 transition-all duration-300">
<div class="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-lg">
<span class="material-symbols-outlined text-[32px]">psychology</span>
</div>
<h3 class="font-h3 text-h3 text-white mb-md">Resume Intelligence</h3>
<p class="font-body-md text-on-surface-variant mb-xl leading-relaxed">
                            AI-powered feedback and ATS score optimization tailored for FAANG and elite tech startups.
                        </p>
<div class="mt-auto space-y-md">
<div class="p-md bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-tertiary">check_circle</span>
<span class="text-body-sm font-medium">Keywords Optimized</span>
</div>
<span class="text-zinc-500 text-xs">+12</span>
</div>
<div class="p-md bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
<div class="flex items-center gap-sm">
<span class="material-symbols-outlined text-secondary">analytics</span>
<span class="text-body-sm font-medium">FAANG Match</span>
</div>
<span class="text-secondary text-xs">High</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Stats Section -->
<section class="px-lg py-xl border-t border-white/5">
<div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-xl text-center">
<div>
<div class="font-h2 text-h2 text-primary">50k+</div>
<div class="text-label-caps text-zinc-500 mt-xs">Sessions Completed</div>
</div>
<div>
<div class="font-h2 text-h2 text-secondary">92%</div>
<div class="text-label-caps text-zinc-500 mt-xs">Offer Success Rate</div>
</div>
<div>
<div class="font-h2 text-h2 text-tertiary">15k+</div>
<div class="text-label-caps text-zinc-500 mt-xs">Active Mentors</div>
</div>
<div>
<div class="font-h2 text-h2 text-white">200+</div>
<div class="text-label-caps text-zinc-500 mt-xs">Elite Companies</div>
</div>
</div>
</section>
<!-- Final CTA -->
<section class="px-lg py-[100px] text-center">
<div class="max-w-3xl mx-auto glass-panel p-xl rounded-2xl relative overflow-hidden">
<div class="absolute inset-0 bg-primary/5 -z-10"></div>
<h2 class="font-h2 text-h2 text-white mb-md">Ready to break into big tech?</h2>
<p class="font-body-lg text-on-surface-variant mb-xl">Join the most active developer interview community in the world.</p>
<div class="flex flex-col sm:flex-row gap-md justify-center">
<button class="bg-primary text-on-primary px-xl py-md rounded-lg font-bold hover:brightness-110 transition-all">
                        Get Started Free
                    </button>
<button class="bg-transparent text-white border border-white/20 px-xl py-md rounded-lg font-bold hover:bg-white/5 transition-all">
                        Browse Sessions
                    </button>
</div>
</div>
</section>
<!-- Footer -->
<footer class="px-lg py-xl border-t border-white/10 text-center md:text-left">
<div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-lg">
<div>
<div class="text-xl font-bold text-white mb-xs font-h2">DevCircle</div>
<p class="text-body-sm text-zinc-500">© 2024 DevCircle Interview Platform. All rights reserved.</p>
</div>
<div class="flex gap-lg text-body-sm text-zinc-400">
<a class="hover:text-primary transition-colors" href="#">Privacy</a>
<a class="hover:text-primary transition-colors" href="#">Terms</a>
<a class="hover:text-primary transition-colors" href="#">Contact</a>
</div>
</div>
</footer>
</main>
</body></html>