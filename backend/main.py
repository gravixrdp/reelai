"""Main FastAPI application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import get_settings
from app.core.database import init_db
from app.api import health, video, reels, social, social_checker, schedules
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="GRAVIXAI Backend",
    version="1.0.0",
    description="GRAVIXAI - YouTube to Instagram Reels Converter",
    debug=settings.debug,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
# Include routers
app.include_router(health.router)
app.include_router(video.router)
app.include_router(reels.router)
app.include_router(social.router)
app.include_router(social_checker.router)

# New verified instagram router
from app.api.routers import instagram as instagram_verified
app.include_router(instagram_verified.router, prefix="/api/instagram", tags=["Instagram Verified"])

app.include_router(schedules.router, prefix="/api")

# Analytics router
from app.routers import analytics
app.include_router(analytics.router)



# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "GRAVIXAI Backend",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "video": "/api/video",
            "reels": "/api/reels",
            "social": "/api/social"
        }
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and start workers"""
    logger.info("🚀 GRAVIXAI Backend Starting...")
    init_db()
    logger.info("✓ Database initialized")
    logger.info("✓ All systems ready")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 GRAVIXAI Backend Shutting Down...")


# Exception handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if settings.debug else "An error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
