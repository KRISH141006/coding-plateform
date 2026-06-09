from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Problem
from schemas import ProblemCreate, ProblemOut
from typing import List

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.get("/", response_model=List[ProblemOut])
def list_problems(db: Session = Depends(get_db)):
    return db.query(Problem).order_by(Problem.created_at.desc()).all()


@router.post("/", response_model=ProblemOut, status_code=201)
def create_problem(payload: ProblemCreate, db: Session = Depends(get_db)):
    existing = db.query(Problem).filter(Problem.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="Problem with this slug already exists")
    problem = Problem(**payload.model_dump())
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


@router.get("/{slug}", response_model=ProblemOut)
def get_problem(slug: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.delete("/{slug}", status_code=204)
def delete_problem(slug: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(problem)
    db.commit()