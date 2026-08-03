const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const topButton = document.querySelector("[data-top]");
const cookieStorageKey = "saintTheklaCookieChoice";
const languageStorageKey = "saintTheklaLanguage";
const eventPopupImage = "assets/paraklesis-service-august-1-2026.jpg";
const eventPopupExpiresAt = Date.parse("2026-08-02T00:00:00-04:00");
const liturgyAnchorDate = "2026-06-21";
const liturgyIntervalDays = 14;
const liturgyTimeLabel = "12:00 PM";
const liturgyLocation = "Prince of Peace Catholic Church, 6320 Bennett Rd, Jacksonville, FL 32216";
const supportedLanguages = new Set(["en", "ar"]);

const arabicTranslations = {
  "Saint Thekla": "القديسة تقلا",
  "Saint Thekla Melkite Catholic Community": "جماعة القديسة تقلا الملكية الكاثوليكية",
  "Home": "الرئيسية",
  "Calendar": "التقويم",
  "First Time?": "أول زيارة؟",
  "Bulletins": "النشرات",
  "Bishop": "المطران",
  "Gallery": "المعرض",
  "Connect": "تواصل",
  "Visit": "الزيارة",
  "St Thekla church physical location for now at Prince of Peace Catholic Church": "رعية القديسة تقلا للروم الملكيين الكاثوليك تقام الصلوات بكنيسة امير السلام للروم الكاثوليك بجاكسونفيل",
  "Join WhatsApp": "انضم إلى واتساب",
  "Join our WhatsApp community": "انضم إلى مجتمع واتساب الخاص بنا",
  "Next Divine Liturgy": "القداس الإلهي القادم",
  "Melkite Catholic worship in Jacksonville, Florida": "عبادة ملكية كاثوليكية في جاكسونفيل، فلوريدا",
  "Experience the Beauty of the Melkite Catholic Tradition in Jacksonville.": "اختبر جمال التقليد الملكي الكاثوليكي في جاكسونفيل.",
  "Come pray with a living Eastern Catholic community shaped by icons, chant, incense, Scripture, the Eucharist, and warm hospitality.": "تعالَ للصلاة مع جماعة كاثوليكية شرقية حيّة تتشكل بالأيقونات والترتيل والبخور والكتاب المقدس والإفخارستيا وحسن الضيافة.",
  "Divine Liturgy": "القداس الإلهي",
  "12:00 PM": "١٢:٠٠ ظهرًا",
  "Prince of Peace": "كنيسة أمير السلام",
  "Plan Your Visit": "خطط لزيارتك",
  "Get Directions": "احصل على الاتجاهات",
  "All are welcome. Come as you are, bring your family, and stay afterward for fellowship.": "الجميع مرحب بهم. تعال كما أنت، أحضر عائلتك، وابقَ بعد القداس للشركة.",
  "Time": "الوقت",
  "Place": "المكان",
  "Address": "العنوان",
  "Prince of Peace Catholic Church": "كنيسة أمير السلام الكاثوليكية",
  "6320 Bennett Rd, Jacksonville, FL 32216": "6320 Bennett Rd، جاكسونفيل، فلوريدا 32216",
  "Add to Calendar": "أضف إلى التقويم",
  "Liturgy Schedule": "جدول القداس",
  "Clear dates. Simple next step.": "مواعيد واضحة. خطوة تالية بسيطة.",
  "Divine Liturgy is normally every other Sunday at 12:00 PM at Prince of Peace Catholic Church.": "يُقام القداس الإلهي عادةً كل أحدين في الساعة ١٢:٠٠ ظهرًا في كنيسة أمير السلام الكاثوليكية.",
  "View Full Calendar": "عرض التقويم الكامل",
  "Open Map": "افتح الخريطة",
  "Next": "القادم",
  "Upcoming": "قادم",
  "Welcome": "ترحيب",
  "A Christ-centered community shaped by prayer, beauty, and hospitality.": "جماعة تتمحور حول المسيح وتتشكّل بالصلاة والجمال وحسن الضيافة.",
  "Whether you are Melkite, Eastern Catholic, Roman Catholic, Orthodox, searching, visiting, or simply curious, you are welcome to pray with us. Come as you are and let the Divine Liturgy introduce you to the ancient rhythm of Melkite worship.": "سواء كنت ملكيًا، أو كاثوليكيًا شرقيًا، أو كاثوليكيًا رومانيًا، أو أرثوذكسيًا، أو باحثًا، أو زائرًا، أو مجرد فضولي، فأنت مرحب بك للصلاة معنا. تعال كما أنت ودع القداس الإلهي يعرّفك إلى الإيقاع القديم للعبادة الملكية.",
  "Short welcome from the community": "كلمة ترحيب قصيرة من الجماعة",
  "We are grateful to gather families and friends around the Holy Mysteries, sacred chant, icons, and fellowship. We would be honored to meet you after liturgy.": "نحن ممتنون لأن نجمع العائلات والأصدقاء حول الأسرار المقدسة والترتيل المقدس والأيقونات والشركة. يشرفنا أن نلتقي بك بعد القداس.",
  "First Time Visiting?": "هل تزورنا للمرة الأولى؟",
  "Come as you are. Leave with a real community around you.": "تعال كما أنت. وغادر ومعك جماعة حقيقية من حولك.",
  "New to Melkite worship? Start here. The service is sung and prayerful, children are welcome, and someone will gladly help you follow along.": "هل أنت جديد على العبادة الملكية؟ ابدأ من هنا. الخدمة مرتلة ومصلّية، والأطفال مرحب بهم، وسيُسعد أحدنا أن يساعدك على المتابعة.",
  "Ask a Question": "اسأل سؤالًا",
  "About 60 minutes": "حوالي ٦٠ دقيقة",
  "The Divine Liturgy is sung and prayerful. You can follow along, listen, or simply receive the beauty of the service.": "القداس الإلهي مرتل ومملوء بالصلاة. يمكنك المتابعة، أو الإصغاء، أو ببساطة استقبال جمال الخدمة.",
  "Children are welcome": "الأطفال مرحب بهم",
  "Families are part of parish life. Children are welcome in the liturgy and in fellowship afterward.": "العائلات جزء من حياة الرعية. الأطفال مرحب بهم في القداس وفي الشركة بعده.",
  "Arrive early": "احضر باكرًا",
  "Come a few minutes early to settle in, venerate icons if you wish, and ask questions before the service begins.": "تعال قبل الموعد ببضع دقائق لتستقر، وتكرّم الأيقونات إن رغبت، وتطرح الأسئلة قبل بدء الخدمة.",
  "Stay afterward": "ابقَ بعد القداس",
  "Coffee, food, conversation, and friendship often follow. It is the easiest way to meet the community.": "غالبًا ما يلي القداس قهوة وطعام وحديث وصداقة. إنها أسهل طريقة للتعرّف إلى الجماعة.",
  "Who Are the Melkites?": "من هم الملكيون؟",
  "Eastern Catholics in full communion with Rome.": "كاثوليك شرقيون في شركة كاملة مع روما.",
  "The Melkite Greek Catholic Church preserves the Melkite liturgical tradition, ancient Middle Eastern Christian heritage, and Catholic communion. Our worship is filled with icons, incense, chant, Scripture, and the Eucharist.": "تحافظ كنيسة الروم الملكيين الكاثوليك على التقليد الليتورجي الملكي، والتراث المسيحي الشرقي القديم، والشركة الكاثوليكية. عبادتنا مملوءة بالأيقونات والبخور والترتيل والكتاب المقدس والإفخارستيا.",
  "Learn About the Melkite Church": "تعرّف إلى الكنيسة الملكية",
  "Our Bishop": "مطراننا",
  "Bishop François Beyrouti": "المطران فرنسوا بيروتي",
  "Bishop François Beyrouti serves the Melkite Eparchy of Newton. The official Eparchy page notes his consecration and installation in 2022.": "يخدم المطران فرنسوا بيروتي أبرشية نيوتن الملكية. وتشير صفحة الأبرشية الرسمية إلى سيامته وتنصيبه عام ٢٠٢٢.",
  "Visit the official Eparchy page": "زر صفحة الأبرشية الرسمية",
  "Read the bishop page": "اقرأ صفحة المطران",
  "Community Life": "حياة الجماعة",
  "Real people. Real prayer. Real fellowship.": "أناس حقيقيون. صلاة حقيقية. شركة حقيقية.",
  "Open the Gallery": "افتح المعرض",
  "Families & youth": "العائلات والشباب",
  "A place for children, parents, grandparents, and young adults to grow in faith together.": "مكان للأطفال والآباء والأجداد والشباب لينموا معًا في الإيمان.",
  "Volunteer & serve": "تطوّع واخدم",
  "Help with hospitality, events, music, setup, outreach, and welcoming new visitors.": "ساعد في الضيافة والفعاليات والموسيقى والتحضير والتواصل والترحيب بالزوار الجدد.",
  "Bilingual welcome": "ترحيب بلغتين",
  "Welcome to Saint Thekla. أهلاً وسهلاً بكم في جماعة القديسة تقلا الملكية الكاثوليكية.": "أهلاً وسهلاً بكم في جماعة القديسة تقلا الملكية الكاثوليكية. Welcome to Saint Thekla.",
  "Stay Connected": "ابقَ على تواصل",
  "Join the parish updates list.": "انضم إلى قائمة تحديثات الرعية.",
  "Flocknote is the best way to receive schedule updates, feast day announcements, community events, and service reminders.": "فلوكنوت هو أفضل طريقة لتلقي تحديثات المواعيد وإعلانات الأعياد وفعاليات الجماعة وتذكيرات الخدم.",
  "Join Flocknote": "انضم إلى فلوكنوت",
  "Email Us": "راسلنا",
  "Instagram": "إنستغرام",
  "Support the Mission": "ادعم الرسالة",
  "Serve, invite, and give when ready.": "اخدم، وادعُ الآخرين، وقدّم عندما تكون مستعدًا.",
  "Donation options can be added when the community is ready. For now, invite a friend, volunteer, and help build a welcoming parish home.": "يمكن إضافة خيارات التبرع عندما تكون الجماعة جاهزة. في الوقت الحالي، ادعُ صديقًا، وتطوّع، وساعد في بناء بيت رعوي مرحّب.",
  "Prince of Peace Catholic Church, Jacksonville, FL": "كنيسة أمير السلام الكاثوليكية، جاكسونفيل، فلوريدا",
  "Divine Liturgy every other Sunday at 12:00 PM": "القداس الإلهي كل أحدين في الساعة ١٢:٠٠ ظهرًا",
  "Upcoming liturgies and parish gatherings.": "القداديس واللقاءات الرعوية القادمة.",
  "Divine Liturgy is normally every other Sunday at 12:00 PM at Prince of Peace Catholic Church in Jacksonville.": "يُقام القداس الإلهي عادةً كل أحدين في الساعة ١٢:٠٠ ظهرًا في كنيسة أمير السلام الكاثوليكية في جاكسونفيل.",
  "Next Divine Liturgy Dates": "مواعيد القداس الإلهي القادمة",
  "Confirmed upcoming Sundays": "الآحاد القادمة المؤكدة",
  "Only upcoming Divine Liturgy dates are shown. Past dates are removed automatically.": "تظهر فقط مواعيد القداس الإلهي القادمة. تتم إزالة المواعيد الماضية تلقائيًا.",
  "Live Calendar": "التقويم المباشر",
  "Full parish calendar": "التقويم الكامل للرعية",
  "Use the embedded calendar for updates, feast days, community events, and any schedule changes.": "استخدم التقويم المدمج للتحديثات والأعياد وفعاليات الجماعة وأي تغييرات في المواعيد.",
  "Saint Thekla Melkite Catholic Community is part of the Melkite Greek Catholic Eparchy of Newton.": "جماعة القديسة تقلا الملكية الكاثوليكية هي جزء من أبرشية نيوتن للروم الملكيين الكاثوليك.",
  "Melkite Eparchy of Newton": "أبرشية نيوتن الملكية",
  "Connected to the wider Melkite Catholic Church.": "متصلة بالكنيسة الملكية الكاثوليكية الأوسع.",
  "Bishop François Beyrouti serves as bishop of the Melkite Eparchy of Newton. His ministry connects local Melkite communities across the United States with the wider Eastern Catholic tradition and the life of the Church.": "يخدم المطران فرنسوا بيروتي كأسقف لأبرشية نيوتن الملكية. تربط خدمته الجماعات الملكية المحلية في أنحاء الولايات المتحدة بالتقليد الكاثوليكي الشرقي الأوسع وبحياة الكنيسة.",
  "For the authoritative biography, pastoral information, and official updates, visitors should use the official Eparchy page.": "للسيرة الرسمية والمعلومات الرعوية والتحديثات الرسمية، ينبغي للزوار استخدام صفحة الأبرشية الرسمية.",
  "Official Eparchy Page": "صفحة الأبرشية الرسمية",
  "Melkite.org": "Melkite.org",
  "Community Gallery": "معرض الجماعة",
  "Life at Saint Thekla.": "الحياة في القديسة تقلا.",
  "Divine Liturgy, sacred tradition, shared meals, and the people building a Melkite Catholic home in Jacksonville.": "القداس الإلهي، والتقليد المقدس، والموائد المشتركة، والأشخاص الذين يبنون بيتًا ملكيًا كاثوليكيًا في جاكسونفيل.",
  "Follow on Facebook": "تابعنا على فيسبوك",
  "Loading the latest photos...": "جارٍ تحميل أحدث الصور...",
  "Recent Moments": "لحظات حديثة",
  "Worship, fellowship, and parish life.": "العبادة والشركة وحياة الرعية.",
  "Choose any photo to view the complete fitted image directly on this website.": "اختر أي صورة لعرضها كاملة ومناسبة مباشرة على هذا الموقع.",
  "Loading gallery photos...": "جارٍ تحميل صور المعرض...",
  "Parish Bulletins": "نشرات الرعية",
  "Bulletins organized by date.": "النشرات مرتبة حسب التاريخ.",
  "Choose a dated bulletin to open the PDF in a new tab and download a copy.": "اختر نشرة بتاريخها لفتح ملف PDF في تبويب جديد وتنزيل نسخة.",
  "Bulletin Archive": "أرشيف النشرات",
  "Latest first": "الأحدث أولاً",
  "Tap a date to open the bulletin PDF.": "اضغط على تاريخ لفتح ملف النشرة بصيغة PDF.",
  "No bulletins have been added yet.": "لم تتم إضافة نشرات بعد.",
  "Add PDFs to": "أضف ملفات PDF إلى",
  "and register them in": "وسجّلها في",
  "Cookie Policy": "سياسة ملفات تعريف الارتباط",
  "We use basic cookies and local storage to remember site preferences and improve your browsing experience.": "نستخدم ملفات تعريف ارتباط أساسية والتخزين المحلي لتذكّر تفضيلات الموقع وتحسين تجربة التصفح.",
  "Accept": "قبول",
  "Decline": "رفض",
  "Back to top": "العودة إلى الأعلى",
  "Open navigation": "افتح التنقل",
  "Saint Thekla Melkite Catholic Community home": "الصفحة الرئيسية لجماعة القديسة تقلا الملكية الكاثوليكية",
  "Saint Thekla Melkite Catholic Community emblem": "شعار جماعة القديسة تقلا الملكية الكاثوليكية",
  "Saint Thekla Melkite Catholic Community in Jacksonville, Florida": "جماعة القديسة تقلا الملكية الكاثوليكية في جاكسونفيل، فلوريدا",
  "Saint Thekla Melkite Catholic Community banner": "لافتة جماعة القديسة تقلا الملكية الكاثوليكية",
  "Divine Liturgy quick facts": "حقائق سريعة عن القداس الإلهي",
  "Next Divine Liturgy details": "تفاصيل القداس الإلهي القادم",
  "Saint Thekla Melkite Catholic Community icon emblem": "أيقونة شعار جماعة القديسة تقلا الملكية الكاثوليكية",
  "Upcoming Divine Liturgy dates": "مواعيد القداس الإلهي القادمة",
  "Saint Thekla community photos": "صور جماعة القديسة تقلا",
  "Saint Thekla community gathering": "تجمّع جماعة القديسة تقلا",
  "Saint Thekla liturgy and fellowship": "قداس وشركة جماعة القديسة تقلا",
  "Saint Thekla community life": "حياة جماعة القديسة تقلا",
  "Map to Prince of Peace Catholic Church": "خريطة إلى كنيسة أمير السلام الكاثوليكية",
  "Saint Thekla Melkite Catholic Community Calendar": "تقويم جماعة القديسة تقلا الملكية الكاثوليكية",
  "Bishop François Beyrouti in vestments before icons": "المطران فرنسوا بيروتي بالثياب الكهنوتية أمام الأيقونات",
  "Close photo viewer": "أغلق عارض الصور",
  "Previous photo": "الصورة السابقة",
  "Next photo": "الصورة التالية",
  "Bulletin list": "قائمة النشرات",
  "Latest bulletin": "أحدث نشرة",
  "Bulletin": "نشرة",
  "Open PDF": "افتح PDF",
  "Open and download bulletin from": "افتح وحمّل النشرة بتاريخ",
  "Date not set": "لم يتم تحديد التاريخ",
  "Bulletins temporarily unavailable.": "النشرات غير متاحة مؤقتًا.",
  "The bulletin archive could not be loaded.": "تعذر تحميل أرشيف النشرات.",
  "Gallery temporarily unavailable.": "المعرض غير متاح مؤقتًا.",
  "The local photo gallery is temporarily unavailable.": "معرض الصور المحلي غير متاح مؤقتًا.",
  "Community gallery": "معرض الجماعة",
  "Saint Thekla community": "جماعة القديسة تقلا",
  "Saint Thekla community photo": "صورة من جماعة القديسة تقلا",
  "Community life at Saint Thekla": "حياة الجماعة في القديسة تقلا",
  "community photos": "صور من حياة الجماعة",
  "Open photo:": "افتح الصورة:",
  "Saint Thekla Divine Liturgy": "قداس القديسة تقلا الإلهي",
  "Melkite Catholic Divine Liturgy with Saint Thekla Melkite Catholic Community.": "القداس الإلهي الملكي الكاثوليكي مع جماعة القديسة تقلا الملكية الكاثوليكية.",
  "Paraklesis Service invitation": "دعوة صلاة البراكليسي",
  "Close popup": "أغلق النافذة",
  "Saint Thekla Paraklesis Service invitation for Saturday August 1 2026 at 6:30 PM at Christ the Prince of Peace": "دعوة جماعة القديسة تقلا إلى صلاة البراكليسي يوم السبت ١ آب ٢٠٢٦ الساعة ٦:٣٠ مساءً في كنيسة المسيح أمير السلام",
  "Saint Thekla Melkite Catholic Community | Melkite Catholic Church in Jacksonville, FL": "جماعة القديسة تقلا الملكية الكاثوليكية | كنيسة ملكية كاثوليكية في جاكسونفيل، فلوريدا",
  "Saint Thekla Melkite Catholic Community is a Melkite Catholic community in Jacksonville, Florida. Join Divine Liturgy every other Sunday at 12:00 PM.": "جماعة القديسة تقلا الملكية الكاثوليكية هي جماعة ملكية كاثوليكية في جاكسونفيل، فلوريدا. انضم إلى القداس الإلهي كل أحدين في الساعة ١٢:٠٠ ظهرًا.",
  "Calendar | Saint Thekla Melkite Catholic Community": "التقويم | جماعة القديسة تقلا الملكية الكاثوليكية",
  "Calendar for Saint Thekla Melkite Catholic Community in Jacksonville, Florida, including upcoming Divine Liturgy dates.": "تقويم جماعة القديسة تقلا الملكية الكاثوليكية في جاكسونفيل، فلوريدا، بما في ذلك مواعيد القداس الإلهي القادمة.",
  "Our Bishop | Saint Thekla Melkite Catholic Community": "مطراننا | جماعة القديسة تقلا الملكية الكاثوليكية",
  "Learn about Bishop François Beyrouti and the Melkite Eparchy of Newton through Saint Thekla Melkite Catholic Community.": "تعرّف إلى المطران فرنسوا بيروتي وأبرشية نيوتن الملكية من خلال جماعة القديسة تقلا الملكية الكاثوليكية.",
  "Gallery | Saint Thekla Melkite Catholic Community": "المعرض | جماعة القديسة تقلا الملكية الكاثوليكية",
  "See worship, fellowship, and community life at Saint Thekla Melkite Catholic Community in Jacksonville, Florida.": "شاهد العبادة والشركة وحياة الجماعة في جماعة القديسة تقلا الملكية الكاثوليكية في جاكسونفيل، فلوريدا.",
  "Bulletins | Saint Thekla Melkite Catholic Community": "النشرات | جماعة القديسة تقلا الملكية الكاثوليكية",
  "Read and download Saint Thekla Melkite Catholic Community bulletins by date.": "اقرأ وحمّل نشرات جماعة القديسة تقلا الملكية الكاثوليكية حسب التاريخ."
};

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
const translatableAttributes = ["aria-label", "alt", "title", "content"];
let activeLanguage = getSavedLanguage();
let languageToggleButton;
const originalDocumentTitle = document.title;

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return supportedLanguages.has(savedLanguage) ? savedLanguage : "en";
  } catch (error) {
    return "en";
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch (error) {
    // Private browsing can block storage; the switch still works for the page.
  }
}

