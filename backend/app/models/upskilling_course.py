from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, JSON
from app.database import Base


class UpskillingCourse(Base):
    __tablename__ = "upskilling_courses"

    course_id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("admin.admin_id"), nullable=False)
    target_skill = Column(String(255))
    course_title = Column(String(255))
    provider = Column(String(255))
    course_url = Column(String(255))
    course_description = Column(Text)
    embedding = Column(JSON, nullable=True) 