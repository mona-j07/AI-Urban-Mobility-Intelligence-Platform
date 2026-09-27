"""
Supabase client for the AI engine service.
Loads credentials from services/ai/.env and exports a ready-to-use client.
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env from services/ai/.env
_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
load_dotenv(os.path.normpath(_env_path))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    print("ERROR: SUPABASE_URL is not set in services/ai/.env")
    sys.exit(1)

if not SUPABASE_SERVICE_ROLE_KEY:
    print("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in services/ai/.env")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
