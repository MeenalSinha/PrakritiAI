"""
PrakritiAI – Learning Center Content
Natural Farming educational content.
"""

LESSONS = [
    {
        "id": "jeevamrut",
        "title": "Jeevamrut",
        "title_hi": "Jeevamrut",
        "subtitle": "The Soul of Natural Farming",
        "read_time": 5,
        "category": "preparations",
        "difficulty": "Beginner",
        "image": "jeevamrut",
        "key_points": [
            "Activates soil microorganisms for better nutrient uptake",
            "Made from desi cow dung, urine, jaggery, gram flour, and soil",
            "Ready in 48 hours, lasts up to 7 days",
            "Use 200 litres per acre per month",
            "Best applied early morning before 9 AM"
        ],
        "ingredients": [
            "200 litres water",
            "10 kg desi cow dung (fresh)",
            "10 litres desi cow urine",
            "2 kg jaggery (gud)",
            "2 kg gram flour (besan)",
            "1 handful local soil (from under a tree)"
        ],
        "preparation_steps": [
            "Take 200 litres of water in a barrel",
            "Add fresh desi cow dung and mix well",
            "Add cow urine and stir",
            "Dissolve jaggery in warm water and add",
            "Mix in gram flour",
            "Add a handful of local soil",
            "Stir clockwise twice daily for 48 hours",
            "Cover with jute bag - do not use plastic",
            "Strain through cloth before use"
        ],
        "usage": "Dilute with water (1:10 ratio) and spray on crops or apply to soil. Use within 7 days of preparation.",
        "benefits": [
            "Increases beneficial bacteria by 10-100x",
            "Improves soil aeration and water retention",
            "Reduces pest and disease incidence",
            "Enhances crop immunity",
            "Zero cost - uses farm byproducts"
        ],
        "cautions": [
            "Use only desi (local breed) cow products",
            "Do not store in sunlight or heat",
            "Do not spray during rain or strong wind",
            "Old Jeevamrut (>7 days) can harm crops"
        ]
    },
    {
        "id": "beejamrut",
        "title": "Beejamrut",
        "title_hi": "Beejamrut",
        "subtitle": "Seed Treatment for Stronger Germination",
        "read_time": 4,
        "category": "preparations",
        "difficulty": "Beginner",
        "image": "beejamrut",
        "key_points": [
            "Protects seeds from soil-borne diseases",
            "Improves germination rate by 20-30%",
            "Strengthens initial root development",
            "Very low cost - uses cow byproducts",
            "Apply 48 hours before sowing"
        ],
        "ingredients": [
            "20 litres water",
            "5 kg desi cow dung (fresh)",
            "5 litres desi cow urine",
            "50 grams lime (chuna)",
            "1 handful local soil"
        ],
        "preparation_steps": [
            "Mix cow dung in 5 litres water overnight",
            "Strain through cloth to get liquid",
            "Add remaining water, cow urine, lime, and soil",
            "Stir well and let sit for 48 hours",
            "Strain before use"
        ],
        "usage": "Soak seeds in Beejamrut for 30 minutes. Dry in shade and sow within 24 hours.",
        "benefits": [
            "Controls seed-borne and soil-borne pathogens",
            "Activates dormant seeds",
            "Improves germination uniformity",
            "Protects seedlings in early stage"
        ],
        "cautions": [
            "Use within 48 hours of preparation",
            "Do not soak seeds for more than 30 minutes",
            "Dry seeds in shade only - never in direct sun"
        ]
    },
    {
        "id": "ghan-jeevamrut",
        "title": "Ghan Jeevamrut",
        "title_hi": "Ghan Jeevamrut",
        "subtitle": "Solid Organic Fertilizer for Long-Term Soil Health",
        "read_time": 4,
        "category": "preparations",
        "difficulty": "Intermediate",
        "image": "ghan_jeevamrut",
        "key_points": [
            "Solid form of Jeevamrut - longer shelf life (6 months)",
            "Apply 100 kg per acre during field preparation",
            "Slow release of nutrients over growing season",
            "Can be stored and transported easily",
            "Excellent for basal application"
        ],
        "ingredients": [
            "100 kg desi cow dung (fresh)",
            "1 kg jaggery",
            "1 kg gram flour (besan)",
            "1 kg soil from shady area",
            "500 ml cow urine"
        ],
        "preparation_steps": [
            "Spread fresh cow dung in a layer on clean floor",
            "Dissolve jaggery in cow urine",
            "Mix jaggery-urine solution with dung",
            "Add gram flour and soil, mix thoroughly",
            "Cover with jute bag, keep moist but not wet",
            "Stir every 3 days",
            "Ready in 4-5 days when earthy smell appears"
        ],
        "usage": "Spread 100 kg per acre during last ploughing before sowing. Mix into top 6 inches of soil.",
        "benefits": [
            "Sustained nutrient release over 3-4 months",
            "Easy to store and transport",
            "Enriches soil biodiversity",
            "Excellent basal dressing for all crops"
        ],
        "cautions": [
            "Do not use more than 200 kg/acre to avoid burning",
            "Keep stored material dry",
            "Use fresh preparation for best results"
        ]
    },
    {
        "id": "crop-rotation",
        "title": "Crop Rotation",
        "title_hi": "Fasal Chakra",
        "subtitle": "Break Pest Cycles and Restore Soil Health",
        "read_time": 5,
        "category": "practices",
        "difficulty": "Beginner",
        "image": "crop_rotation",
        "key_points": [
            "Never grow the same crop in the same field twice consecutively",
            "Legumes (pulses) fix nitrogen for the next crop",
            "Reduces pest and disease pressure naturally",
            "Improves soil structure over time",
            "Basis of sustainable natural farming"
        ],
        "rotation_examples": [
            {"season": "Kharif", "crop": "Soybean/Moong", "benefit": "Nitrogen fixation"},
            {"season": "Rabi", "crop": "Wheat/Jowar", "benefit": "Uses fixed nitrogen"},
            {"season": "Zaid", "crop": "Vegetables/Watermelon", "benefit": "Breaks pest cycle"},
            {"season": "Next Kharif", "crop": "Cotton/Maize", "benefit": "Fresh pest-free start"}
        ],
        "benefits": [
            "Naturally reduces dependence on external inputs",
            "Breaks soil-borne pathogen cycles",
            "Improves soil organic matter year by year",
            "Optimizes water use across seasons",
            "Diversifies farm income"
        ],
        "cautions": [
            "Avoid same plant family in consecutive seasons",
            "Keep records of which crop grew where",
            "Consult KVK for region-specific rotation advice"
        ]
    },
    {
        "id": "companion-planting",
        "title": "Companion Planting",
        "title_hi": "Sahfasal Paddhati",
        "subtitle": "Nature's Best Pest Management System",
        "read_time": 5,
        "category": "practices",
        "difficulty": "Intermediate",
        "image": "companion_planting",
        "key_points": [
            "Some plants protect each other from pests",
            "Marigold repels nematodes and whiteflies",
            "Basil protects tomatoes from aphids",
            "Legumes alongside cereals fix nitrogen",
            "Border crops can trap pests away from main crop"
        ],
        "combinations": [
            {"main": "Tomato", "companion": "Basil", "benefit": "Repels aphids, improves flavor"},
            {"main": "Cotton", "companion": "Cowpea", "benefit": "Border trap crop for bollworm"},
            {"main": "Soybean", "companion": "Jowar", "benefit": "Shade + nitrogen balance"},
            {"main": "Wheat", "companion": "Mustard", "benefit": "Mustard repels aphids from wheat"},
            {"main": "Any crop", "companion": "Marigold", "benefit": "Universal pest repellent border"}
        ],
        "benefits": [
            "Zero cost pest management",
            "Maximizes land productivity",
            "Creates biodiversity on farm",
            "Improves pollination",
            "Generates additional income"
        ],
        "cautions": [
            "Research specific combinations for your region",
            "Some plants are allelopathic - test before scaling",
            "Row ratios matter - follow recommended patterns"
        ]
    },
    {
        "id": "multilevel-farming",
        "title": "Multilevel Farming",
        "title_hi": "Bahustari Kheti",
        "subtitle": "Maximize Yield on Same Land",
        "read_time": 6,
        "category": "practices",
        "difficulty": "Advanced",
        "image": "multilevel_farming",
        "key_points": [
            "Use vertical space with trees, shrubs, and ground crops",
            "4-layer system: tall trees, medium trees, shrubs, ground crops",
            "Inspired by natural forest ecosystem",
            "Significantly higher income per acre",
            "Long-term investment for permanent food security"
        ],
        "layers": [
            {"level": "1 - Canopy", "example": "Mango, Coconut, Teak", "height": "15-30 feet"},
            {"level": "2 - Sub-canopy", "example": "Banana, Papaya, Drumstick", "height": "8-15 feet"},
            {"level": "3 - Shrub", "example": "Tomato, Brinjal, Turmeric", "height": "2-5 feet"},
            {"level": "4 - Ground", "example": "Ginger, Methi, Groundnut", "height": "0-2 feet"}
        ],
        "benefits": [
            "3-4x income from same land area",
            "Mimics natural ecosystem - self-sustaining over time",
            "Year-round income from different crops",
            "Excellent for small farm sizes (under 2 acres)",
            "Carbon sequestration benefit"
        ],
        "cautions": [
            "Plan carefully - trees are long-term commitment",
            "Requires good knowledge of plant spacing",
            "Start small and scale up",
            "Seek KVK guidance for your region"
        ]
    },
    {
        "id": "organic-pest-control",
        "title": "Organic Pest Control",
        "title_hi": "Jevik Kit Niyantran",
        "subtitle": "Natural Methods to Control Farm Pests",
        "read_time": 6,
        "category": "pest_management",
        "difficulty": "Intermediate",
        "image": "pest_control",
        "key_points": [
            "Neem oil is the most versatile organic pesticide",
            "Dashaparni Ark repels over 80% of common pests",
            "Yellow sticky traps catch flying insects",
            "Pheromone traps target specific moths",
            "Prevention is better than cure"
        ],
        "preparations": [
            {
                "name": "Neem Oil Spray",
                "recipe": "5ml neem oil + 1ml soap in 1 litre water",
                "targets": "Aphids, whiteflies, mites, fungal infections",
                "frequency": "Every 7-10 days"
            },
            {
                "name": "Dashaparni Ark",
                "recipe": "10 leaves (neem, papaya, guava, custard apple etc.) in 10L water, fermented 10 days",
                "targets": "Most sucking and chewing insects",
                "frequency": "Every 15 days"
            },
            {
                "name": "Cow Urine Spray",
                "recipe": "1 part cow urine + 10 parts water",
                "targets": "Fungal diseases, soil-borne pathogens",
                "frequency": "Every 10 days"
            },
            {
                "name": "Chilli-Garlic Spray",
                "recipe": "250g garlic + 250g chilli blended in 10L water, strain and dilute 1:10",
                "targets": "Aphids, mites, small caterpillars",
                "frequency": "Every 7 days during pest outbreak"
            }
        ],
        "benefits": [
            "No harmful residues on food",
            "Safe for beneficial insects and pollinators",
            "Builds long-term crop immunity",
            "Very low cost using farm materials",
            "Premium price in organic market"
        ],
        "cautions": [
            "Spray in evening to protect pollinators",
            "Test on small area first before full field spray",
            "Rinse hands thoroughly after handling preparations",
            "Do not spray in rain or strong wind"
        ]
    },
    {
        "id": "soil-health",
        "title": "Soil Health",
        "title_hi": "Mitti ki Sehat",
        "subtitle": "Build Living Soil for Abundant Harvests",
        "read_time": 5,
        "category": "soil",
        "difficulty": "Beginner",
        "image": "soil_health",
        "key_points": [
            "Healthy soil has billions of microorganisms per gram",
            "Chemical fertilizers kill soil microorganisms over time",
            "Earthworms are nature's best soil builders",
            "Organic matter (carbon) is the foundation of soil health",
            "Test soil health: check earthworm count per cubic foot"
        ],
        "indicators": [
            {"indicator": "Earthworms", "healthy": "10+ per cubic foot", "action": "Add organic matter, stop chemicals"},
            {"indicator": "Soil color", "healthy": "Dark brown/black", "action": "Add compost and Jeevamrut"},
            {"indicator": "Smell", "healthy": "Earthy, pleasant", "action": "Reduce chemical inputs"},
            {"indicator": "Water absorption", "healthy": "Quick absorption", "action": "Deep ploughing + organic matter"},
            {"indicator": "Root depth", "healthy": "Roots go deep freely", "action": "Subsoil tillage, reduce compaction"}
        ],
        "improvement_methods": [
            "Regular application of Jeevamrut (builds microorganism population)",
            "Green manuring with Dhaincha or Sunhemp before planting",
            "Crop residue incorporation instead of burning",
            "Cover crops in off-season to prevent erosion",
            "Reduce or eliminate tillage to protect soil structure"
        ],
        "benefits": [
            "Healthy soil needs less water and fertilizer",
            "Disease resistance increases naturally",
            "Yield stabilizes and improves year over year",
            "Farm becomes truly sustainable"
        ],
        "cautions": [
            "Soil recovery takes 2-3 seasons - be patient",
            "Get soil test done before changing management",
            "Do not burn crop residue - it destroys soil life"
        ]
    },
    {
        "id": "water-conservation",
        "title": "Water Conservation",
        "title_hi": "Paani ki Bachat",
        "subtitle": "Smart Irrigation and Rainwater Harvesting",
        "read_time": 5,
        "category": "practices",
        "difficulty": "Beginner",
        "image": "water_conservation",
        "key_points": [
            "Drip irrigation reduces water use by 40-50%",
            "Mulching reduces soil evaporation by 30%",
            "Farm ponds capture monsoon rain for lean season",
            "Irrigate in early morning or evening only",
            "Healthy soil retains water better - reduce inputs"
        ],
        "ingredients": [],
        "preparation_steps": [],
        "usage": "Implement one water-saving method at a time. Start with mulching as it is lowest cost and highest impact.",
        "benefits": [
            "Reduces irrigation cost and labor",
            "Protects crops during dry spells",
            "Improves soil health over time",
            "Lower water stress means better yield quality",
            "Eligible for water conservation subsidies"
        ],
        "cautions": [
            "Do not over-irrigate even with drip - check soil moisture first",
            "Contour bunding requires proper surveying to be effective",
            "Farm ponds need silt desilting every 5 years"
        ],
        "methods": [
            {"name": "Drip Irrigation", "saving": "40-50%", "cost": "Rs 40,000-60,000/acre (subsidized)", "best_for": "Vegetables, fruits, sugarcane"},
            {"name": "Sprinkler Irrigation", "saving": "25-35%", "cost": "Rs 15,000-25,000/acre", "best_for": "Wheat, groundnut, pulses"},
            {"name": "Mulching", "saving": "25-30% evaporation", "cost": "Free (crop residue)", "best_for": "All crops"},
            {"name": "Contour Bunding", "saving": "60% runoff reduction", "cost": "Rs 5,000-8,000/acre", "best_for": "Sloping land"},
            {"name": "Farm Pond", "saving": "Stores 500-5000 m3", "cost": "Rs 50,000-2,00,000 (govt subsidy available)", "best_for": "All farms"}
        ]
    }
]


def get_all_lessons(category: str = None) -> list:
    """Get all lessons, optionally by category."""
    if category and category != "all":
        return [l for l in LESSONS if l["category"] == category]
    return LESSONS


def get_lesson_by_id(lesson_id: str) -> dict:
    """Get a single lesson by ID."""
    for lesson in LESSONS:
        if lesson["id"] == lesson_id:
            return lesson
    return {}


def get_categories() -> list:
    """Get unique lesson categories."""
    return list({l["category"] for l in LESSONS})
