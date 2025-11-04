#!/usr/bin/env python3
"""
FundN3xus RAG Pipeline with Pinecone
Cloud-based vector database for production-scale RAG.

Advantages of Pinecone over ChromaDB:
- ✅ Cloud-hosted (no local storage needed)
- ✅ Scalable to billions of vectors
- ✅ Fast queries even with large datasets
- ✅ Built-in monitoring and analytics
- ✅ Multi-region support
- ✅ Automatic backups

Setup:
1. Sign up at https://www.pinecone.io/
2. Create an index
3. Get API key
4. Set PINECONE_API_KEY and PINECONE_ENVIRONMENT in .env

Usage:
    python rag_pipeline_pinecone.py
"""

import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

import pandas as pd
import numpy as np
from dotenv import load_dotenv

# LangChain imports
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.retrievers import BaseRetriever
from langchain_core.callbacks import CallbackManagerForRetrieverRun

# Try to import RetrievalQA from langchain-classic
try:
    from langchain_classic.chains.retrieval_qa.base import RetrievalQA
except ImportError:
    # Fallback to creating a simple retrieval chain manually
    RetrievalQA = None

# Pinecone imports
try:
    from pinecone import Pinecone, ServerlessSpec
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False
    logging.error("Pinecone not installed. Run: pip install pinecone")

# For Gemini integration
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Load environment variables
load_dotenv()

# Pinecone Configuration
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY', '')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT', '')  # e.g., 'us-west1-gcp'
PINECONE_INDEX_NAME = os.getenv('PINECONE_INDEX_NAME', 'fundnexus-financial')

