#!/usr/bin/env python3
"""
FundN3xus RAG Embedding Training Script

This script "trains" (creates embeddings for) your dataset for RAG.
Unlike traditional ML training, this process:
1. Loads your financial dataset
2. Converts each record to text
3. Creates vector embeddings
4. Stores them in a vector database

Run this after:
- Adding new data to dataset.csv
- Changing embedding models
- Switching vector databases

Usage:
    python train_rag_embeddings.py
    python train_rag_embeddings.py --force-rebuild
    python train_rag_embeddings.py --database pinecone
"""

import argparse
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

from rag_pipeline import FinancialRAGPipeline

# Load environment
load_dotenv()

# Will be set based on command-line arguments
RAG_PIPELINE_CLASS = FinancialRAGPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def train_embeddings(
    force_rebuild: bool = False,
    dataset_path: str = None,
    embedding_model: str = None
):
    """
    Train (create) embeddings for your financial dataset.
    
    Args:
        force_rebuild: If True, rebuilds vector store even if it exists
        dataset_path: Path to dataset CSV file
        embedding_model: Name of embedding model to use
    """
    
    print("=" * 70)
    print("🚀 FundN3xus RAG Embedding Training")
    print("=" * 70)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    start_time = datetime.now()
    
    # Initialize pipeline with custom settings if provided
    kwargs = {}
    if dataset_path:
        kwargs['dataset_path'] = dataset_path
    if embedding_model:
        kwargs['embedding_model'] = embedding_model
    
    logger.info("Initializing RAG pipeline...")
    rag = RAG_PIPELINE_CLASS(**kwargs)
    
    # Setup pipeline (this creates/loads embeddings)
    logger.info(f"Force rebuild: {force_rebuild}")
    rag.setup_pipeline(force_recreate=force_rebuild)
    
    # Get statistics
    stats = rag.get_statistics()
    
    # Calculate duration
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    # Print summary
    print()
    print("=" * 70)
    print("✅ RAG EMBEDDING TRAINING COMPLETE")
    print("=" * 70)
    print(f"Duration: {duration:.1f} seconds")
    print()
    print("📊 Statistics:")
    print(f"  Vector Database: {stats['vector_db_path']}")
    print(f"  Embedding Model: {stats['embedding_model']}")
    print(f"  Total Documents: {stats.get('total_documents', 'Unknown')}")
    print(f"  Vector Store Ready: {stats['vector_store_initialized']}")
    print(f"  LLM Ready: {stats['llm_initialized']}")
    print(f"  QA Chain Ready: {stats['qa_chain_initialized']}")
    print()
    print("🎯 Next Steps:")
    print("  1. Start RAG server: python rag_server.py")
    print("  2. Test queries: http://localhost:8001/docs")
    print("  3. Integrate with your app using rag-api.ts")
    print()
    print("💡 Tip: Run with --force-rebuild to recreate embeddings")
    print("=" * 70)
    
    return rag


def test_embeddings(rag: FinancialRAGPipeline):
    """Test the embeddings with sample queries"""
    
    print()
    print("=" * 70)
    print("🧪 Testing RAG System")
    print("=" * 70)
    
    test_queries = [
        "What is the average financial health score?",
        "Show me profiles with high savings rates",
        "What are common characteristics of low-risk investors?"
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n{i}. Query: {query}")
        print("-" * 70)
        
        try:
            # Perform similarity search (faster than full QA)
            docs = rag.similarity_search(query, k=3)
            
            print(f"   Found {len(docs)} relevant profiles")
            
            if docs:
                # Show first result's metadata
                first_doc = docs[0]
                meta = first_doc.metadata
                print(f"   Top match: Age {meta['age']}, Income ${meta['income']:,.0f}")
                print(f"              Health Score: {meta['financial_health_score']:.1f}")
                print(f"              Scenario: {meta['scenario_category']}")
        
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print()
    print("=" * 70)


def main():
    """Main execution with command-line arguments"""
    
    parser = argparse.ArgumentParser(
        description='Train RAG embeddings for FundN3xus financial dataset'
    )
    
    parser.add_argument(
        '--force-rebuild',
        action='store_true',
        help='Force rebuild of vector store even if it exists'
    )
    
    parser.add_argument(
        '--dataset',
        type=str,
        help='Path to dataset CSV file (default: from .env or ml/dataset.csv)'
    )
    
    parser.add_argument(
        '--embedding-model',
        type=str,
        help='Embedding model to use (default: from .env or sentence-transformers/all-MiniLM-L6-v2)'
    )
    
    parser.add_argument(
        '--test',
        action='store_true',
        help='Run test queries after training'
    )
    
    parser.add_argument(
        '--database',
        type=str,
        choices=['chroma', 'pinecone'],
        default='chroma',
        help='Vector database to use (default: chroma)'
    )
    
    args = parser.parse_args()
    
    # Select the appropriate RAG pipeline
    global RAG_PIPELINE_CLASS
    if args.database == 'pinecone':
        print("🔧 Using Pinecone vector database")
        print("   Make sure you have:")
        print("   1. Installed: pip install pinecone-client")
        print("   2. Set PINECONE_API_KEY and PINECONE_INDEX_NAME in .env")
        print()
        
        try:
            from rag_pipeline_pinecone import PineconeRAGPipeline
            RAG_PIPELINE_CLASS = PineconeRAGPipeline
            print("✅ Pinecone pipeline loaded successfully")
            print()
        except ImportError as e:
            print(f"❌ Error: Could not import Pinecone pipeline: {e}")
            print("   Please install: pip install pinecone-client")
            return
    
    try:
        # Train embeddings
        rag = train_embeddings(
            force_rebuild=args.force_rebuild,
            dataset_path=args.dataset,
            embedding_model=args.embedding_model
        )
        
        # Run tests if requested
        if args.test:
            test_embeddings(rag)
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise


if __name__ == "__main__":
    main()
