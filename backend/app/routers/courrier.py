from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.schemas import courrier as schemas
from app.services import courrier as service
from app.core.auth import get_current_user

router = APIRouter(prefix="/courrier", tags=["courrier"])

# Routes pour les départements
@router.post("/departements/", response_model=schemas.Departement)
def create_departement(
    departement: schemas.DepartementCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.create_departement(db, departement)

@router.get("/departements/", response_model=List[schemas.Departement])
def read_departements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return service.get_departements(db, skip=skip, limit=limit)

# Routes pour les services
@router.post("/services/", response_model=schemas.Service)
def create_service(
    service_create: schemas.ServiceCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.create_service(db, service_create)

@router.get("/services/", response_model=schemas.ServicePage)
def read_services(
    departement_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return service.get_services(db, departement_id=departement_id, skip=skip, limit=limit)

# Routes pour les courriers
@router.post("/envoie/", response_model=schemas.CourrierEnvoie)
def create_courrier(
    courrier: schemas.CourrierEnvoieCreate,
    destinataires: List[schemas.CourrierRecuCreate],
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.create_courrier_with_destinations(db, courrier, destinataires)

@router.get("/envoie/", response_model=schemas.CourrierPage)
def read_courriers(
    filter: schemas.CourrierFilter = Depends(),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return service.get_courriers(db, filter, skip=skip, limit=limit)

@router.get("/envoie/{courrier_id}", response_model=schemas.CourrierEnvoie)
def read_courrier(
    courrier_id: int,
    db: Session = Depends(get_db)
):
    courrier = service.get_courrier(db, courrier_id)
    if courrier is None:
        raise HTTPException(status_code=404, detail="Courrier non trouvé")
    return courrier

@router.get("/recu/", response_model=List[schemas.CourrierRecu])
def read_courriers_recus(
    utilisateur_id: Optional[int] = None,
    instruction_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.get_courriers_recus(
        db,
        utilisateur_id or current_user.id,
        instruction_id,
        skip=skip,
        limit=limit
    )

# Routes pour les instructions
@router.get("/instructions/", response_model=List[schemas.Instruction])
def read_instructions(
    db: Session = Depends(get_db)
):
    return service.get_instructions(db)

@router.post("/instructions/", response_model=schemas.Instruction)
def create_instruction(
    instruction: schemas.InstructionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.create_instruction(db, instruction)

# Routes pour les statistiques
@router.get("/stats/", response_model=schemas.CourrierStats)
def get_courrier_stats(
    date_debut: Optional[datetime] = None,
    date_fin: Optional[datetime] = None,
    departement_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: schemas.Utilisateur = Depends(get_current_user)
):
    return service.get_courrier_stats(
        db,
        date_debut=date_debut,
        date_fin=date_fin,
        departement_id=departement_id
    )

# Routes pour la recherche
@router.get("/search/", response_model=schemas.CourrierPage)
def search_courriers(
    q: str = Query(..., min_length=3),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return service.search_courriers(db, q, skip=skip, limit=limit)
