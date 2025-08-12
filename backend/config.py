from dotenv import load_dotenv
import os

env_file = os.getenv("ENV_FILE", ".env.dev")
load_dotenv(env_file)

database_url = os.getenv("DATABASE_URL")