# US 6.5 — Notify Users About Points Expiry (ABC-250)

## What

Show points expiry date on the balance component. Display a notification banner when points are expiring soon. Show "Expired" entries in transaction history. Points expire after 12 months of inactivity (handled by backend).

## Backend API

### GET /api/loyalty/balance

Current response does NOT include expiry information. The backend may need to be extended to return the next expiry date and amount, e.g.:

```json
{
    "isSuccess": true,
    "message": null,
    "data": {
        "balance": 30000,
        "discountEquivalent": 3000000,
        "lastUpdated": "2026-06-24T10:00:00Z",
        "nextExpiryDate": "2026-07-01T00:00:00Z",
        "expiringPoints": 5000
    }
}
```

**ℹ️ If backend does not return expiry data, calculate client-side:**
- The transactions API can be filtered by `type=Earn&status=Completed`
- Each Earn transaction has a `date` field
- Points expire 12 months after `date`
- `expiringPoints` = sum of Earn transaction points within the expiry window

### GET /api/loyalty/transactions?type=Expired

Returns expired point transactions. Display these in the transaction history with appropriate styling.

**Response:**
```json
{
    "items": [
        {
            "id": "...",
            "date": "2026-05-01T00:00:00Z",
            "type": "Expired",
            "points": -2000,
            "orderId": null,
            "description": "Points expired due to inactivity."
        }
    ]
}
```

### Backend Expiry Logic

From `LoyaltyTransaction.CreateExpired()`:
- Points expire due to inactivity after 12 months
- Expired transactions have type `Expired`, status `Completed`
- `orderId` is `null` for expired transactions
- `points` is positive in DB but the DTO mapping shows it as negative (see `ToLoyaltyTransactionResponse`)

## Implementation Steps

### ST 6.5.1 — Points Expiry Date Display

**File:** `src/components/loyalty/PointsBalanceCard.tsx`

Add expiry information below the balance line:

```tsx
// If backend returns expiry data
{nextExpiryDate && expiringPoints > 0 && (
    <p className="text-xs text-amber-600 mt-1">
        ⏰ {expiringPoints.toLocaleString()} pts expiring {new Date(nextExpiryDate).toLocaleDateString()}
    </p>
)}
```

**States:**
- **No expiry data available:** Don't show anything
- **Points expiring:** Show amber warning with count and date
- **Points expiring within 7 days:** Show as urgent (red/orange)
- **No points expiring:** Don't show

**Data source approach:**
- Option A: Backend extends balance endpoint with `nextExpiryDate` and `expiringPoints`
- Option B: Frontend fetches Earn transactions and calculates expiry dates client-side (12 months from earn date)
- Option C: Backend adds a dedicated endpoint `GET /api/loyalty/expiry`

**Recommended:** Option A (extend balance endpoint) for simplicity. If not available, use Option B.

**Client-side calculation (Option B):**
```ts
// Fetch completed Earn transactions
const { data: txnData } = usePointsTransactions({ type: 0, status: 1, pageSize: 100 })

const now = new Date()
const expiringSoon = txnData?.items
    .filter(tx => tx.type === 'Earn')
    .map(tx => {
        const expiryDate = new Date(tx.date)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        return { points: tx.points, expiryDate }
    })
    .filter(({ expiryDate }) => {
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30 // within 30 days
    })
```

### ST 6.5.2 — Expiry Notification Banner

**File:** `src/components/loyalty/LoyaltyPageContent.tsx` (or a shared notification component)

Show an alert banner at the top of the loyalty page when points are expiring soon.

**Banner variants:**
```
┌─────────────────────────────────────────┐
│ ⚠ 5,000 points will expire on          │
│   July 1, 2026. Redeem them before     │
│   they're gone.                     [×] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐  (urgent — within 7 days)
│ 🔴 2,000 points expiring in 3 days!    │
│   Redeem now to avoid losing them.  [×] │
└─────────────────────────────────────────┘
```

**States:**
- **Loading:** Skeleton for the banner area
- **No expiring points:** Hide banner (return null)
- **Points expiring > 7 days away:** Standard amber warning
- **Points expiring ≤ 7 days:** Urgent red/orange warning
- **Error:** Hide gracefully

**Component placement:**
```tsx
export function LoyaltyPageContent() {
    // ...
    return (
        <main>
            <ExpiryBanner /> {/* ← add this */}
            <section className="py-16">...</section>
            <section className="...">...</section>
        </main>
    )
}
```

**Dismissing the banner:**
- Allow users to dismiss the banner (store dismissal in localStorage or session)
- Banner reappears after 24 hours or on next visit

### Expired Transactions in History

**File:** `src/components/loyalty/PointsTransactionList.tsx`

The transaction list already rendered at `/loyalty` includes all transaction types. When `type === "Expired"`:

1. **Icon:** Use `Clock` or `Ban` icon (distinct from Earn's green up-arrow and Redeem's red down-arrow)
2. **Color:** Gray/muted (not green or red)
3. **Points display:** Show as negative (e.g., `-2,000`) in gray
4. **Description:** "Points expired due to inactivity" (from backend)
5. **Status badge:** No badge needed (Expired transactions are always Completed)

Update `PointsTransactionList.tsx`:

```tsx
// In the transaction row rendering:
const isEarn = txn.type === 'Earn'
const isExpired = txn.type === 'Expired'

const icon = isExpired ? Clock : isEarn ? ArrowUpRight : ArrowDownRight
const bgColor = isExpired ? 'bg-gray-100 text-gray-600' : isEarn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
const textColor = isExpired ? 'text-gray-500' : isEarn ? 'text-green-700' : 'text-red-700'
```

### Components Affected

| Component | Change |
|---|---|
| `PointsBalanceCard.tsx` | Add expiry date line |
| `PointsTransactionList.tsx` | Add Expired type rendering (icon, color) |
| `LoyaltyPageContent.tsx` | Add `ExpiryBanner` at top of page |
| New: `ExpiryBanner.tsx` | Alert banner for expiring points |

## Data Flow

```
/loyalty page
  ↓
usePointsBalance() → GET /api/loyalty/balance
  ↓
if nextExpiryDate exists → Show expiry info on PointsBalanceCard
  ↓
if expiringPoints > 0 → Show ExpiryBanner
  ↓
usePointsTransactions() → GET /api/loyalty/transactions
  ↓
PointsTransactionList renders Earn / Redeem / Expired entries
```
