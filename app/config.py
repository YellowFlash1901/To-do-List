from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    POSTGRES_PASSWORD: str

    class Config:
        env_file = ".env"