#!/usr/bin/env python3
"""
FundN3xus RAG API Server
FastAPI server for RAG-based financial intelligence queries.

Usage: python ml/rag_server.py
Access: http://localhost:8001
Docs: http://localhost:8001/docs
"""

import os
import logging
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Import our RAG pipeline
# Switch between ChromaDB (local) and Pinecone (cloud):
# from rag_pipeline import FinancialRAGPipeline  # ChromaDB (local, default)
from rag_pipeline_pinecone import PineconeRAGPipeline as FinancialRAGPipeline  # Pinecone (cloud) ✅

# Load environment variables
load_dotenv()

# Configuration
RAG_HOST = os.getenv('RAG_HOST', '0.0.0.0')
# Use PORT for Render/Railway, fallback to RAG_PORT for local development
RAG_PORT = int(os.getenv('PORT', os.getenv('RAG_PORT', 8001)))
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FundN3xus RAG API",
    description="RAG-powered financial intelligence and Q&A system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global RAG pipeline instance
rag_pipeline: Optional[FinancialRAGPipeline] = None


# Request/Response Models
class QueryRequest(BaseModel):
    """RAG query request"""
    question: str = Field(..., description="Natural language question about financial data")
    return_sources: bool = Field(True, description="Whether to return source documents")
    max_sources: int = Field(5, ge=1, le=20, description="Maximum number of source documents")


class SourceDocument(BaseModel):
    """Source document from retrieval"""
    content: str = Field(..., description="Document content")
    metadata: Dict[str, Any] = Field(..., description="Document metadata")
    relevance_score: Optional[float] = Field(None, description="Relevance score if available")


class QueryResponse(BaseModel):
    """RAG query response"""
    answer: str = Field(..., description="Generated answer")
    sources: List[SourceDocument] = Field(default_factory=list, description="Retrieved source documents")
    query: str = Field(..., description="Original query")


class SearchRequest(BaseModel):
    """Semantic search request"""
    query: str = Field(..., description="Search query")
    k: int = Field(5, ge=1, le=50, description="Number of results to return")
    filters: Optional[Dict[str, Any]] = Field(None, description="Metadata filters")


class SearchResult(BaseModel):
    """Search result"""
    content: str = Field(..., description="Document content")
    metadata: Dict[str, Any] = Field(..., description="Document metadata")


class StatsResponse(BaseModel):
    """Pipeline statistics response"""
    status: str
    vector_db_path: str
    embedding_model: str
    total_documents: Any
    vector_store_initialized: bool
    llm_initialized: bool
    qa_chain_initialized: bool


# Startup event to initialize RAG pipeline
@app.on_event("startup")
async def startup_event():
    """Initialize RAG pipeline on server startup"""
    global rag_pipeline
    
    try:
        logger.info("Initializing RAG pipeline...")
        rag_pipeline = FinancialRAGPipeline()
        rag_pipeline.setup_pipeline(force_recreate=False)
        logger.info("✅ RAG pipeline initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize RAG pipeline: {e}")
        raise


# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rag_initialized": rag_pipeline is not None,
        "service": "FundN3xus RAG API"
    }


@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get RAG pipeline statistics"""
    
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    stats = rag_pipeline.get_statistics()
    stats['status'] = 'ready'
    
    return StatsResponse(**stats)


@app.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Query the RAG system with a natural language question.
    
    This endpoint uses retrieval-augmented generation to:
    1. Find relevant financial profiles from the dataset
    2. Generate an intelligent answer based on the retrieved context
    3. Provide source documents for transparency
    """
    
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        # Query the RAG system
        result = rag_pipeline.query(
            question=request.question,
            return_sources=request.return_sources
        )
        
        # Format response
        sources = []
        if request.return_sources and result.get('sources'):
            sources = [
                SourceDocument(
                    content=src['content'],
                    metadata=src['metadata']
                )
                for src in result['sources'][:request.max_sources]
            ]
        
        return QueryResponse(
            answer=result['answer'],
            sources=sources,
            query=request.question
        )
        
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/search", response_model=List[SearchResult])
async def semantic_search(request: SearchRequest):
    """
    Perform semantic similarity search over financial profiles.
    
    Returns the most relevant financial profiles based on semantic similarity
    to the query, with optional metadata filtering.
    """
    
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        # Perform similarity search
        docs = rag_pipeline.similarity_search(
            query=request.query,
            k=request.k,
            filter_dict=request.filters
        )
        
        # Format results
        results = [
            SearchResult(
                content=doc.page_content,
                metadata=doc.metadata
            )
            for doc in docs
        ]
        
        return results
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/search/by-criteria")
async def search_by_criteria(
    min_income: Optional[float] = Query(None, description="Minimum income"),
    max_age: Optional[int] = Query(None, description="Maximum age"),
    min_health_score: Optional[float] = Query(None, description="Minimum financial health score"),
    scenario: Optional[str] = Query(None, description="Scenario category"),
    k: int = Query(5, ge=1, le=50, description="Number of results")
):
    """
    Search for financial profiles matching specific criteria.
    
    This endpoint allows filtering by various financial metrics without
    needing a natural language query.
    """
    
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        # Build filter dict
        filters = {}
        if min_income is not None:
            filters['income'] = {'$gte': min_income}
        if max_age is not None:
            filters['age'] = {'$lte': max_age}
        if min_health_score is not None:
            filters['financial_health_score'] = {'$gte': min_health_score}
        if scenario is not None:
            filters['scenario_category'] = scenario
        
        # Create search query
        query_parts = []
        if min_income:
            query_parts.append(f"income above {min_income}")
        if max_age:
            query_parts.append(f"age under {max_age}")
        if min_health_score:
            query_parts.append(f"financial health score above {min_health_score}")
        if scenario:
            query_parts.append(f"scenario type {scenario}")
        
        query = "Financial profiles with " + ", ".join(query_parts) if query_parts else "all profiles"
        
        # Perform search
        docs = rag_pipeline.similarity_search(
            query=query,
            k=k,
            filter_dict=filters if filters else None
        )
        
        # Format results
        results = [
            {
                'content': doc.page_content,
                'metadata': doc.metadata
            }
            for doc in docs
        ]
        
        return {
            'query': query,
            'filters': filters,
            'results': results,
            'count': len(results)
        }
        
    except Exception as e:
        logger.error(f"Criteria search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.post("/rebuild")
async def rebuild_vector_store():
    """
    Rebuild the vector store from scratch.
    
    Use this endpoint after updating the dataset to refresh the RAG system.
    Warning: This operation may take some time.
    """
    
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        logger.info("Rebuilding vector store...")
        rag_pipeline.setup_pipeline(force_recreate=True)
        logger.info("✅ Vector store rebuilt successfully")
        
        return {
            "status": "success",
            "message": "Vector store rebuilt successfully"
        }
        
    except Exception as e:
        logger.error(f"Rebuild failed: {e}")
        raise HTTPException(status_code=500, detail=f"Rebuild failed: {str(e)}")


def main():
    """Run development server"""
    logger.info("Starting FundN3xus RAG API Server...")
    logger.info(f"🚀 Server URL: http://{RAG_HOST}:{RAG_PORT}")
    logger.info(f"📖 API Docs: http://{RAG_HOST}:{RAG_PORT}/docs")
    
    uvicorn.run(
        "rag_server:app",
        host=RAG_HOST,
        port=RAG_PORT,
        reload=True,
        log_level="info"
    )


if __name__ == "__main__":
    main()
