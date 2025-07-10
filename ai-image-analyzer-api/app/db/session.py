"""
Database Session Configuration
Cấu hình kết nối và session database
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
import logging
from typing import AsyncGenerator

from app.core.config import settings

logger = logging.getLogger(__name__)

# Base class cho các models
Base = declarative_base()

# Async Database Engine
async_engine = None
AsyncSessionLocal = None

# Sync Database Engine (for migrations)
sync_engine = None
SessionLocal = None

def init_sync_db():
    """Initialize synchronous database connection"""
    global sync_engine, SessionLocal
    
    if settings.DATABASE_URL:
        logger.info("Initializing sync database connection...")
        sync_engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=settings.DEBUG
        )
        SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=sync_engine
        )
        logger.info("✅ Sync database connection initialized")
    else:
        logger.warning("⚠️ No DATABASE_URL provided, skipping sync database initialization")

async def init_async_db():
    """Initialize asynchronous database connection"""
    global async_engine, AsyncSessionLocal
    
    if settings.ASYNC_DATABASE_URL:
        logger.info("Initializing async database connection...")
        async_engine = create_async_engine(
            settings.ASYNC_DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=settings.DEBUG
        )
        AsyncSessionLocal = async_sessionmaker(
            bind=async_engine,
            class_=AsyncSession,
            expire_on_commit=False
        )
        logger.info("✅ Async database connection initialized")
    else:
        logger.warning("⚠️ No ASYNC_DATABASE_URL provided, skipping async database initialization")

async def init_db():
    """Initialize database connections"""
    try:
        # Initialize sync connection for migrations
        init_sync_db()
        
        # Initialize async connection for API operations
        await init_async_db()
        
        # Create tables if they don't exist
        if sync_engine:
            logger.info("Creating database tables...")
            Base.metadata.create_all(bind=sync_engine)
            logger.info("✅ Database tables created/verified")
            
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")
        raise

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency để lấy async database session
    Sử dụng trong FastAPI endpoints
    """
    if not AsyncSessionLocal:
        logger.warning("Async database not initialized, using in-memory storage")
        yield None
        return
        
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {str(e)}")
            raise
        finally:
            await session.close()

def get_sync_session() -> Session:
    """
    Lấy sync database session
    Sử dụng cho migrations và operations đồng bộ
    """
    if not SessionLocal:
        raise RuntimeError("Sync database not initialized")
        
    session = SessionLocal()
    try:
        return session
    except Exception as e:
        session.close()
        logger.error(f"Sync database session error: {str(e)}")
        raise

async def close_db():
    """Close database connections"""
    global async_engine, sync_engine
    
    try:
        if async_engine:
            await async_engine.dispose()
            logger.info("✅ Async database connection closed")
            
        if sync_engine:
            sync_engine.dispose()
            logger.info("✅ Sync database connection closed")
            
    except Exception as e:
        logger.error(f"❌ Error closing database connections: {str(e)}")

# Database health check
async def check_db_health() -> dict:
    """Check database connection health"""
    health_status = {
        "database": "unknown",
        "async_connection": False,
        "sync_connection": False,
        "details": {}
    }
    
    try:
        # Check async connection
        if AsyncSessionLocal:
            async with AsyncSessionLocal() as session:
                await session.execute("SELECT 1")
                health_status["async_connection"] = True
                
        # Check sync connection
        if SessionLocal:
            with SessionLocal() as session:
                session.execute("SELECT 1")
                health_status["sync_connection"] = True
                
        # Overall status
        if health_status["async_connection"] or health_status["sync_connection"]:
            health_status["database"] = "healthy"
        else:
            health_status["database"] = "disconnected"
            
    except Exception as e:
        health_status["database"] = "error"
        health_status["details"]["error"] = str(e)
        logger.error(f"Database health check failed: {str(e)}")
    
    return health_status

# In-memory storage fallback (for development without database)
class InMemoryStorage:
    """Simple in-memory storage for development"""
    
    def __init__(self):
        self.data = {}
        self.counters = {}
    
    def get(self, key: str):
        return self.data.get(key)
    
    def set(self, key: str, value):
        self.data[key] = value
    
    def delete(self, key: str):
        return self.data.pop(key, None)
    
    def list_keys(self, prefix: str = ""):
        return [k for k in self.data.keys() if k.startswith(prefix)]
    
    def increment(self, key: str) -> int:
        self.counters[key] = self.counters.get(key, 0) + 1
        return self.counters[key]

# Global in-memory storage instance
memory_storage = InMemoryStorage()

async def get_storage():
    """
    Get storage backend (database or in-memory)
    """
    if AsyncSessionLocal:
        async for session in get_async_session():
            yield session
    else:
        yield memory_storage
