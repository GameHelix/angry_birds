import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Loan Balance by Type
    const loansByType = await query(`
      SELECT
        loan_type,
        COUNT(*) as loan_count,
        SUM(outstanding_balance) as total_balance,
        AVG(outstanding_balance) as avg_balance
      FROM demo_bank.loans
      WHERE loan_status = 'active'
      GROUP BY loan_type
      ORDER BY total_balance DESC
    `);

    // 2. Customer Distribution by Account Type
    const customersByAccountType = await query(`
      SELECT
        account_type,
        COUNT(*) as customer_count,
        AVG(account_balance) as avg_balance,
        SUM(account_balance) as total_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY account_type
      ORDER BY customer_count DESC
    `);

    // 3. Credit Score Distribution
    const creditScoreDistribution = await query(`
      SELECT
        CASE
          WHEN credit_score >= 750 THEN 'Excellent (750+)'
          WHEN credit_score >= 700 THEN 'Good (700-749)'
          WHEN credit_score >= 650 THEN 'Fair (650-699)'
          ELSE 'Poor (<650)'
        END as score_range,
        COUNT(*) as customer_count,
        AVG(account_balance) as avg_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY score_range
      ORDER BY MIN(credit_score) DESC
    `);

    // 4. Top Customers by Balance
    const topCustomers = await query(`
      SELECT
        first_name || ' ' || last_name as customer_name,
        account_type,
        account_balance,
        credit_score
      FROM demo_bank.customers
      WHERE account_status = 'active'
      ORDER BY account_balance DESC
      LIMIT 10
    `);

    // 5. Monthly Transaction Volume (last 6 months)
    const transactionTrends = await query(`
      SELECT
        TO_CHAR(transaction_date, 'YYYY-MM') as month,
        transaction_type,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
      FROM demo_bank.transactions
      WHERE transaction_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY month, transaction_type
      ORDER BY month DESC, transaction_type
    `);

    // 6. Loan Status Distribution
    const loanStatusDistribution = await query(`
      SELECT
        loan_status,
        COUNT(*) as count,
        SUM(outstanding_balance) as total_balance
      FROM demo_bank.loans
      GROUP BY loan_status
      ORDER BY count DESC
    `);

    // 7. Customer Account Status
    const customerStatusDistribution = await query(`
      SELECT
        account_status,
        COUNT(*) as count,
        AVG(account_balance) as avg_balance,
        AVG(credit_score) as avg_credit_score
      FROM demo_bank.customers
      GROUP BY account_status
      ORDER BY count DESC
    `);

    // 8. High-Value Customers (Balance > 50K)
    const highValueCustomers = await query(`
      SELECT
        COUNT(*) as count,
        SUM(account_balance) as total_balance,
        AVG(credit_score) as avg_credit_score
      FROM demo_bank.customers
      WHERE account_balance > 50000 AND account_status = 'active'
    `);

    // 9. Customers with Loans
    const customersWithLoans = await query(`
      SELECT
        c.account_type,
        COUNT(DISTINCT c.customer_id) as customers_with_loans,
        COUNT(l.loan_id) as total_loans,
        SUM(l.outstanding_balance) as total_loan_balance
      FROM demo_bank.customers c
      INNER JOIN demo_bank.loans l ON c.customer_id = l.customer_id
      WHERE c.account_status = 'active' AND l.loan_status = 'active'
      GROUP BY c.account_type
      ORDER BY total_loan_balance DESC
    `);

    // 10. Recent Large Transactions (last 30 days)
    const recentLargeTransactions = await query(`
      SELECT
        t.transaction_date,
        c.first_name || ' ' || c.last_name as customer_name,
        t.transaction_type,
        t.amount
      FROM demo_bank.transactions t
      INNER JOIN demo_bank.customers c ON t.customer_id = c.customer_id
      WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
        AND t.amount > 5000
      ORDER BY t.amount DESC
      LIMIT 15
    `);

    // 11. Risk Analysis - High-Risk Customers
    const riskAnalysis = await query(`
      SELECT
        c.first_name || ' ' || c.last_name as customer_name,
        c.credit_score,
        c.account_balance,
        COALESCE(SUM(l.outstanding_balance), 0) as total_loans,
        CASE
          WHEN c.credit_score < 650 AND COALESCE(SUM(l.outstanding_balance), 0) > 20000 THEN 'Yüksək'
          WHEN c.credit_score < 700 AND COALESCE(SUM(l.outstanding_balance), 0) > 30000 THEN 'Orta'
          ELSE 'Aşağı'
        END as risk_level
      FROM demo_bank.customers c
      LEFT JOIN demo_bank.loans l ON c.customer_id = l.customer_id AND l.loan_status = 'active'
      WHERE c.account_status = 'active'
      GROUP BY c.customer_id, c.first_name, c.last_name, c.credit_score, c.account_balance
      HAVING COALESCE(SUM(l.outstanding_balance), 0) > 0
      ORDER BY
        CASE
          WHEN c.credit_score < 650 AND COALESCE(SUM(l.outstanding_balance), 0) > 20000 THEN 1
          WHEN c.credit_score < 700 AND COALESCE(SUM(l.outstanding_balance), 0) > 30000 THEN 2
          ELSE 3
        END,
        total_loans DESC
      LIMIT 10
    `);

    // 12. Monthly Account Balance Growth
    const balanceGrowth = await query(`
      SELECT
        account_type,
        COUNT(*) as customer_count,
        SUM(account_balance) as total_balance,
        AVG(account_balance) as avg_balance,
        MAX(account_balance) as max_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY account_type
      ORDER BY total_balance DESC
    `);

    // 13. Loan Performance Metrics
    const loanPerformance = await query(`
      SELECT
        loan_type,
        COUNT(*) as total_loans,
        SUM(CASE WHEN loan_status = 'active' THEN 1 ELSE 0 END) as active_loans,
        SUM(CASE WHEN loan_status = 'paid' THEN 1 ELSE 0 END) as paid_loans,
        SUM(CASE WHEN loan_status = 'defaulted' THEN 1 ELSE 0 END) as defaulted_loans,
        ROUND(SUM(CASE WHEN loan_status = 'defaulted' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric * 100, 2) as default_rate
      FROM demo_bank.loans
      GROUP BY loan_type
      ORDER BY total_loans DESC
    `);

    // 14. Customer Segmentation by Value
    const customerSegmentation = await query(`
      SELECT
        CASE
          WHEN account_balance >= 75000 THEN 'Premium (75K+)'
          WHEN account_balance >= 50000 THEN 'Gold (50-75K)'
          WHEN account_balance >= 25000 THEN 'Silver (25-50K)'
          ELSE 'Standard (<25K)'
        END as segment,
        COUNT(*) as customer_count,
        AVG(credit_score) as avg_credit_score,
        SUM(account_balance) as total_balance
      FROM demo_bank.customers
      WHERE account_status = 'active'
      GROUP BY segment
      ORDER BY MIN(account_balance) DESC
    `);

    // 15. Top Revenue Customers (by transaction volume)
    const topRevenueCustomers = await query(`
      SELECT
        c.first_name || ' ' || c.last_name as customer_name,
        c.account_type,
        COUNT(t.transaction_id) as transaction_count,
        SUM(t.amount) as total_transaction_volume,
        c.account_balance,
        c.credit_score
      FROM demo_bank.customers c
      INNER JOIN demo_bank.transactions t ON c.customer_id = t.customer_id
      WHERE c.account_status = 'active'
      GROUP BY c.customer_id, c.first_name, c.last_name, c.account_type, c.account_balance, c.credit_score
      ORDER BY total_transaction_volume DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        loansByType: loansByType.rows,
        customersByAccountType: customersByAccountType.rows,
        creditScoreDistribution: creditScoreDistribution.rows,
        topCustomers: topCustomers.rows,
        transactionTrends: transactionTrends.rows,
        loanStatusDistribution: loanStatusDistribution.rows,
        customerStatusDistribution: customerStatusDistribution.rows,
        highValueCustomers: highValueCustomers.rows[0],
        customersWithLoans: customersWithLoans.rows,
        recentLargeTransactions: recentLargeTransactions.rows,
        riskAnalysis: riskAnalysis.rows,
        balanceGrowth: balanceGrowth.rows,
        loanPerformance: loanPerformance.rows,
        customerSegmentation: customerSegmentation.rows,
        topRevenueCustomers: topRevenueCustomers.rows,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Analytics yüklənərkən xəta baş verdi' },
      { status: 500 }
    );
  }
}
