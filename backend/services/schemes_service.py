"""
PrakritiAI – Government Schemes Database
"""

SCHEMES = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN",
        "full_name": "Pradhan Mantri Kisan Samman Nidhi",
        "category": "income_support",
        "icon": "government",
        "status": "active",
        "benefit_amount": "Rs. 6,000/year",
        "description": "Direct income support of Rs. 6,000 per year (3 installments of Rs. 2,000 each) for small and marginal farmers.",
        "description_hi": "Chhote aur seemant kisaanon ko Rs. 6,000 pratisaal (3 kisht mein Rs. 2,000 har baar).",
        "eligibility": [
            "Small and marginal farmers with cultivable land up to 2 hectares",
            "Must be Indian citizen with valid Aadhaar card",
            "Have bank account linked to Aadhaar",
            "Not a current/former government employee",
            "Not an income tax payer"
        ],
        "benefits": [
            "Rs. 2,000 every 4 months - direct bank transfer",
            "No intermediary - direct benefit transfer",
            "Covers all farming-related expenses"
        ],
        "documents": [
            "Aadhaar Card (mandatory)",
            "Bank Passbook / Account Details",
            "Land ownership papers (Khasra/Khatauni)",
            "Mobile number linked to Aadhaar",
            "Passport size photograph"
        ],
        "application_process": [
            "Visit pmkisan.gov.in or nearest Common Service Centre (CSC)",
            "Fill registration form with Aadhaar, bank, and land details",
            "Submit documents for verification",
            "Receive SMS confirmation after approval",
            "First installment within 2-3 months of registration"
        ],
        "official_link": "https://pmkisan.gov.in",
        "helpline": "155261 / 1800-115-526",
        "tags": ["income", "direct_transfer", "all_farmers"]
    },
    {
        "id": "pkvy",
        "name": "PKVY",
        "full_name": "Paramparagat Krishi Vikas Yojana",
        "category": "organic_farming",
        "icon": "organic",
        "status": "active",
        "benefit_amount": "Rs. 50,000/hectare (3 years)",
        "description": "Government support for organic farming clusters. Financial assistance to farmers transitioning to organic/natural farming.",
        "description_hi": "Jevik kheti ke liye Rs. 50,000 pratihektaar teen saalo mein.",
        "eligibility": [
            "Individual farmers or farmer groups/clusters",
            "Minimum cluster size of 20 hectares",
            "Must commit to 3-year organic certification process",
            "Land should be free from chemical use for certification"
        ],
        "benefits": [
            "Rs. 50,000/hectare over 3 years for inputs",
            "Free organic certification assistance",
            "Training and capacity building",
            "Market linkage support",
            "Soil health card"
        ],
        "documents": [
            "Land records (Khasra/Khatauni)",
            "Aadhaar Card",
            "Bank Account Details",
            "Group formation certificate (for clusters)",
            "Soil test report (if available)"
        ],
        "application_process": [
            "Contact your District Agriculture Officer (DAO)",
            "Form a cluster of minimum 20 farmers",
            "Apply through state agriculture department",
            "Get cluster registered on portal",
            "Receive training and certification guidance"
        ],
        "official_link": "https://pgsindia-ncof.gov.in",
        "helpline": "011-23382657",
        "tags": ["organic", "natural_farming", "subsidy", "cluster"]
    },
    {
        "id": "natural-farming-mission",
        "name": "National Mission on Natural Farming",
        "full_name": "National Mission on Natural Farming (NMNF)",
        "category": "natural_farming",
        "icon": "leaf",
        "status": "active",
        "benefit_amount": "Rs. 15,000/hectare",
        "description": "Central government mission to promote natural farming (Zero Budget Natural Farming) across India, providing financial support and training.",
        "description_hi": "Prakritik kheti (ZBNF) ko pramotsahit karne ke liye Rs. 15,000 pratihektaar aur prasikshan.",
        "eligibility": [
            "All farmers willing to adopt natural farming practices",
            "Must attend mandatory training camps",
            "Commit to ZBNF principles for minimum 1 season",
            "Priority to marginal and small farmers"
        ],
        "benefits": [
            "Rs. 15,000/hectare financial support",
            "Free training on Jeevamrut, Beejamrut, Dashaparni Ark",
            "Desi cow support (link to Kamdhenu scheme)",
            "Organic certification support",
            "Market premium for natural farm produce"
        ],
        "documents": [
            "Aadhaar Card",
            "Land Records",
            "Bank Account",
            "Training completion certificate"
        ],
        "application_process": [
            "Contact Block Agriculture Office or KVK",
            "Register for free ZBNF training program",
            "Complete 3-day training on natural farming",
            "Apply for financial support after training",
            "Start natural farming with guidance from KVK"
        ],
        "official_link": "https://naturalfarming.dac.gov.in",
        "helpline": "1551",
        "tags": ["zbnf", "natural_farming", "training", "jeevamrut"]
    },
    {
        "id": "soil-health-card",
        "name": "Soil Health Card",
        "full_name": "Soil Health Card Scheme",
        "category": "soil",
        "icon": "soil",
        "status": "active",
        "benefit_amount": "Free soil testing",
        "description": "Free soil testing to understand soil health and get customized fertilizer recommendations for your farm.",
        "description_hi": "Mitti ki janch aur urvarak salaah bilkul muft.",
        "eligibility": [
            "All farmers with agricultural land",
            "No income or land size restriction",
            "Apply once every 2 years"
        ],
        "benefits": [
            "Free soil testing for 12 parameters (pH, N, P, K, S, Zn, Fe, Cu, Mn, B, organic carbon)",
            "Customized fertilizer recommendation card",
            "Micro-nutrient deficiency identification",
            "Digital card accessible on mobile",
            "Helps reduce input costs significantly"
        ],
        "documents": [
            "Aadhaar Card",
            "Land records / Khasra number",
            "Mobile number"
        ],
        "application_process": [
            "Visit nearest Soil Testing Laboratory (STL) or Agriculture office",
            "Provide land details and Aadhaar",
            "Soil sample collected from your field",
            "Results available in 4-6 weeks",
            "Card delivered digitally and physically"
        ],
        "official_link": "https://soilhealth.dac.gov.in",
        "helpline": "1551",
        "tags": ["soil", "testing", "free", "nutrition"]
    },
    {
        "id": "pmfby",
        "name": "PMFBY",
        "full_name": "Pradhan Mantri Fasal Bima Yojana",
        "category": "insurance",
        "icon": "insurance",
        "status": "active",
        "benefit_amount": "Up to full crop loss coverage",
        "description": "Crop insurance scheme covering losses due to natural calamities, pests, and diseases at minimal premium.",
        "description_hi": "Fasal barbaadi hone par muaawaza. Kharif mein 2%, Rabi mein 1.5% premium.",
        "eligibility": [
            "All farmers (loanee and non-loanee)",
            "Must enroll before notified cut-off date",
            "Covers food crops, oilseeds, and commercial crops",
            "Applies to notified crops in your district"
        ],
        "benefits": [
            "Coverage against natural calamities, pest, disease",
            "Low premium: 2% for Kharif, 1.5% for Rabi",
            "Claim settled within 2 months of harvest",
            "Advance claim for mid-season losses",
            "Technology-based crop loss assessment"
        ],
        "documents": [
            "Aadhaar Card",
            "Bank Passbook",
            "Land Records",
            "Sowing certificate (from Patwari)",
            "Previous season crop details"
        ],
        "application_process": [
            "Visit nearest bank branch, CSC, or insurance company office",
            "Apply before cut-off date (usually 2 weeks before sowing)",
            "Pay minimal premium amount",
            "Get policy document with crop coverage details",
            "In case of loss, inform insurer within 72 hours"
        ],
        "official_link": "https://pmfby.gov.in",
        "helpline": "1800-200-7710",
        "tags": ["insurance", "loss_coverage", "calamity", "premium"]
    },
    {
        "id": "kcc",
        "name": "KCC",
        "full_name": "Kisan Credit Card",
        "category": "credit",
        "icon": "credit",
        "status": "active",
        "benefit_amount": "Credit up to Rs. 3 lakh @ 4% interest",
        "description": "Short-term credit for crop cultivation at subsidized interest rate of 4% for loans up to Rs. 3 lakh.",
        "description_hi": "Rs. 3 lakh tak ka karz sirf 4% byaaj par, kheti ke kharche ke liye.",
        "eligibility": [
            "All farmers including tenant farmers and sharecroppers",
            "Individual or joint borrowers",
            "Self-help groups and joint liability groups",
            "Animal husbandry and fisheries farmers also eligible"
        ],
        "benefits": [
            "Credit up to Rs. 3 lakh at 4% interest (with prompt repayment rebate)",
            "Flexible repayment based on harvest and marketing",
            "Accident insurance coverage",
            "No collateral required for loans up to Rs. 1.6 lakh",
            "ATM card for easy withdrawal"
        ],
        "documents": [
            "Aadhaar Card",
            "Land Records / Rental Agreement",
            "Passport size photograph",
            "Filled KCC application form",
            "Bank account details"
        ],
        "application_process": [
            "Visit nearest bank branch (any nationalized bank or cooperative bank)",
            "Fill KCC application with land and crop details",
            "Bank assesses credit limit based on land and crop",
            "Card issued within 2 weeks of application",
            "Repay after harvest to maintain credit limit"
        ],
        "official_link": "https://www.rbi.org.in/kcc",
        "helpline": "1800-11-0001",
        "tags": ["loan", "credit", "low_interest", "kcc"]
    }
]


def get_all_schemes(category: str = None, search: str = None) -> list:
    """Get all schemes, optionally filtered."""
    result = SCHEMES
    
    if category and category != "all":
        result = [s for s in result if s["category"] == category]
    
    if search:
        search_lower = search.lower()
        result = [
            s for s in result
            if search_lower in s["name"].lower()
            or search_lower in s["full_name"].lower()
            or search_lower in s["description"].lower()
            or any(search_lower in tag for tag in s.get("tags", []))
        ]
    
    return result


def get_scheme_by_id(scheme_id: str) -> dict:
    """Get a single scheme by ID."""
    for s in SCHEMES:
        if s["id"] == scheme_id:
            return s
    return {}


def get_scheme_categories() -> list:
    """Get unique scheme categories."""
    cats = list({s["category"] for s in SCHEMES})
    return sorted(cats)
