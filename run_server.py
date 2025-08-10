#!/usr/bin/env python3
"""
FastAPI SafeViewShield Server
Run this file to start the FastAPI server
"""

import uvicorn
import os

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8001))
    
    print(f"Starting SafeViewShield FastAPI server on port {port}")
    print(f"Access the application at: http://localhost:{port}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        reload_dirs=[".", "templates", "static"]
    )