function normalizeTranslationKey(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function translate(value, language = activeLanguage) {
  if (language !== "ar") return value;
  return arabicTranslations[normalizeTranslationKey(value)] || value;
}

function getDateLocale() {
  return activeLanguage === "ar" ? "ar" : "en-US";
}

function getLiturgyTimeLabel() {
  return activeLanguage === "ar" ? translate(liturgyTimeLabel) : liturgyTimeLabel;
}

function formatFullDate(date) {
  return new Intl.DateTimeFormat(getDateLocale(), {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatWeekdayDate(date) {
  return new Intl.DateTimeFormat(getDateLocale(), {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(getDateLocale(), {
    month: "long",
    day: "numeric",
  }).format(date);
}

function shouldTranslateTextNode(node) {
  const parent = node.parentElement;
  if (!parent || !normalizeTranslationKey(node.nodeValue)) return false;
  if (parent.closest("[data-no-translate]")) return false;
  return !["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "TEXTAREA"].includes(parent.tagName);
}

function applyTextTranslations() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (shouldTranslateTextNode(node)) {
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
      const originalValue = originalTextNodes.get(node);
      const leading = originalValue.match(/^\s*/)?.[0] || "";
      const trailing = originalValue.match(/\s*$/)?.[0] || "";
      const key = normalizeTranslationKey(originalValue);
      node.nodeValue = activeLanguage === "ar" ? `${leading}${translate(key)}${trailing}` : originalValue;
    }

    node = walker.nextNode();
  }
}

function getOriginalAttribute(element, attributeName) {
  let attributeMap = originalAttributes.get(element);
  if (!attributeMap) {
    attributeMap = new Map();
    originalAttributes.set(element, attributeMap);
  }

  if (!attributeMap.has(attributeName)) {
    attributeMap.set(attributeName, element.getAttribute(attributeName));
  }

  return attributeMap.get(attributeName);
}

function shouldTranslateAttribute(element, attributeName) {
  if (element.closest?.("[data-no-translate]")) return false;
  if (attributeName === "content") {
    return element.matches('meta[name="description"]');
  }

  return true;
}

function applyAttributeTranslations() {
  const selector = translatableAttributes.map((attributeName) => `[${attributeName}]`).join(",");

  document.querySelectorAll(selector).forEach((element) => {
    translatableAttributes.forEach((attributeName) => {
      if (!element.hasAttribute(attributeName) || !shouldTranslateAttribute(element, attributeName)) return;

      const originalValue = getOriginalAttribute(element, attributeName);
      if (!originalValue) return;
      element.setAttribute(attributeName, activeLanguage === "ar" ? translate(originalValue) : originalValue);
    });
  });
}

function updateLanguageToggle() {
  if (!languageToggleButton) return;

  languageToggleButton.dataset.language = activeLanguage;
  languageToggleButton.setAttribute("aria-pressed", String(activeLanguage === "ar"));
  languageToggleButton.setAttribute(
    "aria-label",
    activeLanguage === "ar" ? "التبديل إلى الإنجليزية" : "Switch to Arabic",
  );
}

function createLanguageToggle() {
  if (!header || !menuToggle || header.querySelector("[data-language-toggle]")) return;

  languageToggleButton = document.createElement("button");
  languageToggleButton.type = "button";
  languageToggleButton.className = "language-toggle";
  languageToggleButton.dataset.languageToggle = "";
  languageToggleButton.dataset.noTranslate = "";
  languageToggleButton.innerHTML = `
    <span>EN</span>
    <span>عربي</span>
    <i aria-hidden="true"></i>
  `;

  languageToggleButton.addEventListener("click", () => {
    setLanguage(activeLanguage === "ar" ? "en" : "ar");
  });

  header.insertBefore(languageToggleButton, menuToggle);
  updateLanguageToggle();
}

function setLanguage(language, shouldSave = true) {
  activeLanguage = supportedLanguages.has(language) ? language : "en";
  if (shouldSave) saveLanguage(activeLanguage);

  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = activeLanguage === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("is-arabic", activeLanguage === "ar");
  document.title = activeLanguage === "ar" ? translate(originalDocumentTitle) : originalDocumentTitle;

  renderUpcomingLiturgies();
  applyTextTranslations();
  applyAttributeTranslations();
  updateLanguageToggle();

  window.dispatchEvent(
    new CustomEvent("saintthekla:languagechange", {
      detail: { language: activeLanguage },
    }),
  );
}

window.saintTheklaI18n = {
  getLanguage: () => activeLanguage,
  getLocale: getDateLocale,
  getTimeLabel: getLiturgyTimeLabel,
  translate,
  setLanguage,
};

function syncChrome() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  topButton.classList.toggle("is-visible", window.scrollY > 520);
}

function createLocalDate(dateString, hour = 12) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, hour, 0, 0);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatCalendarDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function createCalendarUrl(date) {
  const datePart = formatCalendarDate(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: translate("Saint Thekla Divine Liturgy"),
    dates: `${datePart}T120000/${datePart}T130000`,
    ctz: "America/New_York",
    details: translate("Melkite Catholic Divine Liturgy with Saint Thekla Melkite Catholic Community."),
    location: liturgyLocation,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getUpcomingLiturgies(count) {
  const now = new Date();
  const upcoming = [];
  let candidate = createLocalDate(liturgyAnchorDate);

  while (candidate < now) {
    candidate = addDays(candidate, liturgyIntervalDays);
  }

  for (let index = 0; index < count; index += 1) {
    upcoming.push(new Date(candidate));
    candidate = addDays(candidate, liturgyIntervalDays);
  }

  return upcoming;
}

function renderUpcomingLiturgies() {
  const dateLists = document.querySelectorAll("[data-upcoming-liturgies]");
  const highestCount = Math.max(1, ...Array.from(dateLists, (list) => Number(list.dataset.count) || 4));
  const upcoming = getUpcomingLiturgies(highestCount);
  const nextLiturgy = upcoming[0];
  const timeLabel = getLiturgyTimeLabel();

  document.querySelectorAll("[data-next-liturgy-label]").forEach((element) => {
    element.textContent = translate("Next Divine Liturgy");
  });

  document.querySelectorAll("[data-next-liturgy-short]").forEach((element) => {
    element.textContent = `${formatShortDate(nextLiturgy)} • ${timeLabel}`;
  });

  document.querySelectorAll("[data-next-liturgy-day]").forEach((element) => {
    element.textContent = formatWeekdayDate(nextLiturgy);
  });

  document.querySelectorAll("[data-next-liturgy-calendar]").forEach((element) => {
    element.setAttribute("href", createCalendarUrl(nextLiturgy));
  });

  dateLists.forEach((list) => {
    const count = Number(list.dataset.count) || 4;
    list.innerHTML = upcoming
      .slice(0, count)
      .map(
        (date, index) => `
          <article>
            <span>${index === 0 ? translate("Next") : translate("Upcoming")}</span>
            <strong>${formatFullDate(date)}</strong>
            <small>${timeLabel}</small>
          </article>
        `,
      )
      .join("");
  });
}

function createCookieBanner() {
  if (localStorage.getItem(cookieStorageKey)) return;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie policy notice");
  banner.innerHTML = `
    <div>
      <strong>Cookie Policy</strong>
      <p>We use basic cookies and local storage to remember site preferences and improve your browsing experience.</p>
    </div>
    <div class="cookie-actions">
      <button type="button" class="cookie-accept" data-cookie-choice="accepted">Accept</button>
      <button type="button" class="cookie-decline" data-cookie-choice="declined">Decline</button>
    </div>
  `;

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-choice]");
    if (!button) return;

    localStorage.setItem(cookieStorageKey, button.dataset.cookieChoice);
    banner.classList.add("is-hiding");
    window.setTimeout(() => banner.remove(), 220);
  });

  document.body.appendChild(banner);
}

function createEventPopup() {
  const eventPopupExpiresIn = eventPopupExpiresAt - Date.now();
  if (eventPopupExpiresIn <= 0) return;

  const popup = document.createElement("section");
  popup.className = "event-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-label", "Paraklesis Service invitation");
  popup.innerHTML = `
    <div class="event-popup-dialog">
      <button type="button" class="event-popup-close" data-event-popup-close aria-label="Close popup">×</button>
      <img class="event-popup-image" src="${eventPopupImage}" alt="Saint Thekla Paraklesis Service invitation for Saturday August 1 2026 at 6:30 PM at Christ the Prince of Peace">
    </div>
  `;

  let expirationTimer;
  let isClosing = false;

  const closePopup = () => {
    if (isClosing) return;
    isClosing = true;
    window.clearTimeout(expirationTimer);
    popup.classList.add("is-hiding");
    document.body.classList.remove("has-event-popup");
    window.removeEventListener("keydown", handleKeydown);
    window.setTimeout(() => popup.remove(), 180);
  };

  function handleKeydown(event) {
    if (event.key === "Escape") closePopup();
  }

  popup.addEventListener("click", (event) => {
    if (event.target === popup || event.target.closest("[data-event-popup-close]")) {
      closePopup();
    }
  });

  document.body.appendChild(popup);
  document.body.classList.add("has-event-popup");
  window.requestAnimationFrame(() => popup.classList.add("is-visible"));
  window.addEventListener("keydown", handleKeydown);
  expirationTimer = window.setTimeout(closePopup, eventPopupExpiresIn);
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", syncChrome, { passive: true });
syncChrome();
createLanguageToggle();
createEventPopup();
createCookieBanner();
setLanguage(activeLanguage, false);
