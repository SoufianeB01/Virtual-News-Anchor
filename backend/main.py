import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.mascotte_service import create_session

load_dotenv()

app = FastAPI(title="Sam API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/mascotte/session")
async def start_session():
    try:
        return await create_session()
    except ValueError as error:
        raise HTTPException(status_code=500, detail=str(error))
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Could not create Mascotte session",
        )
