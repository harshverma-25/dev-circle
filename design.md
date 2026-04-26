<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&amp;family=Space+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "inverse-surface": "#e5e2e1",
                    "on-tertiary": "#3c0091",
                    "primary-fixed-dim": "#adc6ff",
                    "surface-tint": "#adc6ff",
                    "surface-container-lowest": "#0e0e0e",
                    "on-secondary": "#003824",
                    "on-tertiary-fixed": "#23005c",
                    "primary-container": "#4d8eff",
                    "on-secondary-container": "#00311f",
                    "on-background": "#e5e2e1",
                    "surface-variant": "#353534",
                    "surface-dim": "#131313",
                    "secondary-container": "#00a572",
                    "tertiary-container": "#a078ff",
                    "secondary": "#4edea3",
                    "tertiary-fixed": "#e9ddff",
                    "inverse-primary": "#005ac2",
                    "on-primary-container": "#00285d",
                    "on-error": "#690005",
                    "inverse-on-surface": "#313030",
                    "secondary-fixed-dim": "#4edea3",
                    "on-secondary-fixed-variant": "#005236",
                    "on-primary-fixed": "#001a42",
                    "surface": "#131313",
                    "tertiary-fixed-dim": "#d0bcff",
                    "on-tertiary-fixed-variant": "#5516be",
                    "surface-container-highest": "#353534",
                    "on-surface": "#e5e2e1",
                    "secondary-fixed": "#6ffbbe",
                    "surface-bright": "#393939",
                    "tertiary": "#d0bcff",
                    "on-primary-fixed-variant": "#004395",
                    "on-error-container": "#ffdad6",
                    "surface-container-low": "#1c1b1b",
                    "on-surface-variant": "#c2c6d6",
                    "primary-fixed": "#d8e2ff",
                    "surface-container-high": "#2a2a2a",
                    "outline": "#8c909f",
                    "on-secondary-fixed": "#002113",
                    "error": "#ffb4ab",
                    "surface-container": "#201f1f",
                    "on-tertiary-container": "#340080",
                    "primary": "#adc6ff",
                    "background": "#131313",
                    "on-primary": "#002e6a",
                    "outline-variant": "#424754",
                    "error-container": "#93000a"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "md": "16px",
                    "xs": "4px",
                    "sidebar_width": "260px",
                    "navbar_height": "64px",
                    "xl": "40px",
                    "unit": "4px",
                    "gutter": "24px",
                    "sm": "8px",
                    "lg": "24px"
            },
            "fontFamily": {
                    "h1": ["Inter"],
                    "code": ["Space Grotesk"],
                    "label-caps": ["Inter"],
                    "body-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "body-sm": ["Inter"],
                    "h3": ["Inter"],
                    "h2": ["Inter"]
            },
            "fontSize": {
                    "h1": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "code": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
                    "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                    "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                    "h3": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                    "h2": ["30px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        .glass-panel {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-navbar {
            background: rgba(18, 18, 18, 0.8);
            backdrop-filter: blur(12px);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full h-16 z-50 border-b border-white/10 bg-[#121212]/80 backdrop-blur-lg flex items-center justify-between px-6 w-full font-['Inter'] tracking-tight">
<div class="flex items-center gap-8">
<span class="text-lg font-bold tracking-tighter text-white uppercase flex items-center gap-2" style="">
<span class="material-symbols-outlined text-primary" data-icon="group_work" style="">group_work</span>
    DevCircle
</span>
<div class="relative hidden md:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" data-icon="search" style="">search</span>
<input class="bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-64 transition-all" placeholder="Find a session..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="text-zinc-400 font-medium hover:bg-white/5 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg active:scale-95 duration-100" style="">Sign In</button>
<button class="bg-primary text-on-primary font-semibold px-5 py-2 rounded-lg active:scale-95 duration-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" style="">Host Session</button>
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-white/10">
<img alt="Developer Profile" class="w-full h-full object-cover" data-alt="close-up portrait of a professional developer in a dimly lit tech workspace, soft blue ambient light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPaIRwUjQAHrddkJ7gsG_hN-StXZLX01x5B9yW0uKgoEyFyy_wPyPszFN3fOkYHJfG4uUA1ruBXEe-ydRYaD-aE64K1YkohO5osoMkcR3dww5OVW_NasZyBtOxmS89UaBoWaD6gq4HKisI_Hxj9_yMrEszVRI__CfrJmy7xmHidPTXF2oTYgfYOZ8MCdQkow5U0xIIZ5gCR_QiA-ZnAxRYqsHl6snXgV6m9Z_bmhxDG6qV51Mc6YD04DpzTUFyqtC3m7pgTZF8NA" style=""/>
</div>
</div>
</nav>
<!-- SideNavBar -->
<aside class="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] border-r border-white/5 bg-[#121212]/90 backdrop-blur-xl flex flex-col gap-2 py-6 font-['Inter'] text-sm z-40">
<div class="px-6 mb-8">
<div class="flex items-center gap-3">
<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary text-xl" data-icon="groups" style="">groups</span>
</div>
<div>
<h3 class="text-white font-black leading-tight" style="">DevCircle</h3>
<p class="text-zinc-500 text-[10px] uppercase tracking-widest" style="">Community Hub</p>
</div>
</div>
</div>
<nav class="flex-1 px-2 space-y-1">
<!-- Active Tab -->
<a class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-500 flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/10 transition-colors" href="#" style="">
<span class="material-symbols-outlined" data-icon="grid_view" style="">grid_view</span>
<span class="font-semibold" style="">Home</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors cursor-pointer active:bg-white/10" href="#" style="">
<span class="material-symbols-outlined" data-icon="code" style="">code</span>
<span class="font-medium" style="">Interview</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors cursor-pointer active:bg-white/10" href="#" style="">
<span class="material-symbols-outlined" data-icon="description" style="">description</span>
<span class="font-medium" style="">Resume</span>
</a>
</nav>
<div class="mt-auto px-2 space-y-1 border-t border-white/5 pt-4">
<a class="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors cursor-pointer active:bg-white/10" href="#" style="">
<span class="material-symbols-outlined" data-icon="settings" style="">settings</span>
<span class="font-medium" style="">Settings</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors cursor-pointer active:bg-white/10" href="#" style="">
<span class="material-symbols-outlined" data-icon="help_outline" style="">help_outline</span>
<span class="font-medium" style="">Support</span>
</a>
</div>
</aside>
<!-- Main Content -->
<main class="ml-[260px] mt-16 p-xl min-h-screen">
<div class="max-w-7xl mx-auto space-y-xl">
<!-- Hero Section -->
<section class="relative h-[480px] rounded-3xl overflow-hidden flex items-center px-xl">
<div class="absolute inset-0 z-0">
<img alt="Tech Background" class="w-full h-full object-cover opacity-40 grayscale" data-alt="abstract digital matrix with neon blue lines and geometric data patterns on a dark background, cinematic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvrouNFjlULhTYC8pAmAS1fGcLn9vcjV5k442BfB12qWftdcugQqYX8SES-Y9ziQQ10lLPvqNBVjk8EK2aMXjaOdV_Lnuto_mIRBN_ULQh967_NclNAomgPqPwTq0NXXpfHs1pSowWX0ldAG_6mIXuM8If6SqXdmXnofnRBXd7faykrHMmc1E1uQlKm6Vgri7M9QmOXvroQiq3mtCP1rMy4HZWKURQx_z1la89YlzflRmY1FoczusWCLtS9cCdfUGOxPolXreTFw" style=""/>
<div class="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
</div>
<div class="relative z-10 max-w-2xl">
<span class="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-caps text-label-caps mb-6" style="">COLLABORATIVE PREP</span>
<h1 class="font-h1 text-h1 text-white mb-6" style="">Practice Together. <br/><span class="text-primary" style="">Grow Together.</span></h1>
<p class="font-body-lg text-body-lg text-zinc-400 mb-8 max-w-lg" style="">
                        DevCircle helps developers practice real interviews together through live, peer-to-peer sessions. Host, join, and learn in a continuous community loop.
                    </p>
<div class="flex gap-4">
<button class="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_40px_rgba(173,198,255,0.2)]" style="">Join a Session</button>
<button class="glass-panel text-white border border-white/10 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 active:scale-95 transition-all" style="">Host an Interview</button>
</div>
</div>
</section>
<!-- Feature Bento Grid -->
<section class="grid grid-cols-12 gap-lg">
<!-- Main Feature: Live Interview System -->
<div class="col-span-12 lg:col-span-7 glass-panel rounded-3xl p-lg flex flex-col justify-between group hover:border-primary/30 transition-all">
<div>
<div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 border border-secondary/20">
<span class="material-symbols-outlined text-secondary" data-icon="stadium" style="">stadium</span>
</div>
<h2 class="font-h2 text-h2 text-white mb-4" style="">Live Interview System</h2>
<p class="font-body-md text-body-md text-zinc-400 mb-8 max-w-md" style="">
                            Robust collaborative coding environment with integrated video, shared whiteboards, and real-time execution. Designed to mimic top-tier technical interview tools.
                        </p>
</div>
<div class="flex items-center justify-between">
<div class="flex -space-x-3">
<img alt="Developer 1" class="w-10 h-10 rounded-full border-2 border-surface-container" data-alt="professional portrait of a senior software engineer with glasses, soft warm lighting, studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvtpbKgGBLR70Zz5k_MHvOTjwfNN3Ao0HgkJuS7kFlcZhrBZc5CevJu5rCdVlERnNq_7h_9_tAafcWvF5g812nhG0B2hCzEwkXK_ZEvziHkFHlx16zRics_Sp8RSHOk1VlY4PF6SAIxpZc_vzdBRTOJ31mlhHJUI9fZp-D6fJhG-3700n4PMi0VdTICHu53S_y2tpRGcLrQ-SM2fbDTs9If0iypqhBwQWR1yB8WX3RCaol_LXmO8Kycyza39sgxxFreieUFmKnCQ" style=""/>
<img alt="Developer 2" class="w-10 h-10 rounded-full border-2 border-surface-container" data-alt="portrait of a woman developer smiling, wearing a modern headset, professional tech environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdWw9LOd6jsvgxOF0VRjpc-lNtevgkttLAYb-4z0VmhVbYckg8maZC0ZeFjan87zAxkWXk19KHpXd8vuO9yOjktybB10XBjQVTBL98orKq2dFxJn2eScYHz2jEcdV6G9ec0naypkrN9Ten4Rr_BKnIkEPYM-USd3bnQpuy3gBQxqFaaVA5aEJW8Cr34pBXgFxUDm7fdGxyZlLpoi2_qZM3zcGCeg2GNIvKqxkFvVhCAmffrOAT57-_wpmW3uNJIgQjeWwm7fXcvA" style=""/>
<img alt="Developer 3" class="w-10 h-10 rounded-full border-2 border-surface-container" data-alt="mid-shot of a smiling technical lead in a modern office with glass walls, natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMODCUnHCZexWgzbvVrp4GlmcRk7J8YLAOSoELTlBTDp78JWe7FMLsY4AdhCH3dRtJqsOIGYUTiOQ8hTHuxlqza_zdIfkV_ho3_5g3ABqcFe5jfEvaRxaW6rZlagt1Yj1-OvKbV870RBC7J5gEAOMGYv_OaYlV-HK6J4oZE3CKqOYJzmVUkOEsb6f0IQcu_wQdI935EmdWBIzWrRkBlvqD4-dtomlYvQ896Uf3xnJp061zjRwMszONGGCJm7o0qZNqN4jgIdQdZQ" style=""/>
<div class="w-10 h-10 rounded-full bg-zinc-800 border-2 border-surface-container flex items-center justify-center text-xs font-bold" style="">+241</div>
</div>
<a class="text-primary flex items-center gap-2 font-semibold group-hover:gap-3 transition-all" href="#" style="">
                            View Live Lobby <span class="material-symbols-outlined" data-icon="arrow_forward" style="">arrow_forward</span>
</a>
</div>
</div>
<!-- Secondary Feature: Open Participation -->
<div class="col-span-12 lg:col-span-5 glass-panel rounded-3xl p-lg flex flex-col group hover:border-primary/30 transition-all">
<div class="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6 border border-tertiary/20">
<span class="material-symbols-outlined text-tertiary" data-icon="all_inclusive" style="">all_inclusive</span>
</div>
<h2 class="font-h2 text-h2 text-white mb-4" style="">Open Participation</h2>
<p class="font-body-md text-body-md text-zinc-400 mb-6" style="">
                        No restricted roles. Everyone can host, interview, and give feedback. Build your reputation and unlock advanced community features.
                    </p>
<div class="mt-auto bg-surface-container-low rounded-2xl p-4 border border-white/5 space-y-3">
<div class="flex justify-between items-center text-xs">
<span class="text-zinc-500" style="">Community Trust Score</span>
<span class="text-secondary font-bold" style="">Expert</span>
</div>
<div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
<div class="h-full bg-secondary w-[88%]"></div>
</div>
<p class="text-[10px] text-zinc-500 italic" style="">"Highly rated for clear system design explanations."</p>
</div>
</div>
<!-- Small Cards -->
<div class="col-span-12 md:col-span-4 glass-panel rounded-3xl p-md border-white/5">
<h3 class="font-h3 text-zinc-200 mb-2" style="">Smart Access</h3>
<p class="text-zinc-500 font-body-sm text-body-sm" style="">Granular control over who can join your practice rooms and view your loop history.</p>
</div>
<div class="col-span-12 md:col-span-4 glass-panel rounded-3xl p-md border-white/5">
<h3 class="font-h3 text-zinc-200 mb-2" style="">The Loop</h3>
<p class="text-zinc-500 font-body-sm text-body-sm" style="">A data-driven feedback cycle where you learn from being both the interviewer and interviewee.</p>
</div>
<div class="col-span-12 md:col-span-4 glass-panel rounded-3xl p-md border-white/5">
<h3 class="font-h3 text-zinc-200 mb-2" style="">Shared Library</h3>
<p class="text-zinc-500 font-body-sm text-body-sm" style="">Access a community-vetted database of real interview questions from top tech companies.</p>
</div>
</section>
<!-- About Section / Trust Markers -->
<section class="py-xl">
<div class="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
<div>
<img alt="DevCircle Collaborative View" class="rounded-3xl border border-white/10 shadow-2xl" data-alt="split-screen aesthetic showing a sleek code editor on one side and a professional video call on the other, high-end developer workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS1EFUvKDYjnWLYYFV1DQVsKmkeUKAF6P4XFTHqn4su5rBp9Qinpt2AifRAsV9eHZTJ5RyOj1gl-lRRh1JeH6Nq0uSORO2Byt5Zs-QcHhKjp_Jhy81C9oMyie0HxD7C3sRBeUJ5Dw3I-lBFoD_K396z5Wi23wFj2wBx2GKbmWcWFTumV9uv_0qHie-RxznmHJODbvn2nOpJrSDioO150DjPRiayViRoZyESjFSIOLIvLDDQQnHLqe6OPFpWIeBicbuk0mPLzL-HA" style=""/>
</div>
<div class="space-y-6">
<h2 class="font-h2 text-h2 text-white" style="">Why DevCircle?</h2>
<p class="font-body-md text-body-md text-zinc-400" style="">
                            Traditional interview platforms focus on solo grinding. DevCircle recognizes that interviewing is a social skill. We provide the infrastructure for developers to help each other succeed.
                        </p>
<ul class="space-y-4">
<li class="flex items-start gap-3" style="">
<span class="material-symbols-outlined text-primary mt-1" data-icon="check_circle" style="">check_circle</span>
<div>
<h4 class="text-white font-semibold" style="">Peer-to-Peer Focus</h4>
<p class="text-zinc-500 text-sm" style="">Real-time sessions with peers who are also in the interview trenches.</p>
</div>
</li>
<li class="flex items-start gap-3" style="">
<span class="material-symbols-outlined text-primary mt-1" data-icon="check_circle" style="">check_circle</span>
<div>
<h4 class="text-white font-semibold" style="">Community Learning Loop</h4>
<p class="text-zinc-500 text-sm" style="">Gain unique insights by switching roles and seeing how others solve problems.</p>
</div>
</li>
<li class="flex items-start gap-3" style="">
<span class="material-symbols-outlined text-primary mt-1" data-icon="check_circle" style="">check_circle</span>
<div>
<h4 class="text-white font-semibold" style="">Reputation Economy</h4>
<p class="text-zinc-500 text-sm" style="">Get recognized for your technical insight and helpfulness within the circle.</p>
</div>
</li>
</ul>
</div>
</div>
</section>
</div>
</main>
<!-- Contextual FAB (Primary action for community app) -->
<button class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group" style="">
<span class="material-symbols-outlined group-hover:rotate-90 transition-transform" data-icon="add" style="">add</span>
</button>
</body></html>





// --------------------------------------------------------------------------------

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Space+Grotesk:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-highest": "#353534",
                        "on-surface-variant": "#c2c6d6",
                        "inverse-primary": "#005ac2",
                        "on-secondary-container": "#00311f",
                        "surface-variant": "#353534",
                        "on-primary-fixed": "#001a42",
                        "primary-container": "#4d8eff",
                        "inverse-surface": "#e5e2e1",
                        "on-tertiary-container": "#340080",
                        "on-secondary": "#003824",
                        "on-primary-container": "#00285d",
                        "surface-dim": "#131313",
                        "tertiary-container": "#a078ff",
                        "outline-variant": "#424754",
                        "on-tertiary-fixed": "#23005c",
                        "on-surface": "#e5e2e1",
                        "surface-bright": "#393939",
                        "primary": "#adc6ff",
                        "tertiary-fixed": "#e9ddff",
                        "primary-fixed": "#d8e2ff",
                        "error": "#ffb4ab",
                        "surface": "#131313",
                        "surface-container-high": "#2a2a2a",
                        "tertiary": "#d0bcff",
                        "on-tertiary": "#3c0091",
                        "surface-container": "#201f1f",
                        "on-background": "#e5e2e1",
                        "error-container": "#93000a",
                        "inverse-on-surface": "#313030",
                        "on-primary": "#002e6a",
                        "surface-container-lowest": "#0e0e0e",
                        "surface-container-low": "#1c1b1b",
                        "secondary": "#4edea3",
                        "on-tertiary-fixed-variant": "#5516be",
                        "on-secondary-fixed-variant": "#005236",
                        "on-primary-fixed-variant": "#004395",
                        "on-error": "#690005",
                        "secondary-container": "#00a572",
                        "secondary-fixed": "#6ffbbe",
                        "background": "#131313",
                        "surface-tint": "#adc6ff",
                        "primary-fixed-dim": "#adc6ff",
                        "outline": "#8c909f",
                        "on-secondary-fixed": "#002113",
                        "on-error-container": "#ffdad6",
                        "tertiary-fixed-dim": "#d0bcff",
                        "secondary-fixed-dim": "#4edea3"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "xs": "4px",
                        "unit": "4px",
                        "xl": "40px",
                        "sidebar_width": "260px",
                        "navbar_height": "64px",
                        "md": "16px",
                        "lg": "24px",
                        "sm": "8px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "h3": ["Inter"],
                        "h2": ["Inter"],
                        "body-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "code": ["Space Grotesk"],
                        "body-lg": ["Inter"],
                        "h1": ["Inter"],
                        "label-caps": ["Inter"]
                    },
                    "fontSize": {
                        "h3": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                        "h2": ["30px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "code": ["14px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "h1": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
<style>
        .glass-panel {
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sidebar-glass {
            background: rgba(9, 9, 11, 0.9);
            backdrop-filter: blur(12px);
        }
        .nav-glass {
            background: rgba(9, 9, 11, 0.8);
            backdrop-filter: blur(16px);
        }
        .resume-preview-shadow {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body class="bg-surface-dim text-on-surface font-body-md antialiased min-h-screen">
<!-- TopNavBar -->
<header class="fixed top-0 w-full h-16 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 font-inter antialiased text-sm">
<div class="flex items-center gap-4">
<span class="text-xl font-black tracking-tighter text-white">DevCircle</span>
<div class="hidden md:flex ml-8 items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
<span class="material-symbols-outlined text-zinc-400 mr-2" style="font-size: 18px;">search</span>
<input class="bg-transparent border-none focus:ring-0 text-sm w-64 text-zinc-300" placeholder="Search talents..." type="text"/>
</div>
</div>
<div class="flex items-center gap-3">
<button class="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200">
<span class="material-symbols-outlined text-zinc-400">notifications</span>
</button>
<button class="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200">
<span class="material-symbols-outlined text-zinc-400">settings</span>
</button>
<div class="h-8 w-8 rounded-full overflow-hidden border border-white/20">
<img alt="User profile avatar" data-alt="close-up portrait of a professional male designer with a modern haircut and clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFVlPiVy6-_TuKozpTyXxTfO_2j3Ixe7jQCGo15IYWdspfAw5IyqQciU5tZ2vtWNHzc5TADCaQTBlw4uNYzUr43x4pzwYINaMLeVT-124Ine86R6FohlZSiZ9Cm1nh7woOSeMBH9BvIt2YurPWaePTq7pR5fzmLXAMAa__YAmaL-TrWpKftDMKcEk_LfRqnok8OxNpsp76JnIlOTi8Z8A4__Vvb3PqGpwhOV3nB7f135l-b4Sn8A9835oYNJLed6osEP2qk9Aepw"/>
</div>
</div>
</header>
<!-- SideNavBar -->
<aside class="fixed left-0 top-16 h-[calc(100vh-64px)] w-[260px] bg-zinc-950/90 backdrop-blur-lg border-r border-white/5 flex flex-col p-4 gap-y-2 font-inter text-sm font-medium">
<div class="mb-6 px-2">
<h3 class="text-lg font-bold text-white leading-tight">DevCircle</h3>
<p class="text-[10px] text-zinc-500 uppercase tracking-widest">Elite Talent Platform</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">home</span>
                Home
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">video_chat</span>
                Interview
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 bg-blue-500/10 text-blue-400 border-r-2 border-blue-500 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">description</span>
                Resume
            </a>
</nav>
<div class="mt-auto space-y-1 border-t border-white/5 pt-4">
<a class="flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">help</span>
                Help Center
            </a>
<a class="flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-200 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">logout</span>
                Log Out
            </a>
</div>
</aside>
<!-- Main Content -->
<main class="ml-[260px] mt-16 p-xl">
<div class="max-w-7xl mx-auto">
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-lg">
<div>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 uppercase tracking-wider">
                        AI Powered
                    </span>
<h1 class="font-h1 text-h1 text-on-surface">Resume Intelligence</h1>
<p class="mt-4 text-on-surface-variant max-w-2xl font-body-lg text-body-lg">
                        Optimize your professional identity with high-performance templates and AI-driven ATS score optimization tailored for elite engineering roles.
                    </p>
</div>
<div class="flex gap-4">
<button class="px-6 py-3 bg-zinc-950 border border-white/10 text-on-surface hover:bg-white/5 rounded-xl transition-all font-semibold flex items-center gap-2">
<span class="material-symbols-outlined">upload_file</span>
                        Import PDF
                    </button>
<button class="px-6 py-3 bg-primary-container text-on-primary-container rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all flex items-center gap-2">
<span class="material-symbols-outlined">auto_awesome</span>
                        Generate New
                    </button>
</div>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-12 gap-lg">
<!-- Builder Controls Card -->
<div class="col-span-12 lg:col-span-4 flex flex-col gap-lg">
<div class="glass-panel rounded-xl p-md">
<h3 class="font-h3 text-h3 mb-md flex items-center gap-2">
<span class="material-symbols-outlined text-blue-400">tune</span>
                            Editor
                        </h3>
<div class="space-y-4">
<div>
<label class="text-label-caps font-label-caps text-on-surface-variant block mb-2">TARGET ROLE</label>
<select class="w-full bg-surface-container-low border border-white/10 rounded-lg text-sm text-on-surface focus:ring-primary focus:border-primary">
<option>Senior Fullstack Engineer</option>
<option>DevOps Lead</option>
<option>Data Architect</option>
</select>
</div>
<div>
<label class="text-label-caps font-label-caps text-on-surface-variant block mb-2">EXPERIENCE LEVEL</label>
<div class="grid grid-cols-3 gap-2">
<button class="py-2 text-xs bg-primary-container text-on-primary-container rounded-lg border border-primary/20">Senior</button>
<button class="py-2 text-xs bg-surface-container-low text-on-surface-variant rounded-lg border border-white/5 hover:border-white/20 transition-all">Mid</button>
<button class="py-2 text-xs bg-surface-container-low text-on-surface-variant rounded-lg border border-white/5 hover:border-white/20 transition-all">Lead</button>
</div>
</div>
<div class="pt-4 border-t border-white/5">
<label class="text-label-caps font-label-caps text-on-surface-variant block mb-2">CORE SKILLS</label>
<div class="flex flex-wrap gap-2">
<span class="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-xs">Rust</span>
<span class="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-xs">React</span>
<span class="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-xs">Kubernetes</span>
<span class="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-1 rounded text-xs">AWS</span>
<button class="text-zinc-500 hover:text-white transition-colors">
<span class="material-symbols-outlined" style="font-size: 16px;">add_circle</span>
</button>
</div>
</div>
</div>
</div>
<div class="glass-panel rounded-xl p-md bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
<div class="flex items-center justify-between mb-4">
<h3 class="font-h3 text-h3 flex items-center gap-2">
<span class="material-symbols-outlined text-secondary">analytics</span>
                                Score
                            </h3>
<span class="text-h2 font-h2 text-secondary">94</span>
</div>
<p class="text-body-sm text-on-surface-variant mb-4">Your resume is highly optimized for "Senior Fullstack Engineer" roles at Tier-1 tech companies.</p>
<div class="w-full bg-white/10 rounded-full h-1.5">
<div class="bg-secondary h-1.5 rounded-full" style="width: 94%"></div>
</div>
</div>
</div>
<!-- Resume Canvas (Preview) -->
<div class="col-span-12 lg:col-span-8">
<div class="glass-panel rounded-xl p-md overflow-hidden min-h-[800px] relative">
<div class="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none"></div>
<div class="flex items-center justify-between mb-md">
<div class="flex gap-2">
<div class="h-3 w-3 rounded-full bg-red-500/50"></div>
<div class="h-3 w-3 rounded-full bg-yellow-500/50"></div>
<div class="h-3 w-3 rounded-full bg-green-500/50"></div>
</div>
<div class="text-xs text-on-surface-variant font-code">Live Preview: Elite_Tech_Template.v3</div>
</div>
<!-- Professional Resume Content Area -->
<div class="bg-white text-zinc-900 rounded-lg p-xl min-h-[1000px] resume-preview-shadow font-inter">
<div class="flex justify-between items-start border-b-4 border-zinc-900 pb-lg mb-lg">
<div>
<h2 class="text-3xl font-black tracking-tight text-zinc-900">ALEXANDER CHEN</h2>
<p class="text-blue-600 font-bold tracking-widest text-sm uppercase mt-1">Senior Fullstack Engineer</p>
</div>
<div class="text-right text-xs text-zinc-500 leading-relaxed">
<p>San Francisco, CA</p>
<p>alex.chen@devcircle.io</p>
<p>linkedin.com/in/alexchen</p>
<p>github.com/alexchen-dev</p>
</div>
</div>
<div class="grid grid-cols-12 gap-lg">
<div class="col-span-4 border-r border-zinc-100 pr-lg">
<h4 class="text-xs font-black uppercase text-zinc-400 tracking-widest mb-4">Technical Stack</h4>
<div class="space-y-4">
<div>
<p class="text-[10px] font-bold text-zinc-400 mb-1">LANGUAGES</p>
<p class="text-sm font-medium">TypeScript, Rust, Go, Python, SQL</p>
</div>
<div>
<p class="text-[10px] font-bold text-zinc-400 mb-1">FRONTEND</p>
<p class="text-sm font-medium">React, Next.js, Tailwind, WebGL</p>
</div>
<div>
<p class="text-[10px] font-bold text-zinc-400 mb-1">BACKEND</p>
<p class="text-sm font-medium">Node.js, PostgreSQL, Redis, gRPC</p>
</div>
<div>
<p class="text-[10px] font-bold text-zinc-400 mb-1">INFRA</p>
<p class="text-sm font-medium">Docker, K8s, AWS, Terraform</p>
</div>
</div>
<h4 class="text-xs font-black uppercase text-zinc-400 tracking-widest mt-lg mb-4">Education</h4>
<div class="space-y-4">
<div>
<p class="text-sm font-bold">Stanford University</p>
<p class="text-xs text-zinc-500 italic">M.S. Computer Science</p>
</div>
</div>
</div>
<div class="col-span-8">
<h4 class="text-xs font-black uppercase text-zinc-400 tracking-widest mb-4">Professional Experience</h4>
<div class="space-y-lg">
<div>
<div class="flex justify-between items-baseline">
<p class="text-sm font-black">Meta Platforms, Inc.</p>
<p class="text-[10px] text-zinc-400 font-bold">2021 — PRESENT</p>
</div>
<p class="text-xs font-bold text-blue-600 mb-2">Senior Product Engineer</p>
<ul class="text-xs text-zinc-600 space-y-2 list-disc pl-4 leading-relaxed">
<li>Architected high-scale microservices serving 100M+ DAU using Go and gRPC, reducing latency by 40%.</li>
<li>Led the migration of legacy feed services to a distributed graph database architecture.</li>
<li>Mentored a team of 12 junior developers and established CI/CD best practices.</li>
</ul>
</div>
<div>
<div class="flex justify-between items-baseline">
<p class="text-sm font-black">Stripe</p>
<p class="text-[10px] text-zinc-400 font-bold">2018 — 2021</p>
</div>
<p class="text-xs font-bold text-blue-600 mb-2">Software Engineer L4</p>
<ul class="text-xs text-zinc-600 space-y-2 list-disc pl-4 leading-relaxed">
<li>Developed core payment processing SDKs utilized by 500k+ global businesses.</li>
<li>Implemented fraud detection algorithms that reduced unauthorized transactions by 15%.</li>
</ul>
</div>
<div>
<div class="flex justify-between items-baseline">
<p class="text-sm font-black">Airbnb</p>
<p class="text-[10px] text-zinc-400 font-bold">2016 — 2018</p>
</div>
<p class="text-xs font-bold text-blue-600 mb-2">Full Stack Engineer</p>
<ul class="text-xs text-zinc-600 space-y-2 list-disc pl-4 leading-relaxed">
<li>Optimized search ranking infrastructure using ElasticSearch and Ruby on Rails.</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Footer Stats -->
<div class="mt-xl grid grid-cols-1 md:grid-cols-4 gap-lg">
<div class="glass-panel p-md rounded-xl text-center">
<p class="text-label-caps font-label-caps text-on-surface-variant mb-2">REACHED HIRING MANAGERS</p>
<p class="text-h3 font-h3 text-white">2.4k</p>
</div>
<div class="glass-panel p-md rounded-xl text-center">
<p class="text-label-caps font-label-caps text-on-surface-variant mb-2">INTERVIEW INVITES</p>
<p class="text-h3 font-h3 text-secondary">42</p>
</div>
<div class="glass-panel p-md rounded-xl text-center">
<p class="text-label-caps font-label-caps text-on-surface-variant mb-2">AVERAGE SALARY INCREASE</p>
<p class="text-h3 font-h3 text-blue-400">28%</p>
</div>
<div class="glass-panel p-md rounded-xl text-center">
<p class="text-label-caps font-label-caps text-on-surface-variant mb-2">ATS SUCCESS RATE</p>
<p class="text-h3 font-h3 text-white">99.2%</p>
</div>
</div>
</div>
</main>
</body></html>