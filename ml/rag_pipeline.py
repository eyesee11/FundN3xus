#!/usr/bin/env python3
"""
FundN3xus RAG Pipeline - Financial Data Intelligence
RAG system for intelligent financial insights based on your dataset.

Usage: 
    python ml/rag_pipeline.py

This pipeline:
1. Loads your financial dataset
2. Creates embeddings of financial records
3. Stores them in a vector database
4. Enables semantic search and Q&A over your financial data
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
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate

# Try to import RetrievalQA from langchain-classic
try:
    from langchain_classic.chains.retrieval_qa.base import RetrievalQA
except ImportError:
    # Fallback to creating a simple retrieval chain manually
    RetrievalQA = None

# For Gemini integration (since your project uses Gemini)
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logging.warning("Google Generative AI not available. Install: pip install langchain-google-genai")

# Load environment variables
load_dotenv()

# Configuration
DATASET_PATH = os.getenv('DATASET_PATH', 'ml/dataset.csv')
VECTOR_DB_PATH = os.getenv('VECTOR_DB_PATH', 'ml/vector_db')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class FinancialRAGPipeline:
    """RAG Pipeline for Financial Data Intelligence"""
    
    def __init__(
        self,
        dataset_path: str = DATASET_PATH,
        vector_db_path: str = VECTOR_DB_PATH,
        embedding_model: str = EMBEDDING_MODEL
    ):
        """Initialize RAG pipeline"""
        self.dataset_path = dataset_path
        self.vector_db_path = vector_db_path
        self.embedding_model_name = embedding_model
        
        # Initialize components
        self.embeddings = None
        self.vectorstore = None
        self.qa_chain = None
        self.llm = None
        
        logger.info("Initializing Financial RAG Pipeline...")
        
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
        
        # Sample approach: Create rich text representation of each record
        for idx, row in df.iterrows():
            # Create a narrative description of the financial profile
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
            
            # Create metadata for filtering and retrieval
            metadata = {
                'record_id': idx,
                'age': int(row['age']),
                'income': float(row['income']),
                'credit_score': int(row['credit_score']),
                'financial_health_score': float(row['financial_health_score']),
                'scenario_category': str(row['scenario_category']),
                'debt_to_income': float(row['debt_to_income']),
                'savings_rate': float(row['savings_rate'])
            }
            
            doc = Document(page_content=text, metadata=metadata)
            documents.append(doc)
        
        logger.info(f"Created {len(documents)} documents from dataset")
        return documents
    
    def initialize_embeddings(self):
        """Initialize embedding model"""
        logger.info(f"Initializing embeddings with {self.embedding_model_name}")
        
        # Use HuggingFace embeddings (free, local)
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.embedding_model_name,
            model_kwargs={'device': 'cpu'},  # Use 'cuda' if GPU available
            encode_kwargs={'normalize_embeddings': True}
        )
        
        logger.info("Embeddings initialized successfully")
    
    def create_vector_store(self, documents: List[Document], force_recreate: bool = False):
        """Create or load vector store"""
        
        if os.path.exists(self.vector_db_path) and not force_recreate:
            logger.info(f"Loading existing vector store from {self.vector_db_path}")
            self.vectorstore = Chroma(
                persist_directory=self.vector_db_path,
                embedding_function=self.embeddings
            )
            logger.info("Vector store loaded successfully")
        else:
            logger.info("Creating new vector store...")
            
            # Create vector store with documents
            self.vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                persist_directory=self.vector_db_path
            )
            
            # Persist the vector store
            self.vectorstore.persist()
            logger.info(f"Vector store created and persisted to {self.vector_db_path}")
    
    def initialize_llm(self):
        """Initialize LLM for generation"""
        logger.info("Initializing LLM...")
        
        if GEMINI_AVAILABLE and GEMINI_API_KEY:
            # Use Gemini (since your project uses it)
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
            return
    
    def create_qa_chain(self):
        """Create RAG QA chain"""
        
        if not self.llm:
            logger.warning("LLM not initialized, skipping QA chain creation")
            return
        
        logger.info("Creating RAG QA chain...")
        
        # Custom prompt for financial domain
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
        
        # Create retrieval QA chain
        if RetrievalQA is not None:
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 5}  # Retrieve top 5 most relevant documents
                ),
                return_source_documents=True,
                chain_type_kwargs={"prompt": PROMPT}
            )
            logger.info("QA chain created successfully")
        else:
            logger.warning("RetrievalQA not available. Will use basic retrieval only.")
            self.qa_chain = None
    
    def setup_pipeline(self, force_recreate: bool = False):
        """Setup complete RAG pipeline"""
        logger.info("Setting up RAG pipeline...")
        
        # Step 1: Load dataset
        df = self.load_dataset()
        
        # Step 2: Prepare documents
        documents = self.prepare_documents(df)
        
        # Step 3: Initialize embeddings
        self.initialize_embeddings()
        
        # Step 4: Create vector store
        self.create_vector_store(documents, force_recreate=force_recreate)
        
        # Step 5: Initialize LLM
        self.initialize_llm()
        
        # Step 6: Create QA chain
        if self.llm:
            self.create_qa_chain()
        
        logger.info("✅ RAG pipeline setup complete!")
    
    def query(self, question: str, return_sources: bool = True) -> Dict[str, Any]:
        """Query the RAG system"""
        
        if not self.vectorstore:
            raise ValueError("Vector store not initialized. Call setup_pipeline() first.")
        
        logger.info(f"Query: {question}")
        
        # If we have QA chain, use it for generation
        if self.qa_chain:
            result = self.qa_chain({"query": question})
            
            response = {
                'answer': result['result'],
                'sources': []
            }
            
            if return_sources and 'source_documents' in result:
                for doc in result['source_documents']:
                    response['sources'].append({
                        'content': doc.page_content[:500] + '...',  # Truncate for display
                        'metadata': doc.metadata
                    })
        else:
            # Fallback: just return relevant documents
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
            'vector_db_path': self.vector_db_path,
            'embedding_model': self.embedding_model_name,
            'vector_store_initialized': self.vectorstore is not None,
            'llm_initialized': self.llm is not None,
            'qa_chain_initialized': self.qa_chain is not None
        }
        
        if self.vectorstore:
            # Try to get collection info
            try:
                collection = self.vectorstore._collection
                stats['total_documents'] = collection.count()
            except:
                stats['total_documents'] = 'Unknown'
        
        return stats


def main():
    """Main execution function with example usage"""
    
    print("🚀 FundN3xus RAG Pipeline - Financial Intelligence System")
    print("=" * 60)
    
    # Initialize pipeline
    rag = FinancialRAGPipeline()
    
    # Setup pipeline (set force_recreate=True to rebuild vector store)
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
        "What is the average financial health score for people with high income?",
        "Show me profiles with low debt-to-income ratios and high savings rates",
        "What investment strategies are recommended for 30-year-olds?",
        "Compare financial health between different age groups"
    ]
    
    for query in example_queries:
        print(f"\n🔍 Query: {query}")
        
        try:
            result = rag.query(query, return_sources=True)
            print(f"📝 Answer: {result['answer'][:500]}...")
            
            if result['sources']:
                print(f"📚 Retrieved {len(result['sources'])} relevant profiles")
        except Exception as e:
            logger.error(f"Query failed: {e}")
    
    print("\n" + "=" * 60)
    print("✅ RAG Pipeline Demo Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
