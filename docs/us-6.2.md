# US 6.2 — Display Points Balance & Transaction History (ABC-247)

## What

Create a dedicated loyalty page at `/loyalty` showing the full points balance (hero section) and a paginated transaction history list. Two API calls: balance and transactions.

## Backend API

### GET /api/loyalty/balance

Same response as US 6.1.

```json
{
    "isSuccess": true,
    "data": {
        "balance": 30000,
        "discountEquivalent": 3000000,
        "lastUpdated": "2026-06-24T10:00:00Z"
    }
}
```

### GET /api/loyalty/transactions?page=1&pageSize=10

**Response:**
```json
{
    "isSuccess": true,
    "data": {
        "items": [
            {
                "id": "txn_01",
                "date": "2026-06-24T10:00:00Z",
                "type": "Earn",
                "points": 53,
                "orderId": 1001,
                "description": "Points earned from order #1001"
            }
        ],
        "page": 1,
        "pageSize": 10,
        "totalCount": 1,
        "totalPages": 1
    }
}
```

| Field | Type | Values |
|---|---|---|
| `id` | string | Transaction ID |
| `date` | DateTime | When the transaction occurred |
| `type` | string | `"Earn"` \| `"Redeem"` \| `"Expired"` |
| `points` | int | Points amount |
| `orderId` | int | The associated order number |
| `description` | string | Human-readable description |

**Note differences from current (wrong) frontend type:**
- Field `date`, not `createdAt`
- Field `orderId` (int), not `orderCode` (string)
- No `status` field — pending/complete distinction doesn't exist in API
- Type is capitalized: `"Earn"`, `"Redeem"`, `"Expired"` — not lowercased

## Implementation Steps

### ST 6.2.1 — Fix `LoyaltyTransaction` type

**File:** `src/types/loyalty.ts`

```ts
export interface LoyaltyTransaction {
    id: string
    date: string
    type: "Earn" | "Redeem" | "Expired"
    points: number
    orderId: number
    description: string
}

export interface PaginatedTransactions {
    items: LoyaltyTransaction[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}
```

### ST 6.2.2 — Create `usePointsBalance` and `usePointsTransactions` hooks

**File:** `src/hooks/usePoints.ts`

```ts
function usePointsBalance() → { balance, discountEquivalent, lastUpdated, isLoading, error }
  GET /api/loyalty/balance
  Returns LoyaltyBalanceResponse

function usePointsTransactions(page: number) → { items, page, totalPages, totalCount, isLoading, error }
  GET /api/loyalty/transactions?page={page}&pageSize=10
  Returns PaginatedTransactions
```

### ST 6.2.3 — Build the loyalty page hero section

**File:** `src/components/loyalty/PointsBalanceCard.tsx`

Redeploy the same component from US 6.1 in the hero position:

```
┌─────────────────────────────────────────────────┐
│   ★ Loyalty Rewards                              │
│                                                   │
│   30,000 pts        ┌──────────────────────┐     │
│   ≈ 3,000,000 VND   │  How points work →   │     │
│                      └──────────────────────┘     │
│   Last updated: 24 Jun 2026                        │
└─────────────────────────────────────────────────┘
```

### ST 6.2.4 — Build the paginated transaction list

**File:** `src/components/loyalty/PointsTransactionList.tsx`

Rewrite to match backend field names and type values.

**Key fixes vs. current component:**
- `txn.date` instead of `txn.createdAt`
- `txn.type === "Earn"` / `"Redeem"` / `"Expired"` — use exact string match
- Remove `txn.status` badge — API doesn't return a status field
- Remove `orderCode` — use `orderId` if needed for display

**Display rules per type:**

| Type | Icon | Color | Sign |
|---|---|---|---|
| `"Earn"` | ArrowUpRight | Green | `+X pts` |
| `"Redeem"` | ArrowDownRight | Red | `-X pts` |
| `"Expired"` | Clock | Amber | `-X pts` |

**States:**
- **Loading:** Skeleton rows
- **Error:** Error message + Retry button
- **Empty:** "No transactions yet" + description
- **Pagination:** Page number buttons when `totalPages > 1`

### ST 6.2.5 — Set up the dedicated loyalty page

**File:** `src/app/(shop)/loyalty/page.tsx`

```
┌────────────────────────────────────────────┐
│  Two-column layout:                         │
│                                             │
│  ┌───────┐ ┌──────────────────────────────┐ │
│  │ Hero  │ │ FAQ / Info                      │
│  │ Card  │ │ ───                            │
│  │       │ │ • How to earn (1 pt per        │ │
│  │       │ │   10,000 VND)                   │ │
│  │       │ │ • How to redeem (100 pts min,  │ │
│  │       │ │   1 pt = 100 VND)              │ │
│  │       │ │ • Points expire after 12       │ │
│  │       │ │   months                       │ │
│  └───────┘ └──────────────────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │ Points History (paginated list)          ││
│  └─────────────────────────────────────────┘│
└────────────────────────────────────────────┘
```

### ST 6.2.6 — Remove points from profile page

**File:** `src/components/profile/ProfileContent.tsx`

Remove the duplicate `PointsBalanceCard` that US 6.1 added to the profile. The loyalty page becomes the canonical place. If a compact summary is desired, replace the card with a simple stat line: "X pts available".

### Points Rates (for FAQ / info section)

| Property | Value |
|---|---|
| Earn rate | 10,000 VND spent = 1 point earned |
| Redeem rate | 1 point = 100 VND discount |
| Min redeem | 100 points per use |

## Data Flow

```
/loyalty page mounts
  ↓
usePointsBalance() ─→ GET /api/loyalty/balance ─→ PointsBalanceCard
usePointsTransactions(1) ─→ GET /api/loyalty/transactions?page=1&pageSize=10
  ↓
PointsTransactionList renders items with correct fields
User clicks page 2 → re-fetch with page=2
```
