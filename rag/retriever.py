"""
PrakritiAI – RAG Pipeline
FAISS vector store for knowledge retrieval.
Falls back gracefully when sentence-transformers / FAISS not available.
"""
import os
import json
import sys
import pickle
from pathlib import Path
from typing import List, Dict

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import settings

# ─── Knowledge Corpus ────────────────────────────────────────────────────────

KNOWLEDGE_CORPUS = [
    {
        "id": "jeevamrut_001",
        "title": "Jeevamrut - Preparation",
        "content": "Jeevamrut is a liquid biofertilizer made from desi cow dung, cow urine, jaggery, gram flour, and local soil. Mix 10kg cow dung, 10L cow urine, 2kg jaggery, 2kg gram flour, and one handful of soil in 200L water. Stir twice daily and keep covered with jute for 48 hours. Use within 7 days at 200L per acre.",
        "source": "ICAR Natural Farming Guide",
        "tags": ["jeevamrut", "biofertilizer", "preparation", "organic"],
        "category": "preparations"
    },
    {
        "id": "jeevamrut_002",
        "title": "Jeevamrut - Benefits",
        "content": "Jeevamrut increases soil microorganism count by 10 to 100 times. It improves soil aeration, water retention, and naturally suppresses plant diseases. Regular application over 3 seasons significantly reduces need for external inputs. Best applied early morning before 9 AM for maximum absorption.",
        "source": "Subhash Palekar ZBNF Manual",
        "tags": ["jeevamrut", "soil_health", "microorganisms", "zbnf"],
        "category": "preparations"
    },
    {
        "id": "beejamrut_001",
        "title": "Beejamrut - Seed Treatment",
        "content": "Beejamrut is a seed treatment solution that protects seeds from soil-borne diseases and activates dormant seeds. Prepare with 5kg fresh desi cow dung, 5L cow urine, 50g lime, and one handful of local soil in 20L water. Soak seeds for 30 minutes, dry in shade, and sow within 24 hours. Improves germination by 20-30%.",
        "source": "ICAR Organic Farming Manual",
        "tags": ["beejamrut", "seed_treatment", "germination", "organic"],
        "category": "preparations"
    },
    {
        "id": "ghan_jeevamrut_001",
        "title": "Ghan Jeevamrut - Solid Fertilizer",
        "content": "Ghan Jeevamrut is the solid form of Jeevamrut with 6-month shelf life. Mix 100kg fresh cow dung, 1kg jaggery dissolved in cow urine, 1kg gram flour, and 1kg shady soil. Keep moist under jute for 4-5 days, stirring every 3 days. Apply 100-200 kg per acre during last ploughing. Provides sustained nutrition over 3-4 months.",
        "source": "KVK Natural Farming Guide",
        "tags": ["ghan_jeevamrut", "solid_fertilizer", "basal_dressing"],
        "category": "preparations"
    },
    {
        "id": "pm_kisan_001",
        "title": "PM-KISAN Scheme",
        "content": "PM-KISAN provides Rs 6000 per year to small and marginal farmers in three equal installments of Rs 2000 every four months. Eligibility: farmers with cultivable land up to 2 hectares, Aadhaar card, and bank account. Not eligible if family member is a current or former government employee or income tax payer. Apply at pmkisan.gov.in or nearest Common Service Centre.",
        "source": "Ministry of Agriculture - PM-KISAN Guidelines 2024",
        "tags": ["pm_kisan", "government_scheme", "income_support", "subsidy"],
        "category": "schemes"
    },
    {
        "id": "pkvy_001",
        "title": "PKVY - Organic Farming Scheme",
        "content": "Paramparagat Krishi Vikas Yojana provides Rs 50,000 per hectare over 3 years for organic farming clusters. Minimum cluster size is 20 hectares. Support covers organic inputs, certification, and market linkage. Farmers receive training on organic practices and Participatory Guarantee System (PGS) certification. Apply through state agriculture department.",
        "source": "PKVY Implementation Guidelines - Ministry of Agriculture",
        "tags": ["pkvy", "organic_farming", "certification", "subsidy"],
        "category": "schemes"
    },
    {
        "id": "nmnf_001",
        "title": "National Mission on Natural Farming",
        "content": "The National Mission on Natural Farming (NMNF) provides Rs 15,000 per hectare to farmers adopting Zero Budget Natural Farming. Includes free training on Jeevamrut, Beejamrut, Dashaparni Ark preparation. Priority given to marginal and small farmers. Farmers must complete mandatory 3-day training. Apply through Block Agriculture Office or KVK.",
        "source": "NMNF Government Notification 2023",
        "tags": ["nmnf", "zbnf", "natural_farming", "training"],
        "category": "schemes"
    },
    {
        "id": "soil_health_001",
        "title": "Soil Health Card Scheme",
        "content": "The Soil Health Card scheme provides free soil testing for 12 parameters including pH, nitrogen, phosphorus, potassium, sulfur, zinc, iron, copper, manganese, boron, and organic carbon. Apply every 2 years at nearest Soil Testing Laboratory. Results available in 4-6 weeks with customized fertilizer recommendations. Website: soilhealth.dac.gov.in",
        "source": "Department of Agriculture - SHC Guidelines",
        "tags": ["soil_health_card", "soil_testing", "nutrients", "free"],
        "category": "schemes"
    },
    {
        "id": "crop_rotation_001",
        "title": "Crop Rotation Principles",
        "content": "Crop rotation prevents soil depletion and breaks pest cycles. Never grow the same crop family consecutively. Follow legume-cereal-vegetable rotation. Example for Kharif-Rabi: Soybean followed by Wheat followed by Cotton. Legumes fix atmospheric nitrogen reducing need for external fertilizers. Maintain farm records of crop history for best results.",
        "source": "ICAR Crop Management Guide",
        "tags": ["crop_rotation", "soil_health", "pest_management", "nitrogen_fixation"],
        "category": "practices"
    },
    {
        "id": "companion_planting_001",
        "title": "Companion Planting Guide",
        "content": "Companion planting uses plant interactions for natural pest control. Marigold repels nematodes and whiteflies - plant as border crop. Basil protects tomatoes from aphids. Cowpea as border crop for cotton traps bollworm. Mustard planted with wheat repels aphids. Soybean and jowar intercropping improves biodiversity. Use 6:2 row ratio for main and companion crops.",
        "source": "Subhash Palekar Natural Farming Manual",
        "tags": ["companion_planting", "pest_control", "intercropping", "biodiversity"],
        "category": "practices"
    },
    {
        "id": "neem_pest_001",
        "title": "Neem Oil Organic Pest Control",
        "content": "Neem oil spray is the most versatile organic pesticide. Prepare: 5ml neem oil plus 1ml liquid soap per litre of water. Spray every 7-10 days for aphids, whiteflies, mites, and fungal infections. Spray in evening to avoid harming pollinators. Do not spray during rain or strong wind. Safe for beneficial insects when used correctly.",
        "source": "ICAR Integrated Pest Management Guide",
        "tags": ["neem_oil", "pest_control", "organic", "spray"],
        "category": "pest_management"
    },
    {
        "id": "dashaparni_001",
        "title": "Dashaparni Ark Preparation",
        "content": "Dashaparni Ark is an organic pesticide made from 10 leaves including neem, papaya, guava, custard apple, pomegranate, lantana, nirgundi, marigold, tulsi, and drumstick. Pound 3kg of leaves, add to 10L water with 200g cow dung and 200ml cow urine. Ferment for 10 days stirring daily. Dilute 1:10 with water before spraying every 15 days.",
        "source": "Subhash Palekar ZBNF - Crop Protection",
        "tags": ["dashaparni", "organic_pesticide", "fermentation", "zbnf"],
        "category": "pest_management"
    },
    {
        "id": "water_conservation_001",
        "title": "Water Conservation in Farming",
        "content": "Drip irrigation reduces water use by 40-50% compared to flood irrigation. Mulching with dry leaves or crop residue reduces evaporation by 30%. Contour bunding on slopes reduces runoff by 60%. Farm ponds capture rainwater for lean season. Ridge and furrow method improves infiltration. Irrigate in evening or early morning to reduce evaporation losses.",
        "source": "ICAR Water Management Guide",
        "tags": ["water_conservation", "drip_irrigation", "mulching", "rainwater"],
        "category": "practices"
    },
    {
        "id": "multilevel_farming_001",
        "title": "Multilevel Farming System",
        "content": "Multilevel farming uses four vertical layers: canopy trees (mango, coconut at 15-30ft), sub-canopy (banana, papaya at 8-15ft), shrubs (tomato, brinjal at 2-5ft), and ground layer (ginger, groundnut at 0-2ft). This mimics natural forest and gives 3-4x income per acre. Best suited for farms under 2 acres. Requires 2-3 year investment before full returns.",
        "source": "Subhash Palekar Natural Farming Manual",
        "tags": ["multilevel_farming", "agroforestry", "income", "biodiversity"],
        "category": "practices"
    },
    {
        "id": "kharif_crops_001",
        "title": "Kharif Season Crop Guide",
        "content": "Kharif season runs June to October with monsoon rains. Major crops: paddy, soybean, cotton, maize, groundnut, jowar, bajra, moong, urad. Sowing time after first 75mm rainfall. Key practice: seed treatment with Beejamrut 48 hours before sowing. Apply Jeevamrut at sowing and every 15 days. Harvest when 80% of pods or ears are mature.",
        "source": "ICAR Kharif Crop Production Guide",
        "tags": ["kharif", "sowing", "monsoon", "crop_guide"],
        "category": "seasonal"
    },
    {
        "id": "rabi_crops_001",
        "title": "Rabi Season Crop Guide",
        "content": "Rabi season runs October to March in cool, dry weather. Major crops: wheat, mustard, chickpea, lentil, peas, sunflower. Wheat sowing window: November 1-25 for best yield. Mustard sowing: October 1-20. Chickpea needs well-drained soil and no excess moisture. Apply Ghan Jeevamrut at field preparation. Irrigate wheat at crown root initiation, tillering, and grain filling stages.",
        "source": "ICAR Rabi Crop Production Guide",
        "tags": ["rabi", "wheat", "mustard", "chickpea", "winter"],
        "category": "seasonal"
    },
    {
        "id": "organic_certification_001",
        "title": "Organic Certification Process",
        "content": "India has two organic certification systems: Third Party Certification (TPC) for export and Participatory Guarantee System (PGS) for domestic market. PGS is free and farmer-managed. TPC costs Rs 15,000-25,000 per year. Both require 3-year chemical-free transition period. PGS India is managed through pgsindia-ncof.gov.in. Certified organic produce commands 20-100% price premium.",
        "source": "NCOF Organic Certification Guidelines",
        "tags": ["organic_certification", "pgs", "premium", "export"],
        "category": "marketing"
    },
    {
        "id": "vermicompost_001",
        "title": "Vermicompost Preparation",
        "content": "Vermicompost uses earthworms to convert organic waste into high-quality manure. Use Eisenia fetida (red wigglers) in a shaded pit. Add kitchen waste, crop residue, and animal dung in 4:1 ratio. Maintain 40-50% moisture. Worms process material in 45-60 days. Apply 2-3 tonnes per acre per season. Vermicompost improves soil structure, nutrient content, and water retention significantly.",
        "source": "ICAR Organic Farming Manual",
        "tags": ["vermicompost", "earthworms", "soil_amendment", "organic"],
        "category": "preparations"
    },
    {
        "id": "pmfby_001",
        "title": "PMFBY Crop Insurance",
        "content": "Pradhan Mantri Fasal Bima Yojana covers crop losses from natural calamities, pests, and diseases. Premium: 2% for Kharif crops, 1.5% for Rabi crops, 5% for horticulture. Coverage includes pre-sowing losses, post-harvest losses, and localized calamities. Report crop loss within 72 hours to insurer. Claim settled within 2 months. Enroll before notified cut-off date. Helpline: 1800-200-7710",
        "source": "PMFBY Implementation Guidelines 2024",
        "tags": ["pmfby", "crop_insurance", "calamity", "premium"],
        "category": "schemes"
    },
    {
        "id": "kcc_001",
        "title": "Kisan Credit Card",
        "content": "Kisan Credit Card provides revolving credit up to Rs 3 lakh at 4% annual interest (7% with 3% government subvention for prompt repayment). Covers crop cultivation, post-harvest expenses, and allied activities. No collateral required for loans up to Rs 1.6 lakh. Accident insurance coverage included. Apply at any nationalized bank or cooperative bank with land records and Aadhaar.",
        "source": "RBI KCC Guidelines 2024",
        "tags": ["kcc", "credit", "loan", "interest"],
        "category": "schemes"
    }
]


