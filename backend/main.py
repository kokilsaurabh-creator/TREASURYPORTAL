import os
import uuid
import secrets
import string
from datetime import date, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client

app = FastAPI(
    title="Term Loan Management API",
    description="Backend calculation engine for amortization and admin provisioning.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Admin Client for provisioning
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", os.getenv("SUPABASE_URL", ""))
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

def get_supabase_admin() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="Supabase Admin credentials not configured on server")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Models
class CreateUserRequest(BaseModel):
    email: EmailStr
    role: str

class LoanScheduleRequest(BaseModel):
    loan_amount: float
    roi: float
    loan_date: date
    tenure_months: int
    days_in_year: int = 365

class AmortizationLine(BaseModel):
    line_item: int
    date_from: date
    date_to: date
    days_count: int
    opening_balance: float
    principal_repay: float
    interest_expense: float
    installment_amount: float
    closing_balance: float

@app.post("/api/admin/create-user")
def create_admin_user(req: CreateUserRequest):
    """
    Provisions a user account and assigns a role.
    Adheres to Zero Credential Policy: Passwords are automatically generated securely
    in the background and are NEVER stored, returned, or exposed to the frontend.
    """
    allowed_roles = ["ADMIN", "FINANCE_HEAD", "MAKER", "AUTHORISER", "AUDITOR"]
    if req.role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {allowed_roles}")

    supabase = get_supabase_admin()
    
    # Generate a cryptographically secure random password that is discarded immediately
    alphabet = string.ascii_letters + string.digits + string.punctuation
    secure_temp_password = ''.join(secrets.choice(alphabet) for i in range(32))

    try:
        # Create user via admin API
        user_response = supabase.auth.admin.create_user({
            "email": req.email,
            "password": secure_temp_password,
            "email_confirm": True
        })
        
        user_id = user_response.user.id
        
        # Insert into user_roles
        supabase.table("user_roles").insert({
            "user_id": user_id,
            "role": req.role
        }).execute()
        
        return {"status": "success", "message": "User provisioned successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/loan/calculate-schedule", response_model=List[AmortizationLine])
def calculate_schedule(req: LoanScheduleRequest):
    """
    Calculates the exact line-item intervals using Actual/365 day count basis,
    handling daily accrued interest, opening/closing principal balances.
    Assuming monthly installments for standard amortization.
    """
    schedule = []
    
    # Calculate monthly PMT (standard formula for regular installments)
    # ROI is annual percentage. Convert to monthly decimal.
    monthly_rate = (req.roi / 100) / 12
    if monthly_rate > 0:
        pmt = req.loan_amount * (monthly_rate * (1 + monthly_rate)**req.tenure_months) / ((1 + monthly_rate)**req.tenure_months - 1)
    else:
        pmt = req.loan_amount / req.tenure_months

    current_balance = req.loan_amount
    current_date = req.loan_date
    
    for i in range(1, req.tenure_months + 1):
        if current_balance <= 0.01:
            break
            
        # Determine next month date
        # Basic logic: add roughly 30.44 days or use month arithmetic
        month = current_date.month % 12 + 1
        year = current_date.year + (current_date.month // 12)
        # Handling end of month logic roughly for days_count calculation
        try:
            next_date = current_date.replace(year=year, month=month)
        except ValueError:
            # If day is out of range for month (e.g. Feb 30), push to last day of month
            next_date = current_date.replace(year=year, month=month, day=28)
            while True:
                try:
                    next_date = next_date.replace(day=next_date.day + 1)
                except ValueError:
                    break
        
        days_count = (next_date - current_date).days
        
        # Interest: Actual / 365 basis
        daily_rate = (req.roi / 100) / req.days_in_year
        interest_expense = current_balance * daily_rate * days_count
        
        principal_repay = pmt - interest_expense
        
        # Adjust for last payment
        if i == req.tenure_months or current_balance < principal_repay:
            principal_repay = current_balance
            pmt = principal_repay + interest_expense
            
        closing_balance = current_balance - principal_repay
        
        schedule.append(AmortizationLine(
            line_item=i,
            date_from=current_date,
            date_to=next_date,
            days_count=days_count,
            opening_balance=round(current_balance, 2),
            principal_repay=round(principal_repay, 2),
            interest_expense=round(interest_expense, 2),
            installment_amount=round(pmt, 2),
            closing_balance=round(closing_balance, 2)
        ))
        
        current_balance = closing_balance
        current_date = next_date

    return schedule