# Other Configuration
DATASET_PATH = os.getenv('DATASET_PATH', 'ml/dataset.csv')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PineconeRAGPipeline:
    """RAG Pipeline using Pinecone for scalable vector storage"""
    
    def __init__(
        self,
        dataset_path: str = DATASET_PATH,
        index_name: str = PINECONE_INDEX_NAME,
        embedding_model: str = EMBEDDING_MODEL
    ):
        """Initialize Pinecone RAG pipeline"""
        
        if not PINECONE_AVAILABLE:
            raise ImportError("Pinecone not installed. Run: pip install pinecone-client")
        
        if not PINECONE_API_KEY or not PINECONE_ENVIRONMENT:
            raise ValueError(
                "Pinecone credentials not found. Set PINECONE_API_KEY and "
                "PINECONE_ENVIRONMENT in .env file"
            )
        
        self.dataset_path = dataset_path
        self.index_name = index_name
        self.embedding_model_name = embedding_model
        
        # Initialize components
        self.embeddings = None
        self.vectorstore = None
        self.qa_chain = None
        self.llm = None
        self.index = None
        
        logger.info("Initializing Pinecone RAG Pipeline...")
        
    def initialize_pinecone(self):
        """Initialize Pinecone connection using new API"""
        logger.info("Connecting to Pinecone...")
        
        # Initialize Pinecone client with new API
        pc = Pinecone(api_key=PINECONE_API_KEY)
        self.pc = pc
        
        logger.info(f"Pinecone initialized successfully")
        
        # Check if index exists
        existing_indexes = [index.name for index in pc.list_indexes()]
        logger.info(f"Existing Pinecone indexes: {existing_indexes}")
        
        if self.index_name not in existing_indexes:
            logger.warning(f"Index '{self.index_name}' not found. Creating new index...")
            
            # Create index with appropriate dimension
            # all-MiniLM-L6-v2 produces 384-dimensional vectors
            # all-mpnet-base-v2 produces 768-dimensional vectors
            dimension = 384  # Adjust based on your embedding model
            
            pc.create_index(
                name=self.index_name,
                dimension=dimension,
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region=PINECONE_ENVIRONMENT or 'us-east-1'
                )
            )
            logger.info(f"Created new Pinecone index: {self.index_name}")
        
        # Connect to index
        self.index = pc.Index(self.index_name)
        logger.info(f"Connected to Pinecone index: {self.index_name}")
        
        # Get index stats
        stats = self.index.describe_index_stats()
        logger.info(f"Index stats: {stats}")
    
    def load_dataset(self) -> pd.DataFrame:
        """Load financial dataset"""
        logger.info(f"Loading dataset from {self.dataset_path}")
        
        if not os.path.exists(self.dataset_path):
            raise FileNotFoundError(f"Dataset not found at {self.dataset_path}")
        
        df = pd.read_csv(self.dataset_path)
        logger.info(f"Loaded {len(df)} financial records with {len(df.columns)} features")
        
        return df
    
    def prepare_documents(self, df: pd.DataFrame) -> List[Document]:
        """Convert financial records to LangChain documents"""
        logger.info("Preparing documents from financial records...")
        
        documents = []
        
        for idx, row in df.iterrows():
            # Create rich text representation
            text = f"""
Financial Profile #{idx + 1}:

Demographics:
- Age: {row['age']} years old
- Employment Years: {row['employment_years']} years
- Number of Dependents: {row['num_dependents']}

Financial Overview:
- Annual Income: ${row['income']:,.2f}
- Annual Expenses: ${row['expenses']:,.2f}
- Current Savings: ${row['savings']:,.2f}
- Total Debt: ${row['debt']:,.2f}
- Investment Amount: ${row['investment_amount']:,.2f}
- Property Value: ${row['property_value']:,.2f}

Financial Metrics:
- Credit Score: {row['credit_score']:.0f}
- Savings Rate: {row['savings_rate']*100:.1f}%
- Debt-to-Income Ratio: {row['debt_to_income']:.2f}
- Expense Ratio: {row['expense_ratio']*100:.1f}%

AI Predictions:
- Investment Risk Score: {row['investment_risk_score']:.1f}/100
- Affordability Amount: ${row['affordability_amount']:,.2f}
- Financial Health Score: {row['financial_health_score']:.1f}/100
- Recommended Scenario: {row['scenario_category']}

Profile Summary:
This is a {row['age']}-year-old individual with {row['employment_years']} years of employment 
and {row['num_dependents']} dependent(s). They earn ${row['income']:,.2f} annually, 
with a savings rate of {row['savings_rate']*100:.1f}% and a financial health score of 
{row['financial_health_score']:.1f}/100. Their recommended investment scenario is {row['scenario_category']}.
"""
            
            # Create metadata (Pinecone supports filtering on these)
            metadata = {
                'record_id': int(idx),
                'age': int(row['age']),
                'income': float(row['income']),
                'credit_score': int(row['credit_score']),
                'financial_health_score': float(row['financial_health_score']),
                'scenario_category': str(row['scenario_category']),
                'debt_to_income': float(row['debt_to_income']),
                'savings_rate': float(row['savings_rate']),
                'employment_years': int(row['employment_years']),
                'num_dependents': int(row['num_dependents'])
            }
            
            doc = Document(page_content=text, metadata=metadata)
            documents.append(doc)
        
        logger.info(f"Created {len(documents)} documents from dataset")
        return documents
    
    def initialize_embeddings(self):
        """Initialize embedding model"""
        logger.info(f"Initializing embeddings with {self.embedding_model_name}")
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.embedding_model_name,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        logger.info("Embeddings initialized successfully")
    
    def create_vector_store(self, documents: List[Document], force_recreate: bool = False):
        """Create or update Pinecone vector store"""
        
        logger.info("Setting up Pinecone vector store...")
        
        if force_recreate:
            logger.warning("Force recreate enabled - deleting all vectors in index")
            self.index.delete(delete_all=True)
            logger.info("Index cleared")
        
        # Create vector store from documents
        logger.info(f"Uploading {len(documents)} documents to Pinecone...")
        
        # Upload documents directly to Pinecone
        # Upload in batches to avoid timeout
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i+batch_size]
            
            # Prepare vectors for upsert
            vectors_to_upsert = []
            for j, doc in enumerate(batch):
                vector_id = f"doc_{i+j}"
                text = doc.page_content
                metadata = doc.metadata
                metadata['text'] = text  # Store text in metadata for retrieval
                
                # Generate embedding
                embedding = self.embeddings.embed_query(text)
                
                vectors_to_upsert.append((vector_id, embedding, metadata))
            
            # Upsert to Pinecone
            self.index.upsert(vectors=vectors_to_upsert)
            logger.info(f"Uploaded batch {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1}")
        
        # Create a simple wrapper for the vectorstore
        self.vectorstore = self._create_vectorstore_wrapper()
        
        logger.info("✅ All documents uploaded to Pinecone successfully")
        
        # Get updated stats
        stats = self.index.describe_index_stats()
        logger.info(f"Index now contains {stats['total_vector_count']} vectors")
    
    def _create_vectorstore_wrapper(self):
        """Create a simple wrapper object for vector store operations"""
        class PineconeWrapper:
            def __init__(self, index, embeddings):
                self.index = index
                self.embeddings = embeddings
            
            def as_retriever(self, search_type="similarity", search_kwargs=None):
                """Create a retriever interface"""
                class PineconeRetriever(BaseRetriever):
                    index: Any = None
                    embeddings: Any = None
                    k: int = 5
                    
                    def __init__(self, index, embeddings, k=5):
                        super().__init__()
                        self.index = index
                        self.embeddings = embeddings
                        self.k = k
                    
                    def _get_relevant_documents(
                        self, query: str, *, run_manager: CallbackManagerForRetrieverRun = None
                    ) -> List[Document]:
                        # Generate query embedding
                        query_embedding = self.embeddings.embed_query(query)
                        
                        # Query Pinecone
                        results = self.index.query(
                            vector=query_embedding,
                            top_k=self.k,
                            include_metadata=True
                        )
                        
                        # Convert to Document objects
                        documents = []
                        for match in results['matches']:
                            metadata = match['metadata'].copy()
                            text = metadata.pop('text', '')
                            doc = Document(page_content=text, metadata=metadata)
                            documents.append(doc)
                        
                        return documents
                
                k = search_kwargs.get('k', 5) if search_kwargs else 5
                return PineconeRetriever(self.index, self.embeddings, k)
            
            def similarity_search(self, query, k=5, filter_dict=None):
                """Perform similarity search"""
                query_embedding = self.embeddings.embed_query(query)
                
                query_kwargs = {
                    'vector': query_embedding,
                    'top_k': k,
                    'include_metadata': True
                }
                if filter_dict:
                    query_kwargs['filter'] = filter_dict
                
                results = self.index.query(**query_kwargs)
                
                documents = []
                for match in results['matches']:
                    metadata = match['metadata']
                    text = metadata.pop('text', '')
                    doc = Document(page_content=text, metadata=metadata)
                    documents.append(doc)
                
                return documents
        
        return PineconeWrapper(self.index, self.embeddings)
    
    def initialize_llm(self):
        """Initialize LLM for generation"""
        logger.info("Initializing LLM...")
        
        if GEMINI_AVAILABLE and GEMINI_API_KEY:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=GEMINI_API_KEY,
                temperature=0.3,
                convert_system_message_to_human=True
            )
            logger.info("Using Google Gemini LLM")
        else:
            logger.warning("Gemini API key not found. Set GEMINI_API_KEY in .env")
            logger.warning("RAG pipeline will use retrieval only without generation")
    
    def create_qa_chain(self):
        """Create RAG QA chain"""
        
        if not self.llm:
            logger.warning("LLM not initialized, skipping QA chain creation")
            return
        
        logger.info("Creating RAG QA chain...")
        
        prompt_template = """You are a financial advisor AI assistant with access to a comprehensive financial dataset.
Use the following context (financial profiles) to answer the question accurately and provide insights.

Context:
{context}

Question: {question}

Instructions:
1. Analyze the relevant financial profiles from the context
2. Provide data-driven insights based on the patterns in the data
3. Use specific numbers and statistics when available
4. If you need to make recommendations, base them on similar profiles in the data
5. If the context doesn't contain relevant information, say so clearly

Answer:"""

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        if RetrievalQA is not None:
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 5}
                ),
                return_source_documents=True,
                chain_type_kwargs={"prompt": PROMPT}
            )
            logger.info("QA chain created successfully")
        else:
            logger.warning("RetrievalQA not available. Will use basic retrieval only.")
            self.qa_chain = None
    
    def setup_pipeline(self, force_recreate: bool = False):
        """Setup complete Pinecone RAG pipeline"""
        logger.info("Setting up Pinecone RAG pipeline...")
        
        # Step 1: Initialize Pinecone
        self.initialize_pinecone()
        
        # Step 2: Initialize embeddings
        self.initialize_embeddings()
        
        # Step 3: Check if vectors already exist in Pinecone
        stats = self.index.describe_index_stats()
        vector_count = stats.get('total_vector_count', 0)
        
        if vector_count > 0 and not force_recreate:
            logger.info(f"Found {vector_count} existing vectors in Pinecone index")
            logger.info("Skipping data upload (use force_recreate=True to rebuild)")
            # Just create the wrapper without uploading
            self.vectorstore = self._create_vectorstore_wrapper()
        else:
            # Step 3: Load dataset and prepare documents
            df = self.load_dataset()
            documents = self.prepare_documents(df)
            
            # Step 4: Create/update vector store
            self.create_vector_store(documents, force_recreate=force_recreate)
        
        # Step 5: Initialize LLM
        self.initialize_llm()
        
        # Step 6: Create QA chain
        if self.llm:
            self.create_qa_chain()
        
        logger.info("✅ Pinecone RAG pipeline setup complete!")
    
    def query(self, question: str, return_sources: bool = True) -> Dict[str, Any]:
        """Query the RAG system"""
        
        if not self.vectorstore:
            raise ValueError("Vector store not initialized. Call setup_pipeline() first.")
        
        logger.info(f"Query: {question}")
        
        if self.qa_chain:
            result = self.qa_chain({"query": question})
            
            response = {
                'answer': result['result'],
                'sources': []
            }
            
            if return_sources and 'source_documents' in result:
                for doc in result['source_documents']:
                    response['sources'].append({
                        'content': doc.page_content[:500] + '...',
                        'metadata': doc.metadata
                    })
        else:
            docs = self.vectorstore.similarity_search(question, k=5)
            
            response = {
                'answer': 'LLM not available. Here are relevant financial profiles:',
                'sources': []
            }
            
            for doc in docs:
                response['sources'].append({
                    'content': doc.page_content,
                    'metadata': doc.metadata
                })
        
        return response
    
    def similarity_search(
        self, 
        query: str, 
        k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Document]:
        """Perform similarity search with optional filtering"""
        
        if not self.vectorstore:
            raise ValueError("Vector store not initialized. Call setup_pipeline() first.")
        
        if filter_dict:
            docs = self.vectorstore.similarity_search(
                query, 
                k=k,
                filter=filter_dict
            )
        else:
            docs = self.vectorstore.similarity_search(query, k=k)
        
        return docs
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the RAG system"""
        
        stats = {
            'vector_db_path': f"Pinecone Cloud ({self.index_name})",  # For compatibility with training script
            'index_name': self.index_name,
            'embedding_model': self.embedding_model_name,
            'vector_store_initialized': self.vectorstore is not None,
            'llm_initialized': self.llm is not None,
            'qa_chain_initialized': self.qa_chain is not None,
            'environment': PINECONE_ENVIRONMENT
        }
        
        if self.index:
            try:
                index_stats = self.index.describe_index_stats()
                stats['total_documents'] = index_stats.get('total_vector_count', 0)
                stats['total_vectors'] = index_stats.get('total_vector_count', 0)
                stats['index_fullness'] = index_stats.get('index_fullness', 0)
            except:
                stats['total_documents'] = 'Unknown'
                stats['total_vectors'] = 'Unknown'
        
        return stats


def main():
    """Main execution function"""
    
    print("🚀 FundN3xus Pinecone RAG Pipeline")
    print("=" * 60)
    
    # Check requirements
    if not PINECONE_AVAILABLE:
        print("❌ Pinecone not installed")
        print("   Run: pip install pinecone-client")
        return
    
    if not PINECONE_API_KEY or not PINECONE_ENVIRONMENT:
        print("❌ Pinecone credentials not configured")
        print("   Set PINECONE_API_KEY and PINECONE_ENVIRONMENT in .env")
        print("   See PINECONE_GUIDE.md for instructions")
        return
    
    # Initialize pipeline
    rag = PineconeRAGPipeline()
    
    # Setup pipeline
    rag.setup_pipeline(force_recreate=False)
    
    # Display statistics
    stats = rag.get_statistics()
    print("\n📊 Pipeline Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Example queries
    print("\n" + "=" * 60)
    print("Example Queries:")
    print("=" * 60)
    
    example_queries = [
        "What is the average financial health score?",
        "Show me profiles with high savings and low debt"
    ]
    
    for query in example_queries:
        print(f"\n🔍 Query: {query}")
        
        try:
            result = rag.query(query)
            print(f"📝 Answer: {result['answer'][:300]}...")
        except Exception as e:
            logger.error(f"Query failed: {e}")
    
    print("\n✅ Pinecone RAG Pipeline Ready!")


if __name__ == "__main__":
    main()
