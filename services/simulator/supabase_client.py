"""
Supabase client for the simulator service.
Loads credentials from services/simulator/.env and exports a ready-to-use client.
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env from the same directory as this file
_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(_env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    print("ERROR: SUPABASE_URL is not set in services/simulator/.env")
    sys.exit(1)

if not SUPABASE_SERVICE_ROLE_KEY:
    print("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in services/simulator/.env")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
