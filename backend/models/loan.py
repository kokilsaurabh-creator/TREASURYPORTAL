from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

class LoanDetails(BaseModel):
    loan_amount: float = Field(..., gt=0)
    roi: float = Field(..., gt=0)
    loan_start_date: date
    tenor_months: int = Field(..., gt=0)
    calc_basis: str = Field(default="ACTUAL_365")

class AmortizationScheduleLine(BaseModel):
    line_item: int
    date_from: date
    date_to: date
    days_count: int
    roi: float
    opening_balance: float
    disbursement: float
    principal_repay: float
    interest_expense: float
    interest_repay: float
    closing_balance: float
