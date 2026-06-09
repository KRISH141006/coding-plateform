from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Solution, Problem
from schemas import SolutionCreate, SolutionOut
from typing import List

router = APIRouter(prefix="/solutions", tags=["Solutions"])


@router.get("/problem/{problem_id}", response_model=List[SolutionOut])
def get_solutions_for_problem(problem_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Solution)
        .filter(Solution.problem_id == problem_id)
        .order_by(Solution.version.desc())
        .all()
    )


@router.post("/", response_model=SolutionOut, status_code=201)
def save_solution(payload: SolutionCreate, db: Session = Depends(get_db)):
    # verify problem exists
    problem = db.query(Problem).filter(Problem.id == payload.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # auto-increment version (never overwrite old solutions)
    last = (
        db.query(Solution)
        .filter(Solution.problem_id == payload.problem_id)
        .order_by(Solution.version.desc())
        .first()
    )
    next_version = (last.version + 1) if last else 1

    solution = Solution(**payload.model_dump(), version=next_version)
    db.add(solution)
    db.commit()
    db.refresh(solution)
    return solution