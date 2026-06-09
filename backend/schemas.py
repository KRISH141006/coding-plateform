from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ── Problem ──────────────────────────────────────────────
class ProblemCreate(BaseModel):
    title:      str
    slug:       str
    difficulty: Optional[str] = None
    tags:       Optional[str] = None
    url:        Optional[str] = None
    statement:  Optional[str] = None
    platform:   Optional[str] = "leetcode"

class ProblemOut(ProblemCreate):
    id:         int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Solution ─────────────────────────────────────────────
class SolutionCreate(BaseModel):
    problem_id: int
    language:   str
    code:       str
    verdict:    Optional[str] = None
    runtime:    Optional[str] = None
    memory:     Optional[str] = None

class SolutionOut(SolutionCreate):
    id:         int
    version:    int
    created_at: datetime

    class Config:
        from_attributes = True