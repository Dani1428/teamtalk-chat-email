from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException

from app.models.courrier import (
    Departement, Service, Fonction, Utilisateur,
    CourrierEnvoie, CourrierRecu, Instruction
)
from app.schemas.courrier import (
    DepartementCreate, ServiceCreate, CourrierEnvoieCreate,
    CourrierRecuCreate, InstructionCreate, CourrierFilter,
    CourrierPage, ServicePage
)

# Services pour les départements
def create_departement(db: Session, departement: DepartementCreate):
    db_departement = Departement(**departement.dict())
    db.add(db_departement)
    try:
        db.commit()
        db.refresh(db_departement)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erreur lors de la création du département")
    return db_departement

def get_departements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Departement).offset(skip).limit(limit).all()

# Services pour les services
def create_service(db: Session, service: ServiceCreate):
    # Vérifier que le département existe
    if not db.query(Departement).filter(Departement.id == service.departement_id).first():
        raise HTTPException(status_code=404, detail="Département non trouvé")
    
    # Vérifier le service de tutelle s'il est spécifié
    if service.tutelle_service_id:
        if not db.query(Service).filter(Service.id == service.tutelle_service_id).first():
            raise HTTPException(status_code=404, detail="Service de tutelle non trouvé")
    
    db_service = Service(**service.dict())
    db.add(db_service)
    try:
        db.commit()
        db.refresh(db_service)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erreur lors de la création du service")
    return db_service

def get_services(
    db: Session,
    departement_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> ServicePage:
    query = db.query(Service)
    if departement_id:
        query = query.filter(Service.departement_id == departement_id)
    
    total = query.count()
    services = query.offset(skip).limit(limit).all()
    
    return ServicePage(total=total, items=services)

# Services pour les courriers
def create_courrier_with_destinations(
    db: Session,
    courrier: CourrierEnvoieCreate,
    destinataires: List[CourrierRecuCreate]
):
    # Créer le courrier
    db_courrier = CourrierEnvoie(**courrier.dict())
    db.add(db_courrier)
    db.flush()  # Pour obtenir l'ID du courrier
    
    # Créer les entrées pour les destinataires
    for dest in destinataires:
        db_dest = CourrierRecu(
            courrier_envoie_id=db_courrier.id,
            **dest.dict()
        )
        db.add(db_dest)
    
    try:
        db.commit()
        db.refresh(db_courrier)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erreur lors de la création du courrier")
    
    return db_courrier

def get_courriers(
    db: Session,
    filter: CourrierFilter,
    skip: int = 0,
    limit: int = 100
) -> CourrierPage:
    query = db.query(CourrierEnvoie)
    
    # Appliquer les filtres
    if filter.date_debut:
        query = query.filter(CourrierEnvoie.date_envoie >= filter.date_debut)
    if filter.date_fin:
        query = query.filter(CourrierEnvoie.date_envoie <= filter.date_fin)
    if filter.expediteur:
        query = query.filter(CourrierEnvoie.expediteur.ilike(f"%{filter.expediteur}%"))
    if filter.objet_contains:
        query = query.filter(CourrierEnvoie.objet.ilike(f"%{filter.objet_contains}%"))
    
    total = query.count()
    courriers = query.offset(skip).limit(limit).all()
    
    return CourrierPage(total=total, items=courriers)

def get_courrier(db: Session, courrier_id: int):
    return db.query(CourrierEnvoie).filter(CourrierEnvoie.id == courrier_id).first()

def get_courriers_recus(
    db: Session,
    utilisateur_id: int,
    instruction_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(CourrierRecu).filter(CourrierRecu.utilisateur_id == utilisateur_id)
    
    if instruction_id:
        query = query.filter(CourrierRecu.instruction_id == instruction_id)
    
    return query.offset(skip).limit(limit).all()

# Services pour les instructions
def create_instruction(db: Session, instruction: InstructionCreate):
    db_instruction = Instruction(**instruction.dict())
    db.add(db_instruction)
    try:
        db.commit()
        db.refresh(db_instruction)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erreur lors de la création de l'instruction")
    return db_instruction

def get_instructions(db: Session):
    return db.query(Instruction).all()

# Services pour les statistiques
def get_courrier_stats(
    db: Session,
    date_debut: Optional[datetime] = None,
    date_fin: Optional[datetime] = None,
    departement_id: Optional[int] = None
):
    # Base des requêtes
    envoyes_query = db.query(CourrierEnvoie)
    recus_query = db.query(CourrierRecu)
    
    # Appliquer les filtres de date
    if date_debut:
        envoyes_query = envoyes_query.filter(CourrierEnvoie.date_envoie >= date_debut)
    if date_fin:
        envoyes_query = envoyes_query.filter(CourrierEnvoie.date_envoie <= date_fin)
    
    # Statistiques par instruction
    instructions_stats = (
        db.query(
            Instruction.nom_instruction,
            func.count(CourrierRecu.id).label('count')
        )
        .join(CourrierRecu)
        .group_by(Instruction.nom_instruction)
        .all()
    )
    
    # Statistiques par département
    departements_stats = (
        db.query(
            Departement.nom_departement,
            func.count(CourrierRecu.id).label('count')
        )
        .join(Service, Fonction, Utilisateur, CourrierRecu)
        .group_by(Departement.nom_departement)
        .all()
    )
    
    return {
        "total_envoyes": envoyes_query.count(),
        "total_recus": recus_query.count(),
        "par_instruction": {nom: count for nom, count in instructions_stats},
        "par_departement": {nom: count for nom, count in departements_stats}
    }

# Service de recherche
def search_courriers(db: Session, q: str, skip: int = 0, limit: int = 100) -> CourrierPage:
    query = db.query(CourrierEnvoie).filter(
        or_(
            CourrierEnvoie.objet.ilike(f"%{q}%"),
            CourrierEnvoie.expediteur.ilike(f"%{q}%"),
            CourrierEnvoie.note_1.ilike(f"%{q}%"),
            CourrierEnvoie.note_2.ilike(f"%{q}%")
        )
    )
    
    total = query.count()
    courriers = query.offset(skip).limit(limit).all()
    
    return CourrierPage(total=total, items=courriers)
