from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Problem(Base):
    __tablename__ = "problems"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    slug        = Column(String, unique=True, nullable=False, index=True)
    difficulty  = Column(String)          # Easy / Medium / Hard
    tags        = Column(String)          # "array,dp,graph"
    url         = Column(String)
    statement   = Column(Text)
    platform    = Column(String, default="leetcode")
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    solutions   = relationship("Solution", back_populates="problem")


class Solution(Base):
    __tablename__ = "solutions"

    id          = Column(Integer, primary_key=True, index=True)
    problem_id  = Column(Integer, ForeignKey("problems.id"), nullable=False)
    language    = Column(String)          # python, cpp, java
    code        = Column(Text)
    verdict     = Column(String)          # Accepted, Wrong Answer, TLE
    runtime     = Column(String)          # "48ms"
    memory      = Column(String)          # "17MB"
    version     = Column(Integer, default=1)
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    problem     = relationship("Problem", back_populates="solutions")