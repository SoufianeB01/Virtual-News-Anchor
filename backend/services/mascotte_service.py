import os

import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MASCOTTE_API_KEY")
MASCOTTE_ID = int(os.getenv("MASCOTTE_ID", "3639"))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


async def create_session():
    if not API_KEY:
        raise ValueError("Mascotte API key is missing")

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://app.mascotte.ai/api/v1/sessions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "mascotte": MASCOTTE_ID,
                "origin": FRONTEND_ORIGIN,
                "language": "nl",
                "view": "face",
                "minutes": 5,
                "replyLength": "short",
            },
        )

        print("Mascotte status:", response.status_code)
        print("Mascotte response:", response.text)

        response.raise_for_status()
        return response.json()
