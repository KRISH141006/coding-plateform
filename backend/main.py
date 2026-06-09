from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import problems, solutions

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Coding Platform API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(problems.router)
app.include_router(solutions.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Coding Platform API is running"}