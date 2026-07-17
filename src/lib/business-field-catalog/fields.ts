import type { BusinessFieldDefinition } from "./types";

type FieldSeed = {
  key: string;
  name: string;
  nameAr?: string;
  desc: string;
  category: string;
  archetype?: string;
  aliases?: string[];
  aliasesAr?: string[];
  misspellings?: string[];
  keywords?: string[];
  examples?: string[];
  purposes?: string[];
  domains?: string[];
  capabilities?: string[];
  ssic?: string;
  isic?: string;
  naics?: string;
  parent?: string;
  regulated?: string;
};

function f(seed: FieldSeed): BusinessFieldDefinition {
  return {
    key: seed.key,
    displayNameEn: seed.name,
    displayNameAr: seed.nameAr,
    description: seed.desc,
    categoryKey: seed.category,
    parentFieldKey: seed.parent ?? null,
    childActivityKeys: [],
    aliasesEn: seed.aliases ?? [],
    aliasesAr: seed.aliasesAr ?? [],
    misspellings: seed.misspellings ?? [],
    searchKeywords: seed.keywords ?? [],
    exampleBusinesses: seed.examples ?? [],
    businessPurposeHints: seed.purposes ?? [],
    relatedSpecialistDomainKeys: seed.domains ?? [],
    relatedCapabilityKeys: seed.capabilities ?? [],
    relatedIndustryArchetypeKey: seed.archetype ?? null,
    crosswalk: { ssic: seed.ssic, isic: seed.isic, naics: seed.naics },
    regulatedNote: seed.regulated,
    status: "ACTIVE",
  };
}