class SimpleRAG:
    """
    Lightweight RAG using TF-IDF keyword matching.
    Falls back to keyword search when FAISS/sentence-transformers unavailable.
    """

    def __init__(self):
        self.corpus = KNOWLEDGE_CORPUS
        self._index = None
        self._use_faiss = False
        self._try_faiss()

    def _try_faiss(self):
        """Try to initialize FAISS index."""
        try:
            import numpy as np
            import faiss

            index_path = Path(settings.FAISS_INDEX_PATH)
            index_path.parent.mkdir(parents=True, exist_ok=True)
            pkl_path = index_path.with_suffix('.pkl')

            if index_path.with_suffix('.index').exists() and pkl_path.exists():
                self._index = faiss.read_index(str(index_path.with_suffix('.index')))
                with open(pkl_path, 'rb') as f:
                    self._texts = pickle.load(f)
                self._use_faiss = True
        except Exception:
            pass

    def _keyword_score(self, query: str, doc: dict) -> float:
        """Simple keyword overlap scoring."""
        query_words = set(query.lower().split())
        doc_text = f"{doc['title']} {doc['content']} {' '.join(doc['tags'])}".lower()
        doc_words = set(doc_text.split())
        overlap = query_words & doc_words
        return len(overlap) / (len(query_words) + 1)

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieve most relevant knowledge chunks for a query."""
        if self._use_faiss and self._index is not None:
            return self._faiss_retrieve(query, top_k)
        return self._keyword_retrieve(query, top_k)

    def _keyword_retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        scored = [(self._keyword_score(query, doc), doc) for doc in self.corpus]
        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, doc in scored[:top_k]:
            if score > 0:
                results.append({
                    "id": doc["id"],
                    "title": doc["title"],
                    "content": doc["content"][:300],
                    "source": doc["source"],
                    "score": round(score, 3),
                    "tags": doc["tags"][:3]
                })
        return results

    def _faiss_retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        """FAISS-based semantic retrieval (when available)."""
        try:
            import numpy as np
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer('all-MiniLM-L6-v2')
            vec = model.encode([query]).astype('float32')
            _, indices = self._index.search(vec, top_k)
            results = []
            for idx in indices[0]:
                if 0 <= idx < len(self.corpus):
                    doc = self.corpus[idx]
                    results.append({
                        "id": doc["id"],
                        "title": doc["title"],
                        "content": doc["content"][:300],
                        "source": doc["source"],
                        "score": 0.9,
                        "tags": doc["tags"][:3]
                    })
            return results
        except Exception:
            return self._keyword_retrieve(query, top_k)

    def build_faiss_index(self):
        """Build and save FAISS index from corpus (optional, call once)."""
        try:
            import numpy as np
            import faiss
            from sentence_transformers import SentenceTransformer

            model = SentenceTransformer('all-MiniLM-L6-v2')
            texts = [f"{d['title']} {d['content']}" for d in self.corpus]
            embeddings = model.encode(texts).astype('float32')

            dim = embeddings.shape[1]
            index = faiss.IndexFlatL2(dim)
            index.add(embeddings)

            index_path = Path(settings.FAISS_INDEX_PATH)
            index_path.parent.mkdir(parents=True, exist_ok=True)
            faiss.write_index(index, str(index_path.with_suffix('.index')))
            with open(index_path.with_suffix('.pkl'), 'wb') as f:
                pickle.dump(texts, f)

            self._index = index
            self._use_faiss = True
            return True, f"Index built with {len(texts)} documents"
        except ImportError:
            return False, "sentence-transformers not installed. Using keyword search."
        except Exception as e:
            return False, str(e)

    def format_context(self, query: str) -> str:
        """Return formatted context string for LLM prompt."""
        results = self.retrieve(query, top_k=3)
        if not results:
            return ""
        parts = ["Relevant knowledge from farming database:"]
        for r in results:
            parts.append(f"\n[{r['source']}]\n{r['content']}")
        return "\n".join(parts)

    def get_corpus_stats(self) -> dict:
        categories = {}
        for doc in self.corpus:
            cat = doc.get('category', 'other')
            categories[cat] = categories.get(cat, 0) + 1
        return {
            "total_documents": len(self.corpus),
            "categories": categories,
            "faiss_enabled": self._use_faiss,
            "retrieval_method": "faiss_semantic" if self._use_faiss else "keyword_tfidf"
        }


# Singleton instance
_rag_instance = None

def get_rag() -> SimpleRAG:
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = SimpleRAG()
    return _rag_instance
