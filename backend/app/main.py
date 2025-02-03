from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import get_db
from app.routers import courrier

app = FastAPI(
    title="TeamTalk Sphere API",
    description="API pour la gestion de courrier et la communication d'entreprise",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routers
app.include_router(courrier.router, prefix="/api")

# Route de test
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API TeamTalk Sphere"}

# Route de santé
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Vérifier la connexion à la base de données
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "ok",
        "database": db_status,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
