// Raw meme content (captions + metadata). Consumed by:
//  1. scripts/generate-memes.mjs -> rasterizes each entry into a real
//     WebP image under public/images/memes/
//  2. src/data/memes.ts -> builds the typed Meme[] used by the app
//
// Keeping this as plain data (not hand-drawn/scraped images) means every
// meme image on the site is original, procedurally generated artwork —
// no copyright risk.

/** @typedef {{
 *  id: string, slug: string, title: string, caption: string,
 *  description: string, category: string, tags: string[],
 *  festival?: string, funnyImage?: boolean, featured?: boolean,
 *  createdAt: string, likes: number, shares: number, downloads: number, views: number,
 * }} MemeSourceEntry
 */

/** @type {MemeSourceEntry[]} */
export const memeSource = [
  // ---------- Animal Memes ----------
  {
    id: "m001", slug: "cat-monday-mood", title: "Cat's Monday Mood",
    caption: "Monday ko office jaate waqt\nmeri bhi yahi feeling hoti hai",
    description: "Har Monday subah office ke liye nikalte waqt ka exact mood — is cat se zyada relatable kuch nahi.",
    category: "animal", tags: ["monday", "office", "mood", "cat"], funnyImage: true,
    createdAt: "2026-01-05", likes: 812, shares: 240, downloads: 190, views: 5200,
  },
  {
    id: "m002", slug: "dog-vs-diet", title: "Dog vs Diet Plan",
    caption: "Mera diet plan bhi utna hi\nsteady hai jitna is dog ka self-control",
    description: "Diet start karne ka determination aur usse todne ki speed — dono ek saath.",
    category: "animal", tags: ["diet", "fitness", "dog"], funnyImage: true,
    createdAt: "2026-01-12", likes: 654, shares: 180, downloads: 140, views: 4100,
  },
  {
    id: "m003", slug: "parrot-gossip", title: "Parrot Breaking News",
    caption: "Mohalle ki khabar sabse pehle\nis tote ko milti hai",
    description: "Neighbourhood gossip network ka sabse fast reporter.",
    category: "animal", tags: ["gossip", "neighbourhood", "parrot"],
    createdAt: "2026-01-18", likes: 401, shares: 96, downloads: 60, views: 2600,
  },
  {
    id: "m004", slug: "buffalo-relax-mode", title: "Buffalo Relax Mode",
    caption: "Weekend pe mera energy level\nexactly is level pe hota hai",
    description: "Saturday dopahar 2 baje ka official energy level.",
    category: "animal", tags: ["weekend", "relax", "lazy"], funnyImage: true,
    createdAt: "2026-01-22", likes: 530, shares: 120, downloads: 80, views: 3100,
  },

  // ---------- Desi Memes ----------
  {
    id: "m005", slug: "papa-ka-ek-hi-dialogue", title: "Papa Ka Ek Hi Dialogue",
    caption: "“Light band karo, AC band karo”\n— Papa, since 1998",
    description: "Har Indian ghar ka sabse purana aur sabse powerful dialogue.",
    category: "desi", tags: ["papa", "ghar", "family"], festival: undefined, funnyImage: true, featured: true,
    createdAt: "2026-01-03", likes: 1520, shares: 610, downloads: 420, views: 9800,
  },
  {
    id: "m006", slug: "mummy-ki-call", title: "Mummy Ki Missed Call",
    caption: "1 missed call se pura ghar\nemergency mode mein aa jaata hai",
    description: "Mummy ka ek missed call aur family WhatsApp group active ho jaata hai.",
    category: "desi", tags: ["mummy", "family", "whatsapp"], funnyImage: true,
    createdAt: "2026-01-08", likes: 980, shares: 340, downloads: 210, views: 6400,
  },
  {
    id: "m007", slug: "relatives-salary-question", title: "Relatives Ki Favourite Query",
    caption: "“Beta salary kitni hai?”\nFamily function ka fixed opening line",
    description: "Har shaadi, har function mein ye sawaal guaranteed hai.",
    category: "desi", tags: ["relatives", "function", "salary"], funnyImage: true,
    createdAt: "2026-01-15", likes: 1100, shares: 500, downloads: 300, views: 7200,
  },
  {
    id: "m008", slug: "auto-wala-meter", title: "Auto Wala Aur Meter",
    caption: "“Meter se chalega?”\n“Nahi, seedha double lagega”",
    description: "Auto rickshaw ki negotiation, ek national sport.",
    category: "desi", tags: ["auto", "negotiation", "city"],
    createdAt: "2026-01-20", likes: 720, shares: 260, downloads: 140, views: 4700,
  },

  // ---------- Trending Memes ----------
  {
    id: "m009", slug: "wfh-vs-office-mood", title: "WFH vs Office Mood",
    caption: "Work From Home mein meeting\naur bistar dono saath chalte hain",
    description: "2026 ka sabse relatable office trend.",
    category: "trending", tags: ["wfh", "office", "trend"], featured: true, funnyImage: true,
    createdAt: "2026-02-01", likes: 2100, shares: 890, downloads: 560, views: 15400,
  },
  {
    id: "m010", slug: "recharge-plan-confusion", title: "Recharge Plan Confusion",
    caption: "20 plans dekhne ke baad bhi\nwahi purana plan recharge karte hain",
    description: "Naya recharge plan dhoondhna ek research project ban jaata hai.",
    category: "trending", tags: ["recharge", "mobile", "confusion"],
    createdAt: "2026-02-03", likes: 890, shares: 310, downloads: 180, views: 6100,
  },
  {
    id: "m011", slug: "food-delivery-wait", title: "Food Delivery Waiting Mode",
    caption: "Order track karte karte\nzyada calories burn ho jaati hain",
    description: "Delivery boy ka live location dekhna ek full time job hai.",
    category: "trending", tags: ["food", "delivery", "app"], funnyImage: true,
    createdAt: "2026-02-06", likes: 1340, shares: 470, downloads: 260, views: 8900,
  },
  {
    id: "m012", slug: "otp-not-received", title: "OTP Kabhi Time Pe Nahi Aata",
    caption: "Jab jaldi ho tabhi\nOTP 2 minute late aata hai",
    description: "Urgent kaam ho aur OTP ka network exactly tabhi slow ho jaana.",
    category: "trending", tags: ["otp", "app", "internet"],
    createdAt: "2026-02-10", likes: 1560, shares: 520, downloads: 300, views: 9700,
  },

  // ---------- Festival Memes ----------
  {
    id: "m013", slug: "diwali-cleaning-drama", title: "Diwali Ki Safai Drama",
    caption: "Diwali safai mein 5 saal purani\ncheezein milti hain jo dhundhi hi nahi thi",
    description: "Ghar ki safai mein khoye hue khazane mil jaate hain.",
    category: "festival", festival: "diwali", tags: ["diwali", "safai", "ghar"], funnyImage: true, featured: true,
    createdAt: "2025-10-15", likes: 1780, shares: 640, downloads: 410, views: 11200,
  },
  {
    id: "m014", slug: "holi-rang-bachna", title: "Holi Mein Rang Se Bachna",
    caption: "Holi mein safed kapde pehen ke\nnikalna sabse badi galti hai",
    description: "Holi ke din rang se bachne ki koshish, guaranteed fail plan.",
    category: "festival", festival: "holi", tags: ["holi", "rang", "colours"], funnyImage: true,
    createdAt: "2026-03-01", likes: 1420, shares: 480, downloads: 260, views: 8700,
  },
  {
    id: "m015", slug: "rakhi-gift-expectation", title: "Rakhi Gift Expectation vs Reality",
    caption: "Rakhi pe gift ki demand badi\nmilta chocolate ka packet hai",
    description: "Bhai behen ka pyaar gifts se zyada bada hota hai — phir bhi thodi demand toh banti hai.",
    category: "festival", festival: "raksha-bandhan", tags: ["rakhi", "siblings", "gift"],
    createdAt: "2025-08-10", likes: 960, shares: 300, downloads: 160, views: 6300,
  },
  {
    id: "m016", slug: "independence-day-speech", title: "School Independence Day Speech",
    caption: "15 August ki speech mein\nhar saal wahi lines repeat hoti hain",
    description: "School assembly ka fixed script, har saal wahi josh.",
    category: "festival", festival: "independence-day", tags: ["independence-day", "school", "speech"],
    createdAt: "2025-08-12", likes: 610, shares: 190, downloads: 90, views: 4200,
  },
  {
    id: "m017", slug: "republic-day-parade-tv", title: "Republic Day Parade Pe TV Fight",
    caption: "Republic Day parade dekhna hai\nya cartoon — ghar mein war chidh jaati hai",
    description: "Remote control ki jung, Republic Day special edition.",
    category: "festival", festival: "republic-day", tags: ["republic-day", "tv", "family"],
    createdAt: "2026-01-20", likes: 540, shares: 150, downloads: 70, views: 3600,
  },
  {
    id: "m018", slug: "christmas-cake-share", title: "Christmas Cake Sharing Problem",
    caption: "Christmas cake ka sabse bada\npiece hamesha kisi aur ko milta hai",
    description: "Cake cutting ke time har kisi ki nazar sabse bade piece pe hoti hai.",
    category: "festival", festival: "christmas", tags: ["christmas", "cake", "family"],
    createdAt: "2025-12-20", likes: 730, shares: 220, downloads: 110, views: 4900,
  },
  {
    id: "m019", slug: "new-year-resolution-fail", title: "New Year Resolution Day 3",
    caption: "1 January ka resolution\n3 January tak hi zinda rehta hai",
    description: "Gym join karne ka josh sirf teen din tak.",
    category: "festival", festival: "new-year", tags: ["new-year", "resolution", "gym"], featured: true, funnyImage: true,
    createdAt: "2025-12-31", likes: 2350, shares: 950, downloads: 600, views: 16800,
  },
  {
    id: "m020", slug: "eid-sewaiyan-extra-helping", title: "Eid Ki Sewaiyan Extra Helping",
    caption: "Eid pe “bas ek chamach” bolke\nteen baar sewaiyan le lete hain",
    description: "Eid ki mithaas ke aage sabka control fail ho jaata hai.",
    category: "festival", festival: "eid", tags: ["eid", "sewaiyan", "food"],
    createdAt: "2026-03-20", likes: 880, shares: 260, downloads: 140, views: 5700,
  },
  {
    id: "m021", slug: "makar-sankranti-kite-fight", title: "Makar Sankranti Kite Fight",
    caption: "“Wo kaata!” ka jo josh hai\nwo kisi jeet se kam nahi",
    description: "Patang kaatne ka josh, Makar Sankranti ka sabse bada moment.",
    category: "festival", festival: "makar-sankranti", tags: ["kite", "sankranti", "sky"],
    createdAt: "2026-01-14", likes: 690, shares: 200, downloads: 100, views: 4300,
  },
  {
    id: "m022", slug: "navratri-dandiya-legs", title: "Navratri Ke Agle Din Wali Legs",
    caption: "Raat bhar dandiya khelne ke baad\nagle din seedhi chadhna mission impossible",
    description: "Dandiya raat ke agle din ka pain, har garba lover jaanta hai.",
    category: "festival", festival: "navratri", tags: ["navratri", "dandiya", "dance"],
    createdAt: "2025-10-05", likes: 750, shares: 230, downloads: 120, views: 5000,
  },
  {
    id: "m023", slug: "durga-puja-pandal-hopping", title: "Durga Puja Pandal Hopping",
    caption: "Ek din mein 5 pandal ghoomna\nfestive season ka fitness challenge hai",
    description: "Pandal hopping — Durga Puja ka sabse popular activity.",
    category: "festival", festival: "durga-puja", tags: ["durga-puja", "pandal", "kolkata"],
    createdAt: "2025-10-10", likes: 640, shares: 180, downloads: 90, views: 4100,
  },
  {
    id: "m024", slug: "chhath-ghat-crowd", title: "Chhath Puja Ghat Ki Bheed",
    caption: "Chhath ke ghat pe jagah milna\nconcert ticket jitna mushkil hai",
    description: "Chhath puja ke din ghat pe bhakti aur bheed dono peak pe hote hain.",
    category: "festival", festival: "chhath-puja", tags: ["chhath", "ghat", "puja"],
    createdAt: "2025-11-05", likes: 520, shares: 140, downloads: 70, views: 3400,
  },
  {
    id: "m025", slug: "valentines-single-squad", title: "Valentine's Day Single Squad",
    caption: "14 Feb ko single squad ka plan\nsirf ek hota hai — Maggi aur Netflix",
    description: "Valentine's Day ka most peaceful plan, koi expectations nahi.",
    category: "festival", festival: "valentines-day", tags: ["valentine", "single", "friends"], funnyImage: true,
    createdAt: "2026-02-13", likes: 1680, shares: 610, downloads: 340, views: 10500,
  },
  {
    id: "m026", slug: "friendship-day-group-chat", title: "Friendship Day Group Chat",
    caption: "Saal bhar silent group chat\nFriendship Day pe achanak active ho jaati hai",
    description: "Friendship Day ka miracle — sabse quiet group bhi active ho jaata hai.",
    category: "festival", festival: "friendship-day", tags: ["friendship", "group-chat", "friends"],
    createdAt: "2026-08-02", likes: 1050, shares: 380, downloads: 190, views: 7100,
  },
  {
    id: "m027", slug: "mothers-day-kitchen-help", title: "Mother's Day Kitchen Help",
    caption: "Mother's Day pe kitchen mein help\nkarne jaate hain aur cooker chhod dete hain",
    description: "Mummy ko rest dene ki koshish, thodi si adhuri hi sahi.",
    category: "festival", festival: "mothers-day", tags: ["mothers-day", "kitchen", "family"],
    createdAt: "2026-05-10", likes: 900, shares: 280, downloads: 150, views: 6000,
  },
  {
    id: "m028", slug: "fathers-day-wifi-password", title: "Father's Day Wifi Password Wisdom",
    caption: "Papa se sabse zyada useful\nadvice wifi password wali hi hoti hai",
    description: "Papa ka gyaan har situation mein kaam aata hai.",
    category: "festival", festival: "fathers-day", tags: ["fathers-day", "papa", "wifi"],
    createdAt: "2026-06-21", likes: 870, shares: 260, downloads: 130, views: 5600,
  },

  // ---------- More generic funny-image tagged pieces ----------
  {
    id: "m029", slug: "exam-night-syllabus", title: "Exam Ki Raat Ka Syllabus",
    caption: "Exam se ek raat pehle\npura saal ka syllabus yaad aata hai",
    description: "Last night preparation, har student ka sacha reality.",
    category: "trending", tags: ["exam", "student", "study"], funnyImage: true,
    createdAt: "2026-02-14", likes: 1190, shares: 400, downloads: 220, views: 7600,
  },
  {
    id: "m030", slug: "traffic-signal-patience", title: "Traffic Signal Patience Test",
    caption: "Signal green hote hi peeche\nwale ka horn 0.1 second mein aata hai",
    description: "Signal ka last second, sabse zyada patience test karta hai.",
    category: "desi", tags: ["traffic", "city", "signal"],
    createdAt: "2026-02-18", likes: 680, shares: 190, downloads: 90, views: 4400,
  },
];
