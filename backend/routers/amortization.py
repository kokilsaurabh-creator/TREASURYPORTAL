from fastapi import APIRouter
from models.loan import LoanDetails, AmortizationScheduleLine
from typing import List
from datetime import timedelta
import calendar

router = APIRouter(prefix="/amortization", tags=["Amortization"])

def get_days_in_month(year: int, month: int) -> int:
    return calendar.monthrange(year, month)[1]

@router.post("/calculate", response_model=List[AmortizationScheduleLine])
def calculate_schedule(loan: LoanDetails):
    schedule = []
    
    opening_balance = loan.loan_amount
    current_date = loan.loan_start_date
    
    # Simple straight-line principal repayment for demonstration
    # Real-world might use PMT function for equal installments, but Term Loans 
    # often have equal principal payments + interest, or customized repayment schedules.
    # We will use equal principal payments for this example.
    principal_repay = round(loan.loan_amount / loan.tenor_months, 2)
    
    for i in range(1, loan.tenor_months + 1):
        # Determine the end of the current period (1 month)
        # We'll just add days roughly, or calculate exact month end
        # A simple approach for 1 month period:
        days_in_current_month = get_days_in_month(current_date.year, current_date.month)
        
        date_to = current_date + timedelta(days=days_in_current_month)
        
        days_count = (date_to - current_date).days
        
        # Interest calculation (ACTUAL/365)
        # formula: (Opening Balance * ROI * Days) / (365 * 100)
        interest_expense = round((opening_balance * loan.roi * days_count) / (365 * 100), 2)
        
        # Last period adjustment for principal
        if i == loan.tenor_months:
            principal_repay = opening_balance
            
        closing_balance = round(opening_balance - principal_repay, 2)
        
        line = AmortizationScheduleLine(
            line_item=i,
            date_from=current_date,
            date_to=date_to,
            days_count=days_count,
            roi=loan.roi,
            opening_balance=opening_balance,
            disbursement=loan.loan_amount if i == 1 else 0.0,
            principal_repay=principal_repay,
            interest_expense=interest_expense,
            interest_repay=interest_expense, # assuming paid same period
            closing_balance=closing_balance
        )
        schedule.append(line)
        
        opening_balance = closing_balance
        current_date = date_to
        
    return schedule
