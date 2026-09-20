import type { Joke } from "@/types/content";

// All jokes below are original, written for JokeMasti. Dates, like/share/view
// counts are realistic seed values for the initial launch (Content selection
// is handled via this static data file, per the project's "no mandatory
// database" requirement).

export const jokes: Joke[] = [
  // ---------------- Hindi (Devanagari script) ----------------
  {
    id: "j001", slug: "pati-patni-recipe-ka-jhagda",
    title: "पति-पत्नी और रेसिपी का झगड़ा",
    text: "पत्नी: सुनो, आज खाने में क्या बनाऊं?\nपति: जो भी बनाओ, दिल से बनाओ।\nपत्नी: ठीक है, फिर आज सिर्फ प्यार परोसूंगी, खाना नहीं बना। 😂",
    category: "hindi", tags: ["पति-पत्नी", "खाना", "मजेदार"], language: "hindi",
    createdAt: "2026-01-04", likes: 640, shares: 210, views: 4200, whatsapp: true,
  },
  {
    id: "j002", slug: "doctor-aur-mota-patient",
    title: "डॉक्टर और मोटा मरीज़",
    text: "डॉक्टर: आपका वज़न बहुत बढ़ गया है, चलना शुरू कीजिए।\nमरीज़: डॉक्टर साहब, मैं तो सुबह-शाम मोबाइल पे 10,000 कदम वाला ऐप चलाता हूं।\nडॉक्टर: वो ऐप है, आप नहीं!",
    category: "hindi", tags: ["डॉक्टर", "सेहत", "मोबाइल"], language: "hindi",
    createdAt: "2026-01-09", likes: 520, shares: 160, views: 3600,
  },
  {
    id: "j003", slug: "naukar-aur-malik-ki-sunwai",
    title: "नौकर और मालिक की सुनवाई",
    text: "मालिक: तुमने मेरी बात क्यों नहीं सुनी?\nनौकर: सुनी तो थी साहब, पर अमल करने का मन नहीं हुआ।\nमालिक: ये ईमानदारी कहां से सीखी?\nनौकर: आपसे ही, साहब!",
    category: "hindi", tags: ["मालिक", "नौकर", "हाजिरजवाबी"], language: "hindi",
    createdAt: "2026-01-14", likes: 480, shares: 140, views: 3100,
  },
  {
    id: "j004", slug: "beta-aur-result-card",
    title: "बेटा और रिजल्ट कार्ड",
    text: "पापा: ये रिजल्ट कार्ड में इतने कम नंबर क्यों हैं?\nबेटा: पापा, टीचर बहुत सख्त हैं, नंबर काट देती हैं।\nपापा: पूरे नंबर तो काटे ही नहीं, टीचर ने दिए ही नहीं थे!",
    category: "hindi", tags: ["स्कूल", "रिजल्ट", "पापा"], language: "hindi",
    createdAt: "2026-01-19", likes: 710, shares: 260, views: 4900, featured: true,
  },
  {
    id: "j005", slug: "sasural-mein-pehli-roti",
    title: "ससुराल में पहली रोटी",
    text: "सास: बहू, रोटी थोड़ी टेढ़ी बनी है।\nबहू: मम्मी जी, ये भारत का नक्शा है, प्यार से खाइए।\nसास हंसते-हंसते बोलीं: बेटा, फिर तो चलो भूगोल की क्लास हो जाए!",
    category: "hindi", tags: ["सास-बहू", "रोटी", "हाजिरजवाबी"], language: "hindi",
    createdAt: "2026-01-25", likes: 590, shares: 190, views: 3800, whatsapp: true,
  },
  {
    id: "j006", slug: "bus-conductor-aur-passenger",
    title: "बस कंडक्टर और पैसेंजर",
    text: "पैसेंजर: भाई, अगला स्टॉप कौन सा है?\nकंडक्टर: वही जो आपके उतरने के बाद आएगा।\nपैसेंजर: मतलब?\nकंडक्टर: मतलब बस चलती रहेगी, आप ध्यान रखिए!",
    category: "hindi", tags: ["बस", "सफर", "कंडक्टर"], language: "hindi",
    createdAt: "2026-02-02", likes: 430, shares: 110, views: 2700,
  },

  // ---------------- Funny ----------------
  {
    id: "j007", slug: "gym-aur-selfie-ka-balance",
    title: "Gym Aur Selfie Ka Balance",
    text: "Trainer: Bhai, weight kaise nahi ghata?\nMain: Weight ghatane se zyada important hai selfie mein angle sahi rakhna.\nTrainer ne apna sar pakad liya. 😂",
    category: "funny", tags: ["gym", "selfie", "fitness"], language: "hinglish",
    createdAt: "2026-01-06", likes: 890, shares: 320, views: 6100, whatsapp: true, featured: true,
  },
  {
    id: "j008", slug: "wifi-password-bhool-gaya",
    title: "WiFi Password Bhool Gaya",
    text: "Guest: Bhaiya WiFi ka password kya hai?\nMain: “Welcome123”\nGuest: Ye toh kaam hi nahi kar raha.\nMain: Kyunki password hai “badalgayahai” — yehi hint tha!",
    category: "funny", tags: ["wifi", "password", "guest"], language: "hinglish",
    createdAt: "2026-01-11", likes: 760, shares: 280, views: 5200,
  },
  {
    id: "j009", slug: "online-shopping-ka-nasha",
    title: "Online Shopping Ka Nasha",
    text: "Wife: Aapko pata hai humara bank balance kitna kam ho gaya hai?\nHusband: Haan, par cart mein “items abhi bhi wait kar rahe hain” wala notification bhi toh dekho!",
    category: "funny", tags: ["shopping", "online", "bank"], language: "hinglish",
    createdAt: "2026-01-16", likes: 670, shares: 210, views: 4300,
  },
  {
    id: "j010", slug: "alarm-aur-snooze-button",
    title: "Alarm Aur Snooze Button",
    text: "Alarm: Uth ja bhai, office jaana hai!\nMain: 5 minute aur.\nAlarm: Ye 5 minute tune pichhle 1 ghante se bola hai.\nMain: Consistency important hai boss.",
    category: "funny", tags: ["alarm", "sleep", "office"], language: "hinglish",
    createdAt: "2026-01-21", likes: 950, shares: 400, views: 7200, whatsapp: true,
  },
  {
    id: "j011", slug: "autocorrect-ki-shararat",
    title: "Autocorrect Ki Shararat",
    text: "Maine type kiya “Kal milte hain”\nAutocorrect ne bana diya “Kal milte haiN”\nAur bhai ne reply kiya: “Tu theek toh hai na?”",
    category: "funny", tags: ["autocorrect", "phone", "chat"], language: "hinglish",
    createdAt: "2026-01-27", likes: 540, shares: 170, views: 3300,
  },
  {
    id: "j012", slug: "traffic-jam-mein-gyan",
    title: "Traffic Jam Mein Gyan",
    text: "Dost: Itna traffic hai, kab tak pahunchenge?\nMain: Physics kehti hai, jo cheez ruki hui hai wo tab tak rukegi jab tak koi force na lage.\nDost: Force lagayenge ya bhookhe marenge?",
    category: "funny", tags: ["traffic", "physics", "jam"], language: "hinglish",
    createdAt: "2026-02-01", likes: 610, shares: 200, views: 4000,
  },

  // ---------------- Desi ----------------
  {
    id: "j013", slug: "chai-pe-charcha",
    title: "Chai Pe Charcha",
    text: "Neighbour: Bhai chai peene aa jao.\nMain: Abhi busy hoon.\nNeighbour: Samosa bhi hai.\nMain: 2 minute mein pahunch raha hoon, busy-vusy kuch nahi tha.",
    category: "desi", tags: ["chai", "samosa", "neighbour"], language: "hinglish",
    createdAt: "2026-01-05", likes: 820, shares: 300, views: 5800, whatsapp: true, featured: true,
  },
  {
    id: "j014", slug: "bargaining-ka-national-level",
    title: "Bargaining Ka National Level",
    text: "Dukaandar: 500 rupaye ka hai madam.\nMummy: 150 mein doge?\nDukaandar: Madam ji, cost hi 300 hai.\nMummy: Toh 200 mein de do, dono ka fayda.",
    category: "desi", tags: ["bargaining", "shopping", "mummy"], language: "hinglish",
    createdAt: "2026-01-10", likes: 900, shares: 350, views: 6300,
  },
  {
    id: "j015", slug: "cricket-match-wala-mohalla",
    title: "Cricket Match Wala Mohalla",
    text: "Ball road pe gayi, sab log “Catch, catch!” chilla rahe the.\nUncle ne balcony se hi catch pakad li aur bole: “Ab match yahin khatam!”",
    category: "desi", tags: ["cricket", "mohalla", "uncle"], language: "hinglish",
    createdAt: "2026-01-17", likes: 700, shares: 240, views: 4600,
  },
  {
    id: "j016", slug: "barish-mein-bike-slip",
    title: "Barish Mein Bike Aur Slip",
    text: "Dost: Bike slip kaise hui?\nMain: Brake maara.\nDost: Fir?\nMain: Brake ne bola “abhi nahi, thoda aur mazaa le lo” aur main seedha gaddhe mein.",
    category: "desi", tags: ["barish", "bike", "mazaak"], language: "hinglish",
    createdAt: "2026-01-23", likes: 560, shares: 180, views: 3500,
  },
  {
    id: "j017", slug: "power-cut-ka-timing",
    title: "Power Cut Ka Perfect Timing",
    text: "Jaise hi favourite serial ka twist aata hai, waise hi light chali jaati hai.\nMohalle walon ko lagta hai electricity board ko bhi spoiler pata chal jaata hai.",
    category: "desi", tags: ["powercut", "tv", "serial"], language: "hinglish",
    createdAt: "2026-01-29", likes: 630, shares: 210, views: 4100,
  },
  {
    id: "j018", slug: "paani-puri-wale-ka-hisaab",
    title: "Paani Puri Wale Ka Hisaab",
    text: "Main: Bhaiya kitni khayi maine?\nPaani Puri Wala: 14 plate.\nMain: Itni toh nahi khayi.\nWala: Bhai, gine hain, emotions nahi, plates.",
    category: "desi", tags: ["paanipuri", "street-food", "hisaab"], language: "hinglish",
    createdAt: "2026-02-04", likes: 780, shares: 260, views: 5000, whatsapp: true,
  },

  // ---------------- WhatsApp ----------------
  {
    id: "j019", slug: "good-morning-forward-ka-record",
    title: "Good Morning Forward Ka Record",
    text: "Subah 6 baje uncle ka “Good Morning” forward aata hai.\nMain socha karta hoon — inki neend kab poori hoti hai, aur mera data kab bachega?",
    category: "whatsapp", tags: ["good-morning", "forward", "group"], language: "hinglish",
    createdAt: "2026-01-07", likes: 710, shares: 290, views: 5100, whatsapp: true,
  },
  {
    id: "j020", slug: "family-group-mein-silence",
    title: "Family Group Mein Silence",
    text: "Family group mein 2 din se koi message nahi.\nAchanak Bua ne bheja: “Sabko Good Night”\nGroup phir se 47 messages ke saath jaag gaya.",
    category: "whatsapp", tags: ["family-group", "silence", "goodnight"], language: "hinglish",
    createdAt: "2026-01-13", likes: 680, shares: 250, views: 4400, whatsapp: true,
  },
  {
    id: "j021", slug: "blue-tick-ka-dar",
    title: "Blue Tick Ka Dar",
    text: "Message aaya “Kal mil sakte ho?”\nMaine notification se hi padh liya, blue tick nahi hone diya.\nDost bola: “Mujhe pata hai tune padh liya, main bhi wahi trick karta hoon.”",
    category: "whatsapp", tags: ["bluetick", "chat", "dost"], language: "hinglish",
    createdAt: "2026-01-18", likes: 990, shares: 420, views: 7300, whatsapp: true, featured: true,
  },
  {
    id: "j022", slug: "voice-message-ki-lambai",
    title: "Voice Message Ki Lambai",
    text: "Dost ne 8 minute ka voice message bheja.\nMaine sirf itna suna: “Arey suno na...”\nBaaki 7 minute 50 second sirf background mein cooker ki seeti thi.",
    category: "whatsapp", tags: ["voice-message", "audio", "dost"], language: "hinglish",
    createdAt: "2026-01-24", likes: 610, shares: 200, views: 3900,
  },
  {
    id: "j023", slug: "status-lagane-ka-pressure",
    title: "Status Lagane Ka Pressure",
    text: "Ek dost ne status lagaya “Life is good”.\nDusre 20 logon ne bhi apna old vacation photo status pe daal diya.\nStatus war shuru ho chuki thi.",
    category: "whatsapp", tags: ["status", "vacation", "friends"], language: "hinglish",
    createdAt: "2026-01-30", likes: 540, shares: 160, views: 3300, whatsapp: true,
  },
  {
    id: "j024", slug: "group-admin-ki-mushkilein",
    title: "Group Admin Ki Mushkilein",
    text: "Group admin: Please koi forward na bheje bina check kiye.\n2 minute baad wahi admin ne 5 forward bina padhe bhej diye.\nPower corrupts, even in WhatsApp groups.",
    category: "whatsapp", tags: ["group-admin", "forward", "power"], language: "hinglish",
    createdAt: "2026-02-05", likes: 720, shares: 270, views: 4700, whatsapp: true,
  },

  // ---------------- Love ----------------
  {
    id: "j025", slug: "propose-karte-waqt-ka-darr",
    title: "Propose Karte Waqt Ka Darr",
    text: "Ladka: Main tumse kuch kehna chahta hoon.\nLadki: Bolo na.\nLadka 10 minute soch ke bola: Wo... tumhara recharge khatam ho gaya kya?",
    category: "love", tags: ["propose", "nervous", "crush"], language: "hinglish",
    createdAt: "2026-01-08", likes: 830, shares: 310, views: 5700, whatsapp: true,
  },
  {
    id: "j026", slug: "anniversary-bhool-gaya",
    title: "Anniversary Bhool Gaya",
    text: "Wife: Pata hai aaj kya hai?\nHusband confuse: Haan yaad hai, aaj Monday hai.\nWife: Aur humari anniversary bhi.\nHusband: Wahi toh keh raha tha, double celebration!",
    category: "love", tags: ["anniversary", "husband-wife", "yaadash"], language: "hinglish",
    createdAt: "2026-01-15", likes: 900, shares: 360, views: 6400, featured: true,
  },
  {
    id: "j027", slug: "long-distance-relationship-ka-data-pack",
    title: "Long Distance Relationship Ka Data Pack",
    text: "Girlfriend: Tum mujhse pyaar kitna karte ho?\nBoyfriend: Utna jitna mera monthly data pack sirf tumse baat karne mein khatam ho jaata hai.",
    category: "love", tags: ["ldr", "data", "pyaar"], language: "hinglish",
    createdAt: "2026-01-22", likes: 720, shares: 250, views: 4900,
  },
  {
    id: "j028", slug: "shaadi-ke-baad-ka-sach",
    title: "Shaadi Ke Baad Ka Sach",
    text: "Shaadi se pehle: Tumhari pasand hi meri pasand hai.\nShaadi ke baad: Remote tumhare paas hai, meri pasand yahi hai ki tum chup ho jao.",
    category: "love", tags: ["shaadi", "remote", "sach"], language: "hinglish",
    createdAt: "2026-01-28", likes: 780, shares: 290, views: 5300, whatsapp: true,
  },
  {
    id: "j029", slug: "valentine-gift-ka-budget",
    title: "Valentine Gift Ka Budget",
    text: "Girlfriend: Tum mere liye kya laaye ho?\nBoyfriend: Dil se socha tha kuch mehenga launga.\nGirlfriend: Toh laaye kya?\nBoyfriend: Dil se soch ke hi ruk gaya.",
    category: "love", tags: ["valentine", "gift", "budget"], language: "hinglish",
    createdAt: "2026-02-08", likes: 650, shares: 220, views: 4200,
  },

  // ---------------- Family ----------------
  {
    id: "j030", slug: "mummy-ka-hisaab-kitaab",
    title: "Mummy Ka Hisaab Kitaab",
    text: "Main: Mummy, 100 rupaye chahiye.\nMummy: Kal ke 50 ka kya hua?\nMain: Wo toh pichle mahine wale the.\nMummy: Toh iska matlab tu interest bhi jodta hai?",
    category: "family", tags: ["mummy", "paise", "hisaab"], language: "hinglish",
    createdAt: "2026-01-06", likes: 810, shares: 300, views: 5600, whatsapp: true,
  },
  {
    id: "j031", slug: "papa-ki-driving-tips",
    title: "Papa Ki Driving Tips",
    text: "Papa: Gaadi chalate waqt dhyan rakhna.\nMain: Haan papa.\nPapa: Aur haan, jab main baithu tab break zyada mat maarna, coffee gir jaati hai.",
    category: "family", tags: ["papa", "driving", "coffee"], language: "hinglish",
    createdAt: "2026-01-12", likes: 690, shares: 230, views: 4500,
  },
  {
    id: "j032", slug: "dadi-ka-purana-nuskha",
    title: "Dadi Ka Purana Nuskha",
    text: "Main: Dadi, sar mein dard ho raha hai.\nDadi: Haldi wala doodh pi le.\nMain: Pet mein dard ho raha hai.\nDadi: Haldi wala doodh pi le.\nDadi ka ek hi jawab, har sawaal ka.",
    category: "family", tags: ["dadi", "nuskha", "haldi-doodh"], language: "hinglish",
    createdAt: "2026-01-20", likes: 950, shares: 400, views: 7000, featured: true,
  },
  {
    id: "j033", slug: "bhai-behen-ka-remote-war",
    title: "Bhai-Behen Ka Remote War",
    text: "Behen: Remote de do, mera serial aa raha hai.\nBhai: Mera match chal raha hai.\nMummy: Dono ka TV band, main news dekhungi.\nGhar mein sabse powerful remote mummy ke haath mein.",
    category: "family", tags: ["bhai-behen", "remote", "tv"], language: "hinglish",
    createdAt: "2026-01-26", likes: 700, shares: 250, views: 4800, whatsapp: true,
  },
  {
    id: "j034", slug: "chacha-ki-advice",
    title: "Chacha Ki Free Advice",
    text: "Chacha: Beta, life mein disciplined raho.\nMain: Ji chacha.\nChacha: Aur haan, meri chai thandi ho rahi hai, jaldi bana ke lao.\nDiscipline sabke liye, chai sirf unke liye.",
    category: "family", tags: ["chacha", "advice", "chai"], language: "hinglish",
    createdAt: "2026-02-01", likes: 580, shares: 190, views: 3700,
  },

  // ---------------- School ----------------
  {
    id: "j035", slug: "homework-bhi-lockdown-mein-hai",
    title: "Homework Bhi Lockdown Mein Hai",
    text: "Teacher: Homework kahan hai?\nStudent: Sir, homework bhi lockdown mein hai. 😂",
    category: "school", tags: ["homework", "teacher", "student"], language: "hinglish",
    createdAt: "2026-01-03", likes: 1240, shares: 520, views: 9100, whatsapp: true, featured: true,
  },
  {
    id: "j036", slug: "exam-mein-copy-ka-scene",
    title: "Exam Mein Copy Ka Scene",
    text: "Teacher: Answer sheet khaali kyun hai?\nStudent: Ma'am, main honest hoon, nakal nahi ki.\nTeacher: Padhai bhi nahi ki lagta hai.\nStudent: Wo dusri baat hai.",
    category: "school", tags: ["exam", "honesty", "student"], language: "hinglish",
    createdAt: "2026-01-13", likes: 870, shares: 330, views: 6000,
  },
  {
    id: "j037", slug: "principal-office-ka-bulawa",
    title: "Principal Office Ka Bulawa",
    text: "Peon: Principal ne bulaya hai.\nStudent: Achi baat ke liye ya buri?\nPeon: Agar achi hoti toh main muskura raha hota.",
    category: "school", tags: ["principal", "office", "darr"], language: "hinglish",
    createdAt: "2026-01-21", likes: 650, shares: 220, views: 4300,
  },
  {
    id: "j038", slug: "maths-teacher-ka-sawaal",
    title: "Maths Teacher Ka Sawaal",
    text: "Teacher: Agar tumhare paas 10 chocolates hain aur tum 3 doston ko do-do do, toh kitni bachengi?\nStudent: Sir, mujhe pehle chocolates chahiye, tab calculate karunga.",
    category: "school", tags: ["maths", "chocolate", "classroom"], language: "hinglish",
    createdAt: "2026-01-27", likes: 920, shares: 380, views: 6700, whatsapp: true,
  },
  {
    id: "j039", slug: "attendance-ka-jugaad",
    title: "Attendance Ka Jugaad",
    text: "Teacher: Present bolo jab naam pukaru.\nStudent apne dost ka naam sun ke bhi “Present” bol deta hai.\nTeacher: Do jagah kaise present ho sakte ho?\nStudent: Talent hai ma'am.",
    category: "school", tags: ["attendance", "jugaad", "classroom"], language: "hinglish",
    createdAt: "2026-02-03", likes: 700, shares: 260, views: 4600,
  },
  {
    id: "j040", slug: "english-class-ka-tension",
    title: "English Class Ka Tension",
    text: "Teacher: Make a sentence using the word “beautiful”.\nStudent: My English is not beautiful, sir.\nTeacher hasi rok nahi payi, full marks de diye.",
    category: "school", tags: ["english", "classroom", "student"], language: "hinglish",
    createdAt: "2026-02-09", likes: 610, shares: 210, views: 3900,
  },

  // ---------------- Office ----------------
  {
    id: "j041", slug: "monday-morning-meeting",
    title: "Monday Morning Meeting",
    text: "Boss: Monday hai, thoda energetic dikho.\nEmployee: Sir, Monday ko energy sirf coffee mein hoti hai, mujhme nahi.",
    category: "office", tags: ["monday", "meeting", "boss"], language: "hinglish",
    createdAt: "2026-01-05", likes: 980, shares: 410, views: 7100, whatsapp: true, featured: true,
  },
  {
    id: "j042", slug: "deadline-aur-excuses",
    title: "Deadline Aur Excuses",
    text: "Boss: Report kahan hai?\nEmployee: Sir, laptop hang ho gaya tha.\nBoss: Kal bhi yahi bola tha.\nEmployee: Sir, laptop ko bhi Monday off chahiye hota hai.",
    category: "office", tags: ["deadline", "excuse", "laptop"], language: "hinglish",
    createdAt: "2026-01-11", likes: 860, shares: 340, views: 6200,
  },
  {
    id: "j043", slug: "appraisal-ka-intezaar",
    title: "Appraisal Ka Intezaar",
    text: "HR: Aapki performance kaisi rahi is saal?\nEmployee: Sir, meri performance ekdum stock market jaisi hai — thodi up, thodi down.\nHR: Aur salary hike?\nEmployee: Wo bhi market jaisa hi rahega shayad.",
    category: "office", tags: ["appraisal", "hr", "salary"], language: "hinglish",
    createdAt: "2026-01-19", likes: 1010, shares: 450, views: 7800, featured: true,
  },
  {
    id: "j044", slug: "coffee-break-ka-timing",
    title: "Coffee Break Ka Perfect Timing",
    text: "Manager ne bola: Break sirf 10 minute ka hoga.\nEmployee ne 9 minute 59 second mein coffee khatam ki aur ek second baad seat pe wapas — punctuality yahin dikhti hai.",
    category: "office", tags: ["coffee-break", "manager", "punctuality"], language: "hinglish",
    createdAt: "2026-01-25", likes: 690, shares: 230, views: 4400,
  },
  {
    id: "j045", slug: "work-from-home-ka-dress-code",
    title: "Work From Home Ka Dress Code",
    text: "Manager: Video call mein professional dikho.\nEmployee upar se shirt, neeche pyjama pehne baitha tha.\nCamera ka angle bhi ek skill hota hai.",
    category: "office", tags: ["wfh", "video-call", "dresscode"], language: "hinglish",
    createdAt: "2026-02-02", likes: 1150, shares: 500, views: 8600, whatsapp: true,
  },

  // ---------------- Friendship ----------------
  {
    id: "j046", slug: "dost-ka-sacha-pyaar",
    title: "Dost Ka Sacha Pyaar",
    text: "Dost: Tere paas 100 rupaye hain?\nMain: Nahi yaar.\nDost: Chal thik hai, tu hi keh raha hai toh maan leta hoon.\nSacchi dosti isi ko kehte hain.",
    category: "friendship", tags: ["dost", "paise", "trust"], language: "hinglish",
    createdAt: "2026-01-07", likes: 890, shares: 350, views: 6400, whatsapp: true,
  },
  {
    id: "j047", slug: "group-trip-ki-planning",
    title: "Group Trip Ki Planning",
    text: "5 dost group trip plan kar rahe hain, 3 mahine se sirf date finalize nahi hui.\nAakhir mein sab bole: “Agle saal dekhte hain.” Wahi “agle saal” har saal aata hai.",
    category: "friendship", tags: ["trip", "planning", "dost"], language: "hinglish",
    createdAt: "2026-01-16", likes: 1020, shares: 470, views: 7600, featured: true,
  },
  {
    id: "j048", slug: "best-friend-ki-pehchaan",
    title: "Best Friend Ki Pehchaan",
    text: "Best friend wo hota hai jo aapke saamne aapko bura-bhala kahe,\naur peeche se sabse pehle aapki taarif kare.",
    category: "friendship", tags: ["bestfriend", "pehchaan", "sach"], language: "hinglish",
    createdAt: "2026-01-24", likes: 760, shares: 280, views: 5100,
  },
  {
    id: "j049", slug: "purane-dost-ka-message",
    title: "Purane Dost Ka Achanak Message",
    text: "3 saal baad purane dost ka message aaya: “Kaise ho?”\nMain samajh gaya, agla message zaroor loan maangne wala hoga.",
    category: "friendship", tags: ["purana-dost", "message", "loan"], language: "hinglish",
    createdAt: "2026-01-31", likes: 830, shares: 310, views: 5900, whatsapp: true,
  },
  {
    id: "j050", slug: "dosti-aur-bill-splitting",
    title: "Dosti Aur Bill Splitting",
    text: "5 dost restaurant mein khana khaate hain, bill aate hi calculator nikal aata hai.\nDosti anmol hai, par bill splitting ekdum accurate honi chahiye.",
    category: "friendship", tags: ["bill", "restaurant", "dost"], language: "hinglish",
    createdAt: "2026-02-06", likes: 690, shares: 240, views: 4500,
  },

  // ---------------- Clean (adult-free) ----------------
  {
    id: "j051", slug: "gyaan-wale-uncle",
    title: "Gyaan Wale Uncle",
    text: "Uncle: Beta, hamare zamane mein hum paidal school jaate the.\nMain: Uncle, aapke zamane mein school bhi tha kya?\nUncle hasne lage: Ye sawaal to naya tha!",
    category: "clean", tags: ["uncle", "gyaan", "school"], language: "hinglish",
    createdAt: "2026-01-04", likes: 720, shares: 250, views: 4700, whatsapp: true,
  },
  {
    id: "j052", slug: "vegetable-vendor-ki-taazgi",
    title: "Vegetable Vendor Ki Taazgi",
    text: "Main: Bhaiya, sabzi taazi hai na?\nVendor: Bilkul taazi hai, subah hi khet se tod ke laaya... phone pe order kiya tha.",
    category: "clean", tags: ["sabzi", "market", "mazaak"], language: "hinglish",
    createdAt: "2026-01-14", likes: 610, shares: 200, views: 3800,
  },
  {
    id: "j053", slug: "library-mein-silence-rule",
    title: "Library Mein Silence Rule",
    text: "Librarian: Yahan silence rakhna zaroori hai.\nStudent phone pe silent mode mein hi baat karta pakda gaya.\nLibrarian: Ye “silence” ka naya version hai kya?",
    category: "clean", tags: ["library", "silence", "student"], language: "hinglish",
    createdAt: "2026-01-22", likes: 540, shares: 170, views: 3300,
  },
  {
    id: "j054", slug: "park-mein-morning-walk",
    title: "Park Mein Morning Walk Ka Gossip",
    text: "Do aunty morning walk pe milti hain.\nEk bolti hai: Aaj walk karte hain.\nDoosri: Chalo, par pehle thoda gossip kar lete hain, walk baad mein.",
    category: "clean", tags: ["park", "walk", "gossip"], language: "hinglish",
    createdAt: "2026-01-30", likes: 650, shares: 210, views: 4100,
  },
  {
    id: "j055", slug: "cycle-seekhne-ka-pehla-din",
    title: "Cycle Seekhne Ka Pehla Din",
    text: "Papa: Balance rakho, main pakad ke rakha hoon.\nMain 10 meter aage jaake peeche dekha, papa toh kab ke chhod chuke the!\nPar cycle chal rahi thi, wahi asli seekh thi.",
    category: "clean", tags: ["cycle", "papa", "childhood"], language: "hinglish",
    createdAt: "2026-02-07", likes: 900, shares: 360, views: 6300, featured: true,
  },

  // ---------------- English ----------------
  {
    id: "j056", slug: "programmer-and-the-light-bulb",
    title: "The Programmer And The Light Bulb",
    text: "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
    category: "office", tags: ["programmer", "tech", "office"], language: "english",
    createdAt: "2026-02-11", likes: 480, shares: 150, views: 2900,
  },
  {
    id: "j057", slug: "the-honest-report-card",
    title: "The Honest Report Card",
    text: "Teacher: Your son needs to work harder.\nParent: He is working hard — hardly working, but very hard at it.",
    category: "school", tags: ["report-card", "student", "parent"], language: "english",
    createdAt: "2026-02-12", likes: 410, shares: 120, views: 2500,
  },
  {
    id: "j058", slug: "gym-membership-logic",
    title: "Gym Membership Logic",
    text: "I bought a one-year gym membership so I could get fit before summer. Now it's winter and I still haven't figured out the parking.",
    category: "funny", tags: ["gym", "fitness", "excuse"], language: "english",
    createdAt: "2026-02-14", likes: 560, shares: 190, views: 3400,
  },

  // ---------------- Festival jokes ----------------
  {
    id: "j059", slug: "diwali-mithai-ka-hisaab",
    title: "Diwali Mithai Ka Hisaab",
    text: "Mummy: Kitni mithai khayi?\nMain: Bas ek dabba.\nMummy: Aur 3 dabbe kahan gaye jo maine chhupa ke rakhe the?\nMain: Wahi ek dabba tha, size bada tha!",
    category: "hindi", tags: ["diwali", "mithai", "festival"], language: "hinglish", festival: "diwali",
    createdAt: "2025-10-16", likes: 1080, shares: 420, views: 7900, whatsapp: true, featured: true,
  },
  {
    id: "j060", slug: "diwali-pataka-budget",
    title: "Diwali Pataka Budget",
    text: "Papa: Is saal patakon ka budget kam rakhna.\nBeta: Ji papa, sirf environment friendly patake lenge.\nPapa: Matlab?\nBeta: Matlab sirf phuljhadi, awaaz bhi kam, kharcha bhi kam!",
    category: "funny", tags: ["diwali", "pataka", "budget"], language: "hinglish", festival: "diwali",
    createdAt: "2025-10-18", likes: 780, shares: 290, views: 5300, whatsapp: true,
  },
  {
    id: "j061", slug: "holi-ka-sabse-bada-darr",
    title: "Holi Ka Sabse Bada Darr",
    text: "Holi ke din sabse zyada darr kisko lagta hai? Us insaan ko jisne kal hi naye white kapde liye hain.",
    category: "desi", tags: ["holi", "rang", "kapde"], language: "hinglish", festival: "holi",
    createdAt: "2026-03-02", likes: 950, shares: 360, views: 6800, featured: true,
  },
  {
    id: "j062", slug: "holi-milan-samaroh",
    title: "Holi Milan Samaroh Ka Sach",
    text: "Holi Milan Samaroh mein sabse zyada energy tab aati hai jab gujiya ki plate saamne aati hai — rang toh baad mein yaad aata hai.",
    category: "funny", tags: ["holi", "gujiya", "milan"], language: "hinglish", festival: "holi",
    createdAt: "2026-03-03", likes: 640, shares: 210, views: 4200,
  },
  {
    id: "j063", slug: "rakhi-ka-asli-hisaab",
    title: "Rakhi Ka Asli Hisaab",
    text: "Behen: Rakhi bandhungi, gift dena padega.\nBhai: Pyaar se bandh de, gift bhi pyaar se de dunga.\nBehen: Toh pyaar bhi udhaar aur gift bhi udhaar?",
    category: "family", tags: ["rakhi", "gift", "bhai-behen"], language: "hinglish", festival: "raksha-bandhan",
    createdAt: "2025-08-11", likes: 870, shares: 330, views: 6000, whatsapp: true,
  },
  {
    id: "j064", slug: "azaadi-ka-jashn",
    title: "Azaadi Ka Ghar Wala Jashn",
    text: "15 August ko sabse zyada azaadi kisko milti hai? Bachon ko — school mein sirf flag hoisting hoti hai, homework nahi milta!",
    category: "hindi", tags: ["independence-day", "school", "azaadi"], language: "hinglish", festival: "independence-day",
    createdAt: "2025-08-13", likes: 690, shares: 240, views: 4600,
  },
  {
    id: "j065", slug: "republic-day-ki-chhutti",
    title: "Republic Day Ki Chhutti Ka Mahatva",
    text: "26 January ko sabse important cheez kya hai? Parade nahi, ye ki chhutti Sunday pe nahi padi.",
    category: "funny", tags: ["republic-day", "chhutti", "sunday"], language: "hinglish", festival: "republic-day",
    createdAt: "2026-01-21", likes: 610, shares: 200, views: 3900,
  },
  {
    id: "j066", slug: "christmas-santa-ka-sach",
    title: "Christmas Santa Ka Sach",
    text: "Bachcha: Papa, Santa kaise pata lagate hain ki maine achha kaam kiya ya bura?\nPapa: Beta, wahi toh tumhari mummy bhi karti hain, Santa se bhi tez.",
    category: "family", tags: ["christmas", "santa", "family"], language: "hinglish", festival: "christmas",
    createdAt: "2025-12-22", likes: 750, shares: 260, views: 5000, whatsapp: true,
  },
  {
    id: "j067", slug: "new-year-party-ka-agla-din",
    title: "New Year Party Ka Agla Din",
    text: "31 December ki raat: “Is saal sab kuch badal dunga!”\n1 January ki dopahar: “Thoda aur so leta hoon, kal se sab badlega.”",
    category: "funny", tags: ["new-year", "party", "resolution"], language: "hinglish", festival: "new-year",
    createdAt: "2025-12-31", likes: 1240, shares: 540, views: 9300, featured: true,
  },
  {
    id: "j068", slug: "eid-ki-sewaiyan-fight",
    title: "Eid Ki Sewaiyan Ke Liye Fight",
    text: "Eid pe sabse zyada dosti sewaiyan ke bowl ke paas hoti hai — jitni der lagao, utni kam milti hai.",
    category: "desi", tags: ["eid", "sewaiyan", "festival"], language: "hinglish", festival: "eid",
    createdAt: "2026-03-21", likes: 700, shares: 230, views: 4500,
  },
  {
    id: "j069", slug: "sankranti-ki-patang-baazi",
    title: "Sankranti Ki Patang Baazi",
    text: "Makar Sankranti pe sabse bada emotion kya hai? Apni patang kaate jaane ka dukh, aur doosron ki katne ka josh — dono ek hi second mein!",
    category: "funny", tags: ["makar-sankranti", "patang", "josh"], language: "hinglish", festival: "makar-sankranti",
    createdAt: "2026-01-13", likes: 660, shares: 220, views: 4200,
  },
  {
    id: "j070", slug: "navratri-fasting-ka-jugaad",
    title: "Navratri Fasting Ka Jugaad",
    text: "Navratri mein vrat rakha, par sabudana khichdi, kuttu ke pakode aur makhane — vrat mein bhi menu normal khane se lamba nikal gaya.",
    category: "desi", tags: ["navratri", "vrat", "khaana"], language: "hinglish", festival: "navratri",
    createdAt: "2025-10-06", likes: 590, shares: 190, views: 3700,
  },
  {
    id: "j071", slug: "durga-puja-ka-pandal-selfie",
    title: "Durga Puja Ka Pandal Selfie",
    text: "Durga Puja pandal mein darshan baad mein hote hain, pehle perfect selfie ka angle dhoondha jaata hai.",
    category: "funny", tags: ["durga-puja", "selfie", "pandal"], language: "hinglish", festival: "durga-puja",
    createdAt: "2025-10-11", likes: 540, shares: 170, views: 3400,
  },
  {
    id: "j072", slug: "chhath-vrat-ki-bhakti",
    title: "Chhath Vrat Ki Bhakti Aur Sabr",
    text: "Chhath Puja mein 36 ghante ka nirjala vrat — is bhakti aur sabr ke aage hamara “ek din ka diet plan” bhi fail hai.",
    category: "family", tags: ["chhath", "vrat", "bhakti"], language: "hinglish", festival: "chhath-puja",
    createdAt: "2025-11-06", likes: 610, shares: 200, views: 3900,
  },
  {
    id: "j073", slug: "valentine-week-ka-schedule",
    title: "Valentine Week Ka Full Schedule",
    text: "Rose Day, Propose Day, Chocolate Day... aur single logon ka schedule sirf ek hi din ka hota hai: “Normal Day”, roz wahi.",
    category: "love", tags: ["valentine", "single", "week"], language: "hinglish", festival: "valentines-day",
    createdAt: "2026-02-10", likes: 1120, shares: 480, views: 8100, whatsapp: true, featured: true,
  },
  {
    id: "j074", slug: "friendship-day-ka-purana-dost",
    title: "Friendship Day Ka Purana Dost",
    text: "Friendship Day pe sabse zyada yaad wo dost aata hai jisse last fight hua tha — pata nahi kyun, dosti ka dil bada hota hai.",
    category: "friendship", tags: ["friendship-day", "dost", "yaad"], language: "hinglish", festival: "friendship-day",
    createdAt: "2026-08-01", likes: 890, shares: 340, views: 6100, whatsapp: true,
  },
  {
    id: "j075", slug: "mothers-day-ka-sabse-bada-tribute",
    title: "Mother's Day Ka Sabse Bada Tribute",
    text: "Mother's Day pe sabse bada tribute yahi hai ki ek din ke liye mummy ko “Aaj kya banaogi” na poochha jaaye.",
    category: "family", tags: ["mothers-day", "mummy", "tribute"], language: "hinglish", festival: "mothers-day",
    createdAt: "2026-05-09", likes: 950, shares: 370, views: 6700, featured: true,
  },
  {
    id: "j076", slug: "fathers-day-ka-silent-pyaar",
    title: "Father's Day Ka Silent Pyaar",
    text: "Papa kabhi “I love you” nahi bolte, par gaadi mein petrol khatam hone se pehle hi bhar dete hain — pyaar ka apna hi language hota hai.",
    category: "family", tags: ["fathers-day", "papa", "pyaar"], language: "hinglish", festival: "fathers-day",
    createdAt: "2026-06-20", likes: 1030, shares: 410, views: 7400, whatsapp: true,
  },
];

export function getAllJokes() {
  return jokes;
}

export function getJokeBySlug(slug: string) {
  return jokes.find((j) => j.slug === slug);
}

export function getJokesByCategory(category: string) {
  return jokes.filter((j) => j.category === category);
}

export function getJokesByFestival(festival: string) {
  return jokes.filter((j) => j.festival === festival);
}

export function getFeaturedJokes() {
  return jokes.filter((j) => j.featured);
}

export function getWhatsappJokes() {
  return jokes.filter((j) => j.whatsapp);
}
