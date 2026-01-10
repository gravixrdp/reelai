"""Reel Schedule Management API"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from app.db.database import get_db
from app.models.instagram import InstagramAccount, InstagramAccountStatus
from app.models.reel_schedule import ReelSchedule, ScheduleStatus
from app.models.reel import Reel
from app.schemas.reel_schedule import (
    ReelScheduleCreate,
    ReelScheduleUpdate,
    MarkAsUploadedRequest,
    ReelScheduleResponse,
    ReelScheduleListResponse,
)

router = APIRouter(prefix="/schedules", tags=["Reel Schedules"])


@router.post("", response_model=ReelScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    schedule_data: ReelScheduleCreate,
    db: Session = Depends(get_db),
):
    """Create new reel schedule"""
    
    # Verify reel exists
    reel = db.query(Reel).filter(Reel.id == schedule_data.reel_id).first()
    if not reel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reel {schedule_data.reel_id} not found"
        )
    
    # Verify Instagram account exists and is active
    account = db.query(InstagramAccount).filter(
        InstagramAccount.id == schedule_data.instagram_account_id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instagram account {schedule_data.instagram_account_id} not found"
        )
    
    # Verify Instagram account exists and is active/connected
    # We now enforce strict 'connected' status from the new verification flow
    from app.models.instagram import InstagramAccountStatus
    
    if account.status != InstagramAccountStatus.CONNECTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot schedule on account '{account.username}'. Account must be verified and status '{InstagramAccountStatus.CONNECTED.value}' (current: {account.status})."
        )
    
    # Check if already scheduled
    existing = db.query(ReelSchedule).filter(
        and_(
            ReelSchedule.reel_id == schedule_data.reel_id,
            ReelSchedule.status.in_([
                ScheduleStatus.SCHEDULED,
                ScheduleStatus.READY_FOR_UPLOAD,
                ScheduleStatus.UPLOADED
            ])
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Reel {schedule_data.reel_id} is already scheduled (schedule_id: {existing.id})"
        )
    
    # TODO: Get user_id from auth
    user_id = 1
    
    schedule = ReelSchedule(
        reel_id=schedule_data.reel_id,
        instagram_account_id=schedule_data.instagram_account_id,
        user_id=user_id,
        status=ScheduleStatus.SCHEDULED if schedule_data.scheduled_at else ScheduleStatus.READY_FOR_UPLOAD,
        scheduled_at=schedule_data.scheduled_at,
    )
    
    # Update account last_used_at
    account.last_used_at = datetime.utcnow()
    
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    
    return schedule


@router.get("", response_model=ReelScheduleListResponse)
async def get_schedules(
    status_filter: ScheduleStatus = None,
    instagram_account_id: int = None,
    db: Session = Depends(get_db),
):
    """Get all schedules"""
    
    query = db.query(ReelSchedule)
    
    if status_filter:
        query = query.filter(ReelSchedule.status == status_filter)
    
    if instagram_account_id:
        query = query.filter(ReelSchedule.instagram_account_id == instagram_account_id)
    
    schedules = query.order_by(ReelSchedule.created_at.desc()).all()
    
    return ReelScheduleListResponse(
        schedules=schedules,
        total=len(schedules)
    )


@router.get("/{schedule_id}", response_model=ReelScheduleResponse)
async def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    """Get single schedule"""
    
    schedule = db.query(ReelSchedule).filter(
        ReelSchedule.id == schedule_id
    ).first()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule {schedule_id} not found"
        )
    
    return schedule


@router.patch("/{schedule_id}", response_model=ReelScheduleResponse)
async def update_schedule(
    schedule_id: int,
    schedule_data: ReelScheduleUpdate,
    db: Session = Depends(get_db),
):
    """Update schedule status"""
    
    schedule = db.query(ReelSchedule).filter(
        ReelSchedule.id == schedule_id
    ).first()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule {schedule_id} not found"
        )
    
    schedule.status = schedule_data.status
    
    if schedule_data.error_message:
        schedule.error_message = schedule_data.error_message
    
    if schedule_data.status == ScheduleStatus.FAILED:
        schedule.failed_at = datetime.utcnow()
        schedule.retry_count += 1
    
    db.commit()
    db.refresh(schedule)
    
    return schedule


@router.post("/{schedule_id}/mark-uploaded", response_model=ReelScheduleResponse)
async def mark_as_uploaded(
    schedule_id: int,
    data: MarkAsUploadedRequest,
    db: Session = Depends(get_db),
):
    """Mark schedule as manually uploaded"""
    
    schedule = db.query(ReelSchedule).filter(
        ReelSchedule.id == schedule_id
    ).first()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule {schedule_id} not found"
        )
    
    if schedule.status == ScheduleStatus.UPLOADED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule already marked as uploaded"
        )
    
    schedule.status = ScheduleStatus.UPLOADED
    schedule.uploaded_at = datetime.utcnow()
    
    # Update reel
    reel = db.query(Reel).filter(Reel.id == schedule.reel_id).first()
    if reel:
        reel.is_uploaded = True
    
    db.commit()
    db.refresh(schedule)
    
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_200_OK)
async def cancel_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
):
    """Cancel schedule"""
    
    schedule = db.query(ReelSchedule).filter(
        ReelSchedule.id == schedule_id
    ).first()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule {schedule_id} not found"
        )
    
    if schedule.status == ScheduleStatus.UPLOADED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel already uploaded schedule"
        )
    
    schedule.status = ScheduleStatus.CANCELLED
    db.commit()
    
    return {
        "message": f"Schedule {schedule_id} cancelled successfully",
        "schedule_id": schedule_id
    }