const seeds: FieldSeed[] = [
  // Agriculture
  { key: "crop_farming", name: "Crop farming", nameAr: "زراعة المحاصيل", desc: "Growing grains, vegetables, fruits, and field crops.", category: "agriculture_natural_resources", archetype: "manufacturing_and_industrial", aliases: ["farming", "agriculture", "farm"], aliasesAr: ["مزرعة", "زراعة"], examples: ["Wheat farm", "Date palm orchard"], purposes: ["produce_goods"], ssic: "0111", isic: "0111" },
  { key: "livestock_ranching", name: "Livestock and ranching", nameAr: "تربية الماشية", desc: "Cattle, sheep, poultry, and animal husbandry.", category: "agriculture_natural_resources", aliases: ["ranch", "dairy farm", "poultry"], examples: ["Cattle ranch", "Dairy cooperative"] },
  { key: "fishing_aquaculture", name: "Fishing and aquaculture", nameAr: "الصيد والاستزراع المائي", desc: "Commercial fishing, fish farms, and seafood production.", category: "agriculture_natural_resources", aliases: ["fish farm", "seafood", "aquaculture"], examples: ["Shrimp farm", "Coastal fishing fleet"] },
  { key: "forestry_logging", name: "Forestry and logging", nameAr: "الغابات والقطع", desc: "Timber, forestry management, and wood harvesting.", category: "agriculture_natural_resources", aliases: ["timber", "logging", "forestry"] },

  // Manufacturing
  { key: "food_beverage_manufacturing", name: "Food and beverage manufacturing", nameAr: "تصنيع الأغذية والمشروبات", desc: "Processing, packaging, and producing food products.", category: "manufacturing_production", archetype: "manufacturing_and_industrial", aliases: ["food factory", "beverage plant", "food processing"], examples: ["Bottling plant", "Bakery production"] },
  { key: "metal_fabrication", name: "Metal fabrication", nameAr: "تصنيع المعادن", desc: "Metalworking, welding, and structural fabrication.", category: "manufacturing_production", archetype: "manufacturing_and_industrial", aliases: ["metal shop", "fabrication", "steel works"] },
  { key: "electronics_manufacturing", name: "Electronics manufacturing", nameAr: "تصنيع الإلكترونيات", desc: "Assembly and production of electronic devices.", category: "manufacturing_production", archetype: "manufacturing_and_industrial", aliases: ["PCB assembly", "electronics factory"] },
  { key: "textile_apparel_manufacturing", name: "Textile and apparel manufacturing", nameAr: "تصنيع المنسوجات والملابس", desc: "Fabrics, garments, and textile production.", category: "manufacturing_production", aliases: ["garment factory", "textile mill", "clothing manufacturer"] },
  { key: "chemical_pharmaceutical_manufacturing", name: "Chemical and pharmaceutical manufacturing", nameAr: "التصنيع الكيميائي والدوائي", desc: "Chemicals, medicines, and regulated production.", category: "manufacturing_production", regulated: "May require regulatory compliance tracking.", aliases: ["pharma plant", "chemical plant"] },

  // Construction
  { key: "general_contracting", name: "General contracting", nameAr: "المقاولات العامة", desc: "Building construction and civil project delivery.", category: "construction_engineering", archetype: "construction_and_epc", aliases: ["contractor", "builder", "construction company", "construction contractor", "مقاول"], misspellings: ["contruction", "contracter"], examples: ["Commercial builder", "Residential contractor"], purposes: ["deliver_projects"], ssic: "4100", isic: "4100" },
  { key: "epc_industrial_contracting", name: "EPC and industrial contracting", nameAr: "مقاولات EPC صناعية", desc: "Engineering, procurement, and construction for industrial projects.", category: "construction_engineering", archetype: "construction_and_epc", aliases: ["EPC", "industrial contractor", "turnkey contractor"], parent: "general_contracting", purposes: ["deliver_projects"], ssic: "4100" },
  { key: "trade_subcontracting", name: "Trade subcontracting", nameAr: "مقاولات باطن متخصصة", desc: "Specialized subcontracting for construction trades.", category: "construction_engineering", archetype: "construction_and_epc", aliases: ["subcontractor", "specialty contractor", "sub contractor", "مقاول باطن"], parent: "general_contracting", purposes: ["deliver_projects"] },
  { key: "civil_engineering", name: "Civil engineering", nameAr: "الهندسة المدنية", desc: "Infrastructure, roads, bridges, and civil works.", category: "construction_engineering", archetype: "construction_and_epc", aliases: ["infrastructure", "civil works", "road construction"] },
  { key: "mep_contracting", name: "MEP contracting", nameAr: "مقاولات الميكانيك والكهرباء", desc: "Mechanical, electrical, and plumbing contracting.", category: "construction_engineering", archetype: "construction_and_epc", aliases: ["electrical contractor", "HVAC contractor", "plumbing"] },
  { key: "interior_fitout", name: "Interior fit-out", nameAr: "التشطيبات الداخلية", desc: "Interior finishing, joinery, and commercial fit-out.", category: "construction_engineering", aliases: ["fit out", "fitout", "interior design build"] },

  // Wholesale
  { key: "wholesale_trading", name: "Wholesale trading", nameAr: "تجارة الجملة", desc: "B2B trading, import/export, and bulk distribution.", category: "wholesale_distribution", aliases: ["wholesaler", "distributor", "trading company", "موزع"], examples: ["Electronics wholesaler", "Food distributor"] },
  { key: "import_export", name: "Import and export", nameAr: "الاستيراد والتصدير", desc: "Cross-border trade and customs coordination.", category: "wholesale_distribution", aliases: ["trading", "export house", "import agency"] },

  // Retail
  { key: "retail_store", name: "Retail store", nameAr: "متجر تجزئة", desc: "Physical shops and multi-branch retail.", category: "retail_ecommerce", archetype: "retail_and_commerce", aliases: ["shop", "store", "boutique", "متجر"], examples: ["Fashion boutique", "Grocery chain"], purposes: ["sell_products"], ssic: "4711" },
  { key: "ecommerce_online_retail", name: "E-commerce and online retail", nameAr: "التجارة الإلكترونية", desc: "Online stores, marketplaces, and digital retail.", category: "retail_ecommerce", archetype: "retail_and_commerce", aliases: ["online shop", "online store", "ecommerce", "e-commerce", "web store", "Instagram store", "social media store", "متجر إلكتروني"], misspellings: ["ecomerce", "ecom"], keywords: ["instagram", "snapchat", "tiktok shop"], examples: ["D2C brand", "Online marketplace seller"], purposes: ["sell_products"], ssic: "4791" },
  { key: "marketplace_seller", name: "Marketplace and platform seller", nameAr: "بائع على المنصات", desc: "Selling through Amazon, Noon, Haraj, or other marketplaces.", category: "retail_ecommerce", archetype: "retail_and_commerce", aliases: ["marketplace seller", "platform seller", "online seller", "بائع منصات"], parent: "ecommerce_online_retail", purposes: ["sell_products"], ssic: "4791" },
  { key: "supermarket_grocery", name: "Supermarket and grocery", nameAr: "سوبرماركت وبقالة", desc: "Grocery retail and convenience stores.", category: "retail_ecommerce", archetype: "retail_and_commerce", aliases: ["grocery", "supermarket", "convenience store", "بقالة"] },
  { key: "pharmacy_retail", name: "Pharmacy retail", nameAr: "صيدلية تجزئة", desc: "Pharmacies and health product retail.", category: "retail_ecommerce", aliases: ["pharmacy", "drugstore", "صيدلية"], regulated: "Pharmacy operations may require compliance controls." },

  // Transport & logistics
  { key: "freight_logistics", name: "Freight and logistics", nameAr: "الشحن واللوجستيات", desc: "Freight forwarding, 3PL, and supply chain logistics.", category: "transport_logistics", archetype: "logistics_and_fleet", aliases: ["logistics", "freight", "3PL", "shipping company", "لوجستيات"], misspellings: ["logisitcs"], examples: ["Freight forwarder", "Warehouse operator"], purposes: ["manage_logistics"], ssic: "4923" },
  { key: "warehouse_fulfillment", name: "Warehouse and fulfillment", nameAr: "المستودعات والتجهيز", desc: "Warehousing, pick-pack, and e-commerce fulfillment centers.", category: "transport_logistics", archetype: "logistics_and_fleet", aliases: ["warehouse", "fulfillment center", "distribution center", "مستودع"], parent: "freight_logistics", purposes: ["manage_logistics"], ssic: "5210" },
  { key: "customs_brokerage", name: "Customs brokerage and clearance", nameAr: "الوساطة الجمركية", desc: "Customs clearance, import documentation, and brokerage.", category: "wholesale_distribution", aliases: ["customs broker", "customs clearance", "clearance agent", "جمرك"], purposes: ["manage_logistics"], ssic: "5229" },
  { key: "last_mile_delivery", name: "Last-mile delivery", nameAr: "التوصيل للعميل", desc: "Courier, parcel, and on-demand delivery services.", category: "transport_logistics", archetype: "logistics_and_fleet", aliases: ["courier", "delivery service", "parcel delivery", "توصيل"] },
  { key: "passenger_transport", name: "Passenger transport", nameAr: "نقل الركاب", desc: "Taxi, bus, ride-hailing, and passenger mobility.", category: "transport_logistics", archetype: "logistics_and_fleet", aliases: ["taxi", "bus operator", "ride hailing", "نقل ركاب"] },
  { key: "fleet_management", name: "Fleet management", nameAr: "إدارة الأساطيل", desc: "Fleet operations, leasing, and vehicle coordination.", category: "transport_logistics", archetype: "logistics_and_fleet", aliases: ["fleet operator", "vehicle fleet", "أسطول"] },

  // Hospitality & food
  { key: "hotel_hospitality", name: "Hotel and hospitality", nameAr: "الفنادق والضيافة", desc: "Hotels, resorts, and lodging operations.", category: "hospitality_food", archetype: "hospitality_and_tourism", aliases: ["hotel", "resort", "lodging", "فندق"], examples: ["Boutique hotel", "Resort chain"], ssic: "5510" },
  { key: "short_stay_accommodation", name: "Short-stay and serviced accommodation", nameAr: "إقامة قصيرة", desc: "Apartments, serviced units, and short-term rental operations.", category: "hospitality_food", archetype: "hospitality_and_tourism", aliases: ["short stay", "serviced apartment", "holiday rental", "Airbnb host", "إقامة"], parent: "hotel_hospitality", ssic: "5510" },
  { key: "restaurant_food_service", name: "Restaurant and food service", nameAr: "المطاعم وخدمات الطعام", desc: "Restaurants, cafés, and food service operators.", category: "hospitality_food", archetype: "food_service", aliases: ["restaurant", "cafe", "café", "coffee shop", "catering", "مطعم", "قهوة"], misspellings: ["resturant"], keywords: ["dining", "food service"], examples: ["Fine dining", "Cloud kitchen"], purposes: ["sell_products"], ssic: "5610" },
  { key: "cloud_kitchen", name: "Cloud kitchen and delivery-only food", nameAr: "مطبخ سحابي", desc: "Delivery-only kitchens, ghost kitchens, and virtual brands.", category: "hospitality_food", archetype: "food_service", aliases: ["cloud kitchen", "ghost kitchen", "dark kitchen", "virtual restaurant", "مطبخ سحابي"], parent: "restaurant_food_service", purposes: ["sell_products"], ssic: "5610" },
  { key: "catering_events_food", name: "Catering for events", nameAr: "تموين الفعاليات", desc: "Event catering and banquet services.", category: "hospitality_food", archetype: "food_service", aliases: ["catering", "banquet", "event catering"] },

  // Real estate
  { key: "property_management", name: "Property management", nameAr: "إدارة العقارات", desc: "Managing residential and commercial properties.", category: "real_estate_property", archetype: "property_and_facilities", aliases: ["property manager", "building management", "إدارة عقارات"] },
  { key: "real_estate_brokerage", name: "Real estate brokerage", nameAr: "وساطة عقارية", desc: "Sales and leasing brokerage.", category: "real_estate_property", archetype: "property_and_facilities", aliases: ["realtor", "estate agent", "broker", "وسيط عقاري"] },
  { key: "facilities_management", name: "Facilities management", nameAr: "إدارة المرافق", desc: "Integrated facilities and building operations.", category: "real_estate_property", archetype: "property_and_facilities", aliases: ["FM", "facilities operator"] },

  // Professional services
  { key: "management_consulting", name: "Management consulting", nameAr: "الاستشارات الإدارية", desc: "Strategy, operations, and business advisory.", category: "professional_services", archetype: "professional_services", aliases: ["consulting", "consultancy", "advisory", "استشارات"], examples: ["Strategy firm", "Operations consultant"], purposes: ["provide_professional_services"], ssic: "7020" },
  { key: "engineering_consulting", name: "Engineering consulting", nameAr: "الاستشارات الهندسية", desc: "Design, engineering advisory, and technical consulting.", category: "professional_services", archetype: "professional_services", aliases: ["engineering firm", "design consultant"] },
  { key: "architecture_design_practice", name: "Architecture and design practice", nameAr: "مكتب هندسة معمارية", desc: "Architectural design, master planning, and design offices.", category: "professional_services", archetype: "professional_services", aliases: ["architecture office", "architect", "design practice", "هندسة معمارية"], ssic: "7110" },
  { key: "hr_recruitment_agency", name: "HR and recruitment agency", nameAr: "الموارد البشرية والتوظيف", desc: "Staffing, recruitment, and HR outsourcing.", category: "professional_services", archetype: "professional_services", aliases: ["recruitment", "staffing agency", "headhunter", "توظيف"] },

  // Legal & accounting
  { key: "legal_practice", name: "Legal practice", nameAr: "الممارسة القانونية", desc: "Law firms and legal advisory services.", category: "legal_accounting", archetype: "professional_services", aliases: ["law firm", "law office", "lawyer", "attorney", "legal office", "محاماة"], regulated: "Legal practice may require matter confidentiality controls.", ssic: "6910" },
  { key: "accounting_audit", name: "Accounting and audit", nameAr: "المحاسبة والتدقيق", desc: "Accounting firms, audit, and tax advisory.", category: "legal_accounting", archetype: "professional_services", aliases: ["accountant", "audit firm", "CPA", "محاسبة"], ssic: "6920" },

  // Technology
  { key: "software_saas", name: "Software and SaaS", nameAr: "البرمجيات والخدمات السحابية", desc: "Software products, SaaS platforms, and app businesses.", category: "technology_software", archetype: "technology_and_saas", aliases: ["SaaS", "software company", "app startup", "برمجيات"], examples: ["B2B SaaS", "Mobile app studio"], purposes: ["sell_products", "provide_professional_services"], ssic: "6201" },
  { key: "it_managed_services", name: "IT managed services", nameAr: "خدمات تقنية المعلومات المُدارة", desc: "MSP, helpdesk, and infrastructure support.", category: "technology_software", archetype: "technology_and_saas", aliases: ["MSP", "managed IT", "IT support", "IT company", "دعم تقني"] },
  { key: "cloud_data_hosting", name: "Cloud, data and hosting services", nameAr: "السحابة واستضافة البيانات", desc: "Hosting, cloud infrastructure, and data center operations.", category: "technology_software", archetype: "technology_and_saas", aliases: ["hosting", "data center", "cloud provider", "استضافة"], ssic: "6311" },
  { key: "web_digital_agency", name: "Web and digital agency", nameAr: "وكالة ويب رقمية", desc: "Web development, apps, and digital delivery shops.", category: "technology_software", archetype: "technology_and_saas", aliases: ["web agency", "dev shop", "digital studio"] },

  // Cybersecurity
  { key: "cybersecurity_mssp", name: "Cybersecurity and MSSP", nameAr: "الأمن السيبراني", desc: "Security operations, SOC, and cyber consulting.", category: "cybersecurity_it_services", archetype: "technology_and_saas", aliases: ["MSSP", "SOC", "cyber security", "cybersecurity company", "infosec", "أمن سيبراني"], misspellings: ["cybersecuirty"], regulated: "Security services often require segregation of duties.", ssic: "6202" },
  { key: "penetration_testing", name: "Penetration testing", nameAr: "اختبار الاختراق", desc: "Offensive security testing and red team services.", category: "cybersecurity_it_services", aliases: ["pentest", "red team", "ethical hacking"] },

  // Telecom
  { key: "telecom_operator", name: "Telecom operator", nameAr: "مشغل اتصالات", desc: "Telecom networks and connectivity services.", category: "telecommunications", aliases: ["ISP", "telecom", "mobile operator", "اتصالات"] },
  { key: "network_infrastructure", name: "Network infrastructure services", nameAr: "بنية الشبكات", desc: "Network design, installation, and maintenance.", category: "telecommunications", aliases: ["network integrator", "fiber installer"] },

  // Media
  { key: "news_publishing", name: "News and publishing", nameAr: "الأخبار والنشر", desc: "Newsrooms, publishers, and editorial operations.", category: "media_publishing", archetype: "media_and_creative", aliases: ["publisher", "newsroom", "magazine", "نشر"] },
  { key: "digital_content_media", name: "Digital content and media", nameAr: "المحتوى الرقمي", desc: "Digital media, blogs, and content platforms.", category: "media_publishing", archetype: "media_and_creative", aliases: ["content platform", "digital media", "محتوى"] },
  { key: "content_creator_influencer", name: "Content creator and influencer", nameAr: "صانع محتوى ومؤثر", desc: "Creators, influencers, and personal media brands.", category: "media_publishing", archetype: "media_and_creative", aliases: ["content creator", "influencer", "YouTuber", "streamer", "صانع محتوى"], purposes: ["produce_content"], ssic: "5911" },

  // Film & video
  { key: "film_production", name: "Film production", nameAr: "إنتاج الأفلام", desc: "Feature films, commercials, and video production.", category: "film_video_production", archetype: "media_and_creative", aliases: ["production house", "video production", "film studio", "إنتاج"], purposes: ["produce_content"], ssic: "5911" },
  { key: "post_production", name: "Post-production", nameAr: "ما بعد الإنتاج", desc: "Editing, VFX, color, and finishing.", category: "film_video_production", archetype: "media_and_creative", aliases: ["editing studio", "VFX", "post house"] },

  // Music
  { key: "music_recording", name: "Music recording and production", nameAr: "تسجيل وإنتاج الموسيقى", desc: "Studios, labels, and music production.", category: "music_audio", archetype: "media_and_creative", aliases: ["recording studio", "music label", "استوديو"] },
  { key: "live_sound_events", name: "Live sound and events audio", nameAr: "الصوت الحي والفعاليات", desc: "Concert sound, AV, and live production.", category: "music_audio", aliases: ["live sound", "AV rental", "concert production"] },

  // Gaming
  { key: "game_development", name: "Game development", nameAr: "تطوير الألعاب", desc: "Game studios and interactive entertainment.", category: "gaming_esports", archetype: "technology_and_saas", aliases: ["game studio", "game dev", "gaming studio", "game company", "ألعاب"], misspellings: ["game stuido"], keywords: ["gaming", "video games"] },
  { key: "esports_organization", name: "Esports organization", nameAr: "الرياضات الإلكترونية", desc: "Esports teams, tournaments, and gaming leagues.", category: "gaming_esports", aliases: ["esports", "gaming team", "tournament organizer"] },

  // Marketing
  { key: "marketing_agency", name: "Marketing agency", nameAr: "وكالة تسويق", desc: "Marketing, advertising, and campaign management.", category: "marketing_creative", archetype: "media_and_creative", aliases: ["ad agency", "marketing firm", "تسويق"] },
  { key: "branding_design_studio", name: "Branding and design studio", nameAr: "استوديو العلامة والتصميم", desc: "Brand identity, graphic design, and creative studio.", category: "marketing_creative", archetype: "media_and_creative", aliases: ["design agency", "branding", "graphic design"] },

  // Education
  { key: "training_academy", name: "Training academy", nameAr: "أكاديمية تدريب", desc: "Professional training and skills academies.", category: "education_training", archetype: "education_and_training", aliases: ["training center", "academy", "bootcamp", "تدريب"], purposes: ["provide_training"] },
  { key: "school_education_ops", name: "School education operations", nameAr: "عمليات المدارس", desc: "Schools, nurseries, and academic institution ops.", category: "education_training", archetype: "education_and_training", aliases: ["school", "nursery", "مدرسة"] },

  // Healthcare
  { key: "clinic_healthcare_ops", name: "Clinic and healthcare operations", nameAr: "عمليات العيادات والرعاية", desc: "Clinics, outpatient, and healthcare administration.", category: "healthcare_administration", archetype: "healthcare_operations", aliases: ["clinic", "medical center", "health clinic", "عيادة"], regulated: "Healthcare operations require privacy and compliance controls.", ssic: "8610" },
  { key: "dental_practice", name: "Dental practice", nameAr: "عيادة أسنان", desc: "Dental clinics and oral health services.", category: "healthcare_administration", archetype: "healthcare_operations", aliases: ["dentist", "dental clinic", "أسنان"] },
  { key: "clinical_laboratory", name: "Clinical diagnostic laboratory", nameAr: "مختبر تشخيصي", desc: "Medical labs, diagnostics, and pathology services.", category: "healthcare_administration", archetype: "healthcare_operations", aliases: ["medical lab", "diagnostic lab", "pathology lab", "مختبر طبي"], regulated: "Clinical labs require chain-of-custody and privacy controls.", ssic: "8690" },
  { key: "home_healthcare", name: "Home healthcare services", nameAr: "الرعاية الصحية المنزلية", desc: "In-home nursing and care coordination.", category: "healthcare_administration", archetype: "healthcare_operations", aliases: ["home care", "nursing at home"] },

  // Fitness
  { key: "gym_fitness_center", name: "Gym and fitness center", nameAr: "نادي رياضي", desc: "Gyms, fitness studios, and membership fitness.", category: "fitness_wellness", archetype: "fitness_and_wellness", aliases: ["gym", "fitness", "crossfit", "نادي"], purposes: ["operate_membership"] },
  { key: "personal_training_coaching", name: "Personal training and coaching", nameAr: "تدريب شخصي", desc: "Personal trainers, fitness coaches, and boutique coaching.", category: "fitness_wellness", archetype: "fitness_and_wellness", aliases: ["personal trainer", "fitness coach", "PT studio", "مدرب شخصي"], parent: "gym_fitness_center", purposes: ["provide_training"] },
  { key: "sports_club_recreation", name: "Sports club and recreation", nameAr: "نادي رياضي وترفيه", desc: "Sports clubs, academies, and recreational leagues.", category: "fitness_wellness", archetype: "fitness_and_wellness", aliases: ["sports club", "sports academy", "recreation club", "نادي رياضي"] },
  { key: "wellness_spa", name: "Wellness and spa", nameAr: "العافية والسبا", desc: "Spa, wellness retreats, and holistic centers.", category: "fitness_wellness", archetype: "fitness_and_wellness", aliases: ["spa", "wellness center", "سبا"] },

  // Beauty
  { key: "hair_salon", name: "Hair salon", nameAr: "صالون حلاقة", desc: "Hair styling, barbershops, and salon services.", category: "beauty_personal_care", aliases: ["salon", "barbershop", "hairdresser", "صالون"] },
  { key: "beauty_clinic", name: "Beauty and aesthetics clinic", nameAr: "عيادة تجميل", desc: "Aesthetics, skincare, and cosmetic services.", category: "beauty_personal_care", aliases: ["aesthetics", "skincare clinic", "تجميل"] },

  // Automotive
  { key: "auto_repair_workshop", name: "Auto repair workshop", nameAr: "ورشة سيارات", desc: "Vehicle repair, maintenance, and body shops.", category: "automotive_services", aliases: ["garage", "auto shop", "mechanic", "vehicle maintenance", "ورشة"] },
  { key: "car_wash_detailing", name: "Car wash and detailing", nameAr: "غسيل وتلميع السيارات", desc: "Car wash, auto detailing, and vehicle care services.", category: "automotive_services", aliases: ["car wash", "auto detailing", "detailing", "غسيل سيارات"] },
  { key: "car_dealership", name: "Car dealership", nameAr: "وكالة سيارات", desc: "Vehicle sales, leasing, and dealership ops.", category: "automotive_services", aliases: ["dealership", "car sales", "معرض سيارات"] },

  // Equipment rental
  { key: "heavy_equipment_rental", name: "Heavy equipment rental", nameAr: "تأجير المعدات الثقيلة", desc: "Construction and industrial equipment rental.", category: "equipment_rental", aliases: ["equipment rental", "plant hire", "crane rental", "تأجير معدات"], purposes: ["rent_equipment"] },
  { key: "vehicle_rental", name: "Vehicle rental", nameAr: "تأجير المركبات", desc: "Car, van, and fleet rental services.", category: "equipment_rental", aliases: ["car rental", "rent a car", "تأجير سيارات"] },

  // Maintenance & field
  { key: "facilities_maintenance", name: "Facilities maintenance", nameAr: "صيانة المرافق", desc: "Building maintenance and technical upkeep.", category: "maintenance_field_services", aliases: ["maintenance company", "FM maintenance", "صيانة"] },
  { key: "hvac_field_service", name: "HVAC field service", nameAr: "خدمات التكييف الميدانية", desc: "HVAC installation, repair, and field technicians.", category: "maintenance_field_services", aliases: ["HVAC", "AC repair", "تكييف"] },
  { key: "electrical_field_service", name: "Electrical field service", nameAr: "الخدمات الكهربائية الميدانية", desc: "Electrical contractors and on-site electricians.", category: "maintenance_field_services", aliases: ["electrician", "electrical contractor", "كهربائي"] },

  // Facilities & cleaning
  { key: "commercial_cleaning", name: "Commercial cleaning", nameAr: "تنظيف تجاري", desc: "Janitorial and commercial cleaning services.", category: "facilities_cleaning", aliases: ["cleaning company", "janitorial", "تنظيف"] },
  { key: "landscaping_grounds", name: "Landscaping and grounds", nameAr: "تنسيق الحدائق", desc: "Landscaping, groundskeeping, and outdoor maintenance.", category: "facilities_cleaning", aliases: ["landscaping", "gardening", "حدائق"] },

  // Security
  { key: "security_guarding", name: "Security guarding", nameAr: "حراسة أمنية", desc: "Manned guarding and site security.", category: "security_services", aliases: ["security company", "guards", "حراسة"], regulated: "Security operations require access control segregation." },
  { key: "cctv_surveillance", name: "CCTV and surveillance", nameAr: "كاميرات ومراقبة", desc: "Surveillance systems and monitoring services.", category: "security_services", aliases: ["CCTV", "surveillance", "monitoring center"] },

  // Events
  { key: "event_management", name: "Event management", nameAr: "إدارة الفعاليات", desc: "Corporate events, weddings, and event production.", category: "events_entertainment", archetype: "events_and_venues", aliases: ["event planner", "event company", "فعاليات"], purposes: ["run_events"], ssic: "8230" },
  { key: "venue_operations", name: "Venue operations", nameAr: "تشغيل القاعات", desc: "Conference centers, halls, and venue management.", category: "events_entertainment", archetype: "events_and_venues", aliases: ["conference center", "banquet hall", "قاعة"] },
  { key: "entertainment_production", name: "Entertainment production", nameAr: "إنتاج ترفيهي", desc: "Shows, performers, and entertainment operators.", category: "events_entertainment", archetype: "events_and_venues", aliases: ["entertainment", "show production"] },

  // Travel
  { key: "travel_agency", name: "Travel agency", nameAr: "وكالة سفر", desc: "Travel booking, tours, and agency services.", category: "travel_tourism", archetype: "hospitality_and_tourism", aliases: ["travel agent", "tour operator", "وكالة سفر"] },
  { key: "hajj_umrah_services", name: "Hajj and Umrah services", nameAr: "خدمات الحج والعمرة", desc: "Pilgrimage travel, Umrah packages, and religious tourism operators.", category: "travel_tourism", archetype: "hospitality_and_tourism", aliases: ["Umrah", "Hajj", "pilgrimage travel", "religious tourism", "عمرة", "حج"], parent: "travel_agency", purposes: ["provide_services"], ssic: "7911", regulated: "Religious tourism may require additional compliance review." },
  { key: "tourism_experience", name: "Tourism experiences", nameAr: "تجارب سياحية", desc: "Tours, experiences, and destination services.", category: "travel_tourism", archetype: "hospitality_and_tourism", aliases: ["tour guide", "tourism", "سياحة"] },

  // Financial
  { key: "corporate_finance_ops", name: "Corporate finance operations", nameAr: "عمليات مالية للشركات", desc: "Finance teams, AP/AR, and treasury operations.", category: "financial_operations", aliases: ["finance department", "treasury", "مالية"] },
  { key: "fintech_operations", name: "Fintech operations", nameAr: "عمليات التقنية المالية", desc: "Fintech back-office and financial product ops.", category: "financial_operations", archetype: "technology_and_saas", aliases: ["fintech", "payments company"], regulated: "Financial operations may require enhanced controls." },

  // Insurance
  { key: "insurance_brokerage", name: "Insurance brokerage", nameAr: "وساطة تأمين", desc: "Insurance brokers and policy administration.", category: "insurance_services", aliases: ["insurance broker", "insurance agent", "تأمين"], regulated: "Insurance brokerage requires compliance tracking." },
  { key: "claims_administration", name: "Claims administration", nameAr: "إدارة المطالبات", desc: "Claims processing and insurance back-office.", category: "insurance_services", aliases: ["claims processing", "insurance claims"] },

  // Research
  { key: "research_laboratory", name: "Research laboratory", nameAr: "مختبر أبحاث", desc: "R&D labs, testing, and scientific research.", category: "research_laboratories", aliases: ["lab", "R&D", "testing lab", "مختبر"], regulated: "Labs may require sample chain-of-custody." },
  { key: "quality_testing_lab", name: "Quality testing laboratory", nameAr: "مختبر فحص الجودة", desc: "Product testing, calibration, and QA labs.", category: "research_laboratories", aliases: ["testing lab", "QA lab", "calibration"] },

  // Nonprofit
  { key: "nonprofit_ngo", name: "Nonprofit and NGO", nameAr: "منظمة غير ربحية", desc: "Charities, NGOs, and social impact organizations.", category: "nonprofit_membership", archetype: "nonprofit_and_associations", aliases: ["NGO", "charity", "nonprofit", "جمعية خيرية"] },
  { key: "professional_association", name: "Professional association", nameAr: "جمعية مهنية", desc: "Membership bodies and industry associations.", category: "nonprofit_membership", archetype: "nonprofit_and_associations", aliases: ["association", "membership org", "جمعية"], purposes: ["operate_membership"] },

  // Public services
  { key: "community_services", name: "Community services", nameAr: "خدمات مجتمعية", desc: "Community programs and social services.", category: "public_community_services", aliases: ["community center", "social services", "خدمات مجتمعية"] },
  { key: "municipal_contractor", name: "Municipal services contractor", nameAr: "مقاول خدمات بلدية", desc: "Contracted public works and municipal services.", category: "public_community_services", aliases: ["municipal contractor", "public works"] },

  // Energy
  { key: "renewable_energy", name: "Renewable energy", nameAr: "الطاقة المتجددة", desc: "Solar, wind, and clean energy operations.", category: "energy_utilities", aliases: ["solar company", "renewables", "طاقة شمسية"] },
  { key: "water_utility_services", name: "Water and utility services", nameAr: "خدمات المياه والمرافق", desc: "Water supply, wastewater, and utility field services.", category: "energy_utilities", aliases: ["water utility", "wastewater", "utility services", "مياه"], ssic: "3600" },
  { key: "oil_gas_field_services", name: "Oil and gas field services", nameAr: "خدمات حقول النفط والغاز", desc: "Upstream field services and energy contractors.", category: "energy_utilities", aliases: ["oilfield", "O&G services", "نفط"], regulated: "Energy field services require safety compliance." },

  // Mining
  { key: "mining_operations", name: "Mining operations", nameAr: "عمليات التعدين", desc: "Mining, quarrying, and mineral extraction.", category: "mining_industrial_services", aliases: ["mine", "quarry", "تعدين"], regulated: "Mining requires safety and environmental controls." },
  { key: "industrial_field_services", name: "Industrial field services", nameAr: "خدمات ميدانية صناعية", desc: "Shutdowns, turnarounds, and industrial contractors.", category: "mining_industrial_services", aliases: ["industrial contractor", "turnaround services"] },

  // Aviation
  { key: "airline_operations", name: "Airline operations", nameAr: "عمليات الطيران", desc: "Airlines and scheduled flight operations.", category: "aviation", aliases: ["airline", "aviation", "طيران"], regulated: "Aviation requires strict safety compliance." },
  { key: "aircraft_mro", name: "Aircraft MRO", nameAr: "صيانة الطائرات", desc: "Maintenance, repair, and overhaul for aircraft.", category: "aviation", aliases: ["MRO", "aircraft maintenance", "صيانة طائرات"] },

  // Maritime
  { key: "shipping_maritime", name: "Shipping and maritime", nameAr: "الشحن البحري", desc: "Shipping lines, vessels, and maritime freight.", category: "maritime_ports", aliases: ["shipping", "maritime", "vessel operator", "شحن بحري"] },
  { key: "port_operations", name: "Port operations", nameAr: "عمليات الموانئ", desc: "Port terminals, stevedoring, and harbor ops.", category: "maritime_ports", aliases: ["port", "terminal operator", "ميناء"] },

  // Other specialist
  { key: "translation_localization", name: "Translation and localization", nameAr: "الترجمة والتوطين", desc: "Translation agencies and localization services.", category: "other_specialist_services", archetype: "professional_services", aliases: ["translation", "localization", "ترجمة"] },
  { key: "waste_recycling", name: "Waste management and recycling", nameAr: "إدارة النفايات وإعادة التدوير", desc: "Waste collection, recycling, and environmental services.", category: "other_specialist_services", aliases: ["recycling", "waste management", "نفايات"] },
  { key: "veterinary_services", name: "Veterinary services", nameAr: "الخدمات البيطرية", desc: "Veterinary clinics and animal care.", category: "other_specialist_services", aliases: ["vet clinic", "veterinary", "بيطري"] },
  { key: "photography_studio", name: "Photography studio", nameAr: "استوديو تصوير", desc: "Commercial photography and studio services.", category: "other_specialist_services", archetype: "media_and_creative", aliases: ["photographer", "photo studio", "تصوير"] },
  { key: "repair_maintenance_services", name: "General repair and maintenance services", nameAr: "خدمات الإصلاح والصيانة", desc: "Appliance, equipment, and general repair services.", category: "other_specialist_services", aliases: ["repair shop", "maintenance service", "fix it shop", "إصلاح"] },
];

export const BUSINESS_FIELD_CATALOG: readonly BusinessFieldDefinition[] = seeds.map(f);

export const FIELD_BY_KEY = new Map(BUSINESS_FIELD_CATALOG.map((field) => [field.key, field]));

// Wire parent-child references
for (const field of BUSINESS_FIELD_CATALOG) {
  if (field.parentFieldKey) {
    const parent = FIELD_BY_KEY.get(field.parentFieldKey);
    if (parent && !parent.childActivityKeys.includes(field.key)) {
      (parent as { childActivityKeys: string[] }).childActivityKeys.push(field.key);
    }
  }
}

export function listBusinessFields(): BusinessFieldDefinition[] {
  return [...BUSINESS_FIELD_CATALOG];
}

export function getBusinessField(key: string): BusinessFieldDefinition | undefined {
  return FIELD_BY_KEY.get(key);
}

export function listFieldsByCategory(categoryKey: string): BusinessFieldDefinition[] {
  return BUSINESS_FIELD_CATALOG.filter((f) => f.categoryKey === categoryKey);
}